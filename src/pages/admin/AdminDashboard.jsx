import { useEffect, useMemo, useState } from "react";
import styles from "./AdminDashboard.module.css";
import adminApi from "../../service/adminApi";

export default function AdminDashboard() {
  const [summary, setSummary] = useState({ totalMembers: 0 });
  const [genderRatio, setGenderRatio] = useState({ M: 0, F: 0 });
  const [recentReviews, setRecentReviews] = useState([]);
  const [recentDiets, setRecentDiets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // 요약(총 이용자 + 성별 비율)
        const s = await adminApi.getAdminDashboardSummary();
        setSummary(s.data?.summary || { totalMembers: 0 });
        const gr = s.data?.genderRatio || { M: 0, F: 0, ETC: 0 };
        setGenderRatio({ M: gr.M || 0, F: gr.F || 0 });

        // 최근 리뷰/식단
        const [rv, dt] = await Promise.all([
          adminApi.getAdminRecentReviews(5).catch(() => ({ data: [] })),
          adminApi.getAdminRecentDiets(5).catch(() => ({ data: [] })),
        ]);
        setRecentReviews(rv.data || []);
        setRecentDiets(dt.data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalMF = (genderRatio.M || 0) + (genderRatio.F || 0);
  const mPct = totalMF ? Math.round((genderRatio.M * 100) / totalMF) : 0;
  const fPct = totalMF ? 100 - mPct : 0;

  return (
    <div className={styles.grid}>
      {/* 왼쪽: "총 이용자 수" + "성별 분포(M/F)" */}
      <section className={styles.chartCol} aria-label="대시보드 요약">
        <h2 className={styles.sectionTitle}>관리자 대시보드</h2>

        {/* 총 이용자 수 (숫자 카드) */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>총 이용자 수</div>
          <div className={styles.statBox}>
            {loading ? "로딩..." : summary.totalMembers?.toLocaleString?.() ?? 0}
          </div>
        </div>

        {/* 성별 분포 (M/F만) */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>성별 분포(M/F)</div>
          <div className={styles.chartBox}>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div>남 {genderRatio.M}명 ({mPct}%)</div>
              <div>여 {genderRatio.F}명 ({fPct}%)</div>
            </div>
          </div>
        </div>
      </section>

      {/* 오른쪽: 최근 리스트 2종 */}
      <section className={styles.rightCol} aria-label="최근 게시판">
        <div className={styles.listCard}>
          <div className={styles.listHeader}>최근 리뷰 게시판</div>
          {(!recentReviews || recentReviews.length === 0) ? (
            <div className={styles.empty}>데이터가 없습니다.</div>
          ) : (
            <ul className={styles.list}>
              {recentReviews.map((r, idx) => (
                <li key={r.id}>
                  <span className={styles.no}>{idx + 1}</span>
                  <span className={styles.itemLink}>{r.title}</span>
                  <span className={styles.meta}>
                    {r.author} • {r.date}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.listCard}>
          <div className={styles.listHeader}>최근 식단 게시판</div>
          {(!recentDiets || recentDiets.length === 0) ? (
            <div className={styles.empty}>데이터가 없습니다.</div>
          ) : (
            <ul className={styles.list}>
              {recentDiets.map((p, idx) => (
                <li key={p.id}>
                  <span className={styles.no}>{idx + 1}</span>
                  <span className={styles.itemLink}>{p.title}</span>
                  <span className={styles.meta}>
                    {p.author} • {p.date}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}