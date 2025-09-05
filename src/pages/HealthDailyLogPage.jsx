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

export default function HealthDailyLogPage() {
  const [items, setItems] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [dateFilter, setDateFilter] = useState("");
  const observerRef = useRef(null);

  const load = async ({ reset = false, cursor = 0, date = "" } = {}) => {
    if (loading) return;
    setLoading(true);
    try {
      const data = await apiFetchHealthDailyLogList({
        cursor,
        limit: formOpen ? 8 : 12,
        date,
      });
      if (reset) setItems(data.items);
      else setItems((prev) => [...prev, ...data.items]);
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

  const handleCreate = async (payload) => {
    const res = await apiCreateHealthDailyLog(payload);
    if (res.code === 1) {
      alert("등록되었습니다.");
      setFormOpen(false);
      setEditTarget(null);
      setItems([]);
      load({ reset: true, cursor: 0, date: dateFilter });
    } else if (res.code === 3) {
      alert("같은 날짜의 건강일지가 이미 있습니다.");
    } else {
      alert(res.msg || "등록 실패");
    }
  };

  const handleUpdate = async (hno, payload) => {
    const res = await apiUpdateHealthDailyLog(hno, payload);
    if (res.code === 1) {
      alert("수정되었습니다.");
      setFormOpen(false);
      setEditTarget(null);
      setItems([]);
      load({ reset: true, cursor: 0, date: dateFilter });
    } else {
      alert("수정 실패");
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    const res = await apiDeleteHealthDailyLog(item.hno);
    if (res.code === 1) {
      alert("삭제되었습니다.");
      setItems((prev) => prev.filter((x) => x.hno !== item.hno));
      load({ reset: true, cursor: 0, date: dateFilter });
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

  // 0903 작성 버튼 토글 안정화 - 시작
  const toggleFormOpen = () => {
    setFormOpen((prev) => {
      const next = !prev;
      if (!next) setEditTarget(null);
      return next;
    });
  };
  // 0903 작성 버튼 토글 안정화 - 끝

  return (
    <div className={styles.page}>
      {/* 배너 */}
      <div className={styles.heroWrap}>
        <div
          className={styles.hero}
          onClick={toggleFormOpen}
          title="새 건강일지 작성하기"
        >
          <img src="/img/healthdailylog_hero.jpg" alt="hero" />
          <div className={styles.heroOverlay}>
            <span>새 건강일지 작성하기</span>
          </div>
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
          <button className={styles.iconBtn} title="작성하기" onClick={toggleFormOpen}>🖋</button>
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
                /* 0903 수정폼 초기값 고정: edit 대상 바뀔 때 재마운트 - 시작 */
                key={editTarget ? `edit-${editTarget.hno}` : "new"}
                /* 0903 수정폼 초기값 고정 - 끝 */
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
