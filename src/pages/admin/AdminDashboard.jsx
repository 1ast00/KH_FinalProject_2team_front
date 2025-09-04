import { useEffect, useState } from "react";
import styles from "./AdminDashboard.module.css";
import adminApi from "../../service/adminApi";

import {
  ResponsiveContainer,
  PieChart, Pie, Cell, Legend, Tooltip,
} from "recharts";

export default function AdminDashboard() {
  const [summary, setSummary] = useState({ totalMembers: 0 });
  const [genderRatio, setGenderRatio] = useState({ M: 0, F: 0 });
  const [recentReviews, setRecentReviews] = useState([]);
  const [recentDiets, setRecentDiets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const s = await adminApi.getAdminDashboardSummary();
        setSummary(s.data?.summary || { totalMembers: 0 });
        const gr = s.data?.genderRatio || { M: 0, F: 0, ETC: 0 };
        setGenderRatio({ M: gr.M || 0, F: gr.F || 0 });

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

  //  파이차트 데이터
  const pieData = [
    { name: "남자", value: genderRatio.M },
    { name: "여자", value: genderRatio.F },
  ];
  const COLORS = ["#60a5fa", "#f472b6"]; // 파랑, 핑크

  return (
    <div className={styles.grid}>
      {/* 왼쪽: 요약 */}
      <section className={styles.chartCol} aria-label="대시보드 요약">
        <h2 className={styles.sectionTitle}>관리자 대시보드</h2>

        {/* 총 이용자 수 */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>총 이용자 수</div>
          <div className={styles.statBox}>
            {loading ? "로딩..." : summary.totalMembers?.toLocaleString?.() ?? 0}
          </div>
        </div>

        {/* 성별 분포 (파이차트) */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>성별 분포(M/F)</div>
          <div className={styles.chartBox}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* 오른쪽: 최근 게시판 */}
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
                  <span className={styles.meta}>{r.author} • {r.date}</span>
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
                  <span className={styles.meta}>{p.author} • {p.date}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}