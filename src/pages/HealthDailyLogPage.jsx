import { useEffect, useRef, useState } from "react";
import styles from "../css/HealthDailyLog.module.css";
import {
  apiCreateHealthDailyLog,
  apiDeleteHealthDailyLog,
  apiFetchHealthDailyLogList,
  apiUpdateHealthDailyLog,
} from "../service/healthDailyLogApi";
/* 0907 이름 변경 - 시작 (postToAIHDL → postToAIHealthDailyLog) */
import { postToAIHealthDailyLog } from "../service/authApi";
/* 0907 이름 변경 - 끝 */
import HealthDailyLogCard from "../components/HealthDailyLogCard";
/* 0907 이름 변경 - 시작 (AiFeedbackModal → HealthDailyLogModal) */
import HealthDailyLogModal from "../components/HealthDailyLogModal";
/* 0907 이름 변경 - 끝 */
import HealthDailyLogForm from "../components/HealthDailyLogForm";

/* 0908 DB 색상 저장 전환 - 시작
   localStorage 유틸 전부 제거 (DB 컬럼 CARD_COLOR 사용) */
/* 0908 DB 색상 저장 전환 - 끝 */

export default function HealthDailyLogPage() {
  const [items, setItems] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [dateFilter, setDateFilter] = useState("");
  const observerRef = useRef(null);

  /* 0906 새 글 폼 완전 초기화를 위한 시드 - 시작 */
  const [formSeed, setFormSeed] = useState(0);
  /* 0906 새 글 폼 완전 초기화를 위한 시드 - 끝 */

  /* 0907 AI 모달 상태 - 시작 */
  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiText, setAiText] = useState("");
  /* 0907 AI 모달 상태 - 끝 */

  /* 0909 등록 알림 지연 표시를 위한 플래그 - 시작 */
  const [pendingCreateAlert, setPendingCreateAlert] = useState(false);
  /* 0909 등록 알림 지연 표시를 위한 플래그 - 끝 */

  /* 0908 DB 색상 저장 전환 - 시작
     더 이상 decorate로 색 주입하지 않음(서버가 bgcolor 내려줌) */
  const load = async ({ reset = false, cursor = 0, date = "", forceLimit = null } = {}) => {
    if (loading) return;
    setLoading(true);
    try {
      const limit = forceLimit ?? (formOpen ? 8 : 12);
      const data = await apiFetchHealthDailyLogList({ cursor, limit, date });
      if (reset) setItems(data.items);
      else setItems((prev) => [...prev, ...data.items]);
      setNextCursor(data.nextCursor ?? null);
    } finally {
      setLoading(false);
    }
  };
  /* 0908 DB 색상 저장 전환 - 끝 */

  useEffect(() => {
    setItems([]);
    load({ reset: true, cursor: 0, date: dateFilter });
    // eslint-disable-next-line
  }, [formOpen, dateFilter]);

  useEffect(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && nextCursor) {
            load({ cursor: nextCursor, date: dateFilter });
          }
        },
        { threshold: 1 }
      );
    }
    const el = document.getElementById("healthdailylog-sentinel");
    if (el) observerRef.current.observe(el);
    return () => el && observerRef.current.unobserve(el);
  }, [nextCursor, dateFilter, formOpen]);

  /* 0908 DB 색상 저장 전환 - 시작 */
  const pickColorFromPayload = (p) => {
    if (!p) return "";
    const cand =
      p.cardColor ||
      p.paletteColor ||
      p.selectedColor ||
      p.noteColor ||
      p.colorCode ||
      p.bgcolor ||
      p.backgroundColor ||
      p.background ||
      p.color ||
      p.theme ||
      p.themeColor ||
      p.bg;
    if (typeof cand === "string" && cand.trim()) return cand.trim();
    return "";
  };
  /* 0908 DB 색상 저장 전환 - 끝 */

  /* 0909 AI 출력 텍스트 정리(--- 제거) - 시작 */
  const sanitizeAiText = (s) =>
    (s || "")
      .replace(/^\s*[-*_]{3,}\s*$/gm, "")   // ---, ___, *** 단독 줄 제거
      .replace(/\n{3,}/g, "\n\n")           // 빈 줄 2개로 정리
      .trim();
  /* 0909 AI 출력 텍스트 정리(--- 제거) - 끝 */

  /* 0906 연속목록 노출 + 팔레트 색 적용 + AI 피드백 - 시작 */
  const handleCreate = async (payload) => {
    const res = await apiCreateHealthDailyLog(payload);
    if (res.code === 1) {
      const picked = pickColorFromPayload(payload);

      // 새 아이템 즉시 붙이기 (bgcolor = payload.cardColor)
      const added = {
        hno: res.hno,
        hdateStr: (payload.hdate || "").replace(/-/g, "."),
        hdate: payload.hdate,
        sleeptimeStr: payload.sleeptime,
        hweight: payload.weight,
        weight: payload.weight,
        wateramount: payload.wateramount,
        exercise: payload.exercise || "-",
        food: (payload.foods && payload.foods.length ? payload.foods.join("\n") : "-"),
        bgcolor: picked || null,
      };
      setItems((prev) => [added, ...prev]);

      // 폼 닫고 초기화 + 첫 페이지 동기화
      setFormOpen(false);
      setEditTarget(null);
      load({ reset: true, cursor: 0, date: dateFilter, forceLimit: 12 });

      // 0909 등록 알림 시점 조정 - 시작
      if (payload.aiOn) {
        setPendingCreateAlert(true);
      }
      // 0909 등록 알림 시점 조정 - 끝

      // AI 피드백
      if (payload.aiOn) {
        setAiOpen(true);
        setAiLoading(true);
        setAiText("");
        try {
          const txt = await postToAIHealthDailyLog(payload.aiPrompt || "");
          setAiText(sanitizeAiText(txt || "간단 피드백을 가져오지 못했습니다."));
        } catch {
          setAiText("AI 연결에 실패했습니다.");
        } finally {
          setAiLoading(false);
        }
      } else {
        // 0909 등록 알림 시점 조정(AI OFF일 때는 즉시) - 시작
        alert("등록되었습니다.");
        // 0909 등록 알림 시점 조정(AI OFF일 때는 즉시) - 끝
      }
    } else if (res.code === 3) {
      alert("같은 날짜의 건강일지가 이미 있습니다.");
    } else {
      alert(res.msg || "등록을 실패였습니다.");
    }
  };
  /* 0906 연속목록 노출 + 팔레트 색 적용 + AI 피드백 - 끝 */

  const handleUpdate = async (hno, payload) => {
    const res = await apiUpdateHealthDailyLog(hno, payload);
    if (res.code === 1) {
      await load({ reset: true, cursor: 0, date: dateFilter, forceLimit: 12 });
      setFormOpen(false);
      setEditTarget(null);
      alert("수정되었습니다.");
    } else {
      alert("수정을 실패하였습니다.");
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    const res = await apiDeleteHealthDailyLog(item.hno);
    if (res.code === 1) {
      setItems((prev) => prev.filter((x) => x.hno !== item.hno));
      await load({ reset: true, cursor: 0, date: dateFilter, forceLimit: 12 });
      alert("삭제되었습니다.");
    } else {
      alert("삭제를 실패하였습니다.");
    }
  };

  const onEdit = (item) => {
    setEditTarget(item);
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const triggerDate = () => {
    const hidden = document.getElementById("hdl_hidden_date");
    if (hidden) hidden.showPicker ? hidden.showPicker() : hidden.click();
  };

  const openNewForm = () => {
    setEditTarget(null);
    setFormSeed((s) => s + 1);
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* 0909 모달 닫힐 때 등록 알림 처리 - 시작 */
  const handleAiClose = () => {
    setAiOpen(false);
    if (pendingCreateAlert) {
      alert("등록되었습니다.");
      setPendingCreateAlert(false);
    }
  };
  /* 0909 모달 닫힐 때 등록 알림 처리 - 끝 */

  return (
    <div className={styles.page}>
      {/* 배너 */}
      <div className={styles.heroWrap}>
        <div
          className={styles.hero}
          onClick={openNewForm}
          title="새 건강일지 작성하기"
        >
          <img src="/img/healthdailylog_hero.jpg" alt="hero" />
        </div>

        {/* 배너 아래 오른쪽: 📆 🖋 */}
        <div className={styles.actionBar}>
          <input
            id="hdl_hidden_date"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className={styles.hiddenDate}
          />
          <button className={styles.iconBtn} title="날짜로 검색" onClick={triggerDate}>📆</button>
          <button className={styles.iconBtn} title="새 건강일지 작성하기" onClick={openNewForm}>🖋</button>
        </div>
      </div>

      {/* 2분할 + 좌측 그리드 열수 고정 */}
      <div className={`${styles.split} ${formOpen ? styles.open : ""}`}>
        <div className={styles.leftPane}>
          {items.length === 0 && !loading && (
            <div className={styles.empty}>
              <div className={styles.emptyEmoji}>🗒️</div>
              <div className={styles.emptyTitle}>건강일지를 작성해보세요</div>
              <div className={styles.emptySub}>오늘의 몸무게, 수면 시간, 물 섭취량, 운동과 식단을 간단히 기록해요</div>
            </div>
          )}

          <div className={`${styles.grid} ${formOpen ? styles.cols2 : styles.cols4}`}>
            {items.map((it) => (
              <HealthDailyLogCard
                key={it.hno}
                item={it}
                onEdit={onEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
          <div id="healthdailylog-sentinel" className={styles.sentinel} />
          {loading && <div className={styles.loading}>로딩중...</div>}
        </div>

        <div className={styles.rightPane}>
          <div className={styles.formWrap}>
            <div className={`${styles.collapsible} ${formOpen ? styles.open : ""}`}>
              <HealthDailyLogForm
                key={editTarget ? `edit-${editTarget.hno}` : `new-${formSeed}`}
                initial={editTarget}
                onCancel={() => {
                  setFormOpen(false);
                  setEditTarget(null);
                }}
                onSubmit={(payload) =>
                  editTarget ? handleUpdate(editTarget.hno, payload) : handleCreate(payload)
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI 모달 */}
      <HealthDailyLogModal
        open={aiOpen}
        loading={aiLoading}
        text={aiText}
        onClose={handleAiClose}  /* 0909 등록 알림 시점 조정 */
      />
    </div>
  );
}
