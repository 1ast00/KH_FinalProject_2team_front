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

  const gridCols = formOpen ? 2 : 4; // 요구: 기본 4개/2분할시 2개

  const load = async ({ reset = false, cursor = 0, date = "" } = {}) => {
    if (loading) return;
    setLoading(true);
    try {
      const data = await apiFetchHealthDailyLogList({ cursor, limit: formOpen ? 8 : 12, date });
      if (reset) {
        setItems(data.items);
      } else {
        setItems((prev) => [...prev, ...data.items]);
      }
      setNextCursor(data.nextCursor ?? null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 최초 및 모드(2분할/일반) 변경, 날짜필터 변경 시 새로 로드
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
    } else {
      alert("등록 실패");
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
    } else {
      alert("삭제 실패");
    }
  };

  const onEdit = (item) => {
    setEditTarget(item);
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.page}>

      {/* 히어로 + 오버레이 + 날짜검색 */}
      <div className={styles.heroWrap}>
        <div
          className={`${styles.hero} ${formOpen ? styles.heroSmall : ""}`}
          onClick={() => { setFormOpen(true); setEditTarget(null); }}
          title="새 건강일지 작성하기"
        >
          <img src="/img/healthdailylog_hero.jpg" alt="hero" />
          <div className={styles.heroOverlay}>
            <span>새 건강일지 작성하기</span>
          </div>
        </div>

        {/* 오른쪽 상단 달력 아이콘 영역(실제는 input[type=date]) */}
        <div className={styles.dateFilter}>
          <input
            type="date"
            value={dateFilter}
            onChange={(e)=>setDateFilter(e.target.value)}
            className={styles.dateInput}
            title="날짜로 검색"
          />
        </div>
      </div>

      {/* 2분할 레이아웃 */}
      <div className={`${styles.split} ${formOpen ? styles.open : ""}`}>
        {/* 좌측: 카드 그리드 */}
        <div className={styles.leftPane}>
          <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0,1fr))` }}>
            {items.map((it) => (
              <HealthDailyLogCard key={it.hno} item={it} onEdit={onEdit} onDelete={handleDelete} />
            ))}
          </div>
          <div id="healthdailylog-sentinel" className={styles.sentinel} />
          {loading && <div className={styles.loading}>로딩중...</div>}
        </div>

        {/* 우측: 작성/수정 폼 (슬라이드 인/아웃 애니메이션) */}
        <div className={styles.rightPane}>
          <div className={styles.formWrap}>
            {formOpen && (
              <HealthDailyLogForm
                initial={editTarget}
                onCancel={() => { setFormOpen(false); setEditTarget(null); }}
                onSubmit={(payload) => editTarget
                  ? handleUpdate(editTarget.hno, payload)
                  : handleCreate(payload)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}