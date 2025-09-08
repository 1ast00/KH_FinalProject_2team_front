import { useEffect, useRef, useState } from "react";
import styles from "../css/HealthDailyLog.module.css";
import {
  apiCreateHealthDailyLog,
  apiDeleteHealthDailyLog,
  apiFetchHealthDailyLogList,
  apiUpdateHealthDailyLog,
} from "../service/healthDailyLogApi";
import HealthDailyLogCard from "../components/HealthDailyLogCard";
import HealthDailyLogForm from "../components/HealthDailyLogForm";

/* 0906 팔레트 색 저장 유틸 - 시작 */
const LS_KEY = "hdl_card_colors";
const readColors = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch { return {}; }
};
const getColor = (hno) => readColors()[hno];
const setColor = (hno, color) => {
  if (!hno || !color) return;
  const m = readColors();
  m[hno] = color;
  localStorage.setItem(LS_KEY, JSON.stringify(m));
};
/* 0906 팔레트 색 저장 유틸 - 끝 */

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

  const decorate = (arr) => arr.map((it) => ({ ...it, bgcolor: getColor(it.hno) || it.bgcolor }));

  /* 내부 공용 로더: 필요 시 limit 강제 지정 */
  const load = async ({ reset = false, cursor = 0, date = "", forceLimit = null } = {}) => {
    if (loading) return;
    setLoading(true);
    try {
      const limit = forceLimit ?? (formOpen ? 8 : 12);
      const data = await apiFetchHealthDailyLogList({ cursor, limit, date });
      const decorated = decorate(data.items);
      if (reset) setItems(decorated);
      else setItems((prev) => [...prev, ...decorated]);
      setNextCursor(data.nextCursor ?? null);
    } finally {
      setLoading(false);
    }
  };

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

  /* 0906 폼에서 넘어온 payload에서 색상 안전 추출 - 시작 */
  const pickColorFromPayload = (p) => {
    if (!p) return "";
    // 가능한 모든 키를 받아들여서 실수 방지
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
  /* 0906 폼에서 넘어온 payload에서 색상 안전 추출 - 끝 */

  /* 0906 연속목록 노출(등록 직후 바로 1개 붙이기) + 팔레트 색 적용 - 시작 */
  const handleCreate = async (payload) => {
    const res = await apiCreateHealthDailyLog(payload);
    if (res.code === 1) {
      // 폼에서 넘어온 색상 추출 (키 이름이 달라도 수용)
      const picked = pickColorFromPayload(payload);
      if (picked) setColor(res.hno, picked);

      // 새로고침 없이 리스트 맨 위에 1개 즉시 추가
      const added = {
        hno: res.hno,
        hdateStr: (payload.hdate || "").replace(/-/g, "."),
        hdate: payload.hdate,
        sleeptimeStr: payload.sleeptime,              // "HH:MM"
        hweight: payload.weight,
        weight: payload.weight,
        wateramount: payload.wateramount,
        exercise: payload.exercise || "-",
        food: (payload.foods && payload.foods.length ? payload.foods.join("\n") : "-"),
        bgcolor: picked || getColor(res.hno),
      };
      setItems((prev) => [added, ...prev]);          // 즉시 1개 증가

      // 폼 닫고 상태 초기화
      setFormOpen(false);
      setEditTarget(null);

      // 백엔드 정합 위해 첫 페이지 최신화(비동기)
      load({ reset: true, cursor: 0, date: dateFilter, forceLimit: 12 });

      alert("등록되었습니다.");
    } else if (res.code === 3) {
      alert("같은 날짜의 건강일지가 이미 있습니다.");
    } else {
      alert(res.msg || "등록 실패");
    }
  };
  /* 0906 연속목록 노출(등록 직후 바로 1개 붙이기) + 팔레트 색 적용 - 끝 */

  const handleUpdate = async (hno, payload) => {
    const res = await apiUpdateHealthDailyLog(hno, payload);
    if (res.code === 1) {
      const picked = pickColorFromPayload(payload);
      if (picked) setColor(hno, picked);

      // 수정 후 전체 새로 로드로 동기화
      await load({ reset: true, cursor: 0, date: dateFilter, forceLimit: 12 });

      setFormOpen(false);
      setEditTarget(null);
      alert("수정되었습니다.");
    } else {
      alert("수정 실패");
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
      alert("삭제 실패");
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

  // 기존 토글(유지)
  const toggleFormOpen = () => {
    setFormOpen((prev) => {
      const next = !prev;
      if (!next) setEditTarget(null);
      return next;
    });
  };

  /* 0906 새 글 쓰기 버튼: 폼을 ‘완전 초기화’하여 열기 - 시작 */
  const openNewForm = () => {
    setEditTarget(null);
    setFormSeed((s) => s + 1);       // key 변경 → 컴포넌트 재마운트 → 이전 값 완전 초기화
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  /* 0906 새 글 쓰기 버튼: 폼을 ‘완전 초기화’하여 열기 - 끝 */

  return (
    <div className={styles.page}>
      {/* 배너 */}
      <div className={styles.heroWrap}>
        <div
          className={styles.hero}
          /* 0906 작성폼 닫는방법 추가 - 시작 */
          onClick={openNewForm}
          /* 0906 작성폼 닫는방법 추가 - 끝 */
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
          {/* 0906 새 글 폼 완전 초기화하여 열기 - 시작 */}
          <button className={styles.iconBtn} title="작성하기" onClick={openNewForm}>🖋</button>
          {/* 0906 새 글 폼 완전 초기화하여 열기 - 끝 */}
        </div>
      </div>

      {/* 2분할 + 좌측 그리드 열수 고정 */}
      <div className={`${styles.split} ${formOpen ? styles.open : ""}`}>
        <div className={styles.leftPane}>
          {items.length === 0 && !loading && (
            <div className={styles.empty}>
              <div className={styles.emptyEmoji}>🗒️</div>
              <div className={styles.emptyTitle}>건강일지를 작성해보세요</div>
              <div className={styles.emptySub}>오늘의 체중, 수면시간, 운동과 식단을 간단히 기록해요.</div>
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
                /* 0906 작성폼 닫는방법 추가 - 시작 */
                key={editTarget ? `edit-${editTarget.hno}` : `new-${formSeed}`}
                /* 0906 작성폼 닫는방법 추가 - 끝 */
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
    </div>
  );
}
