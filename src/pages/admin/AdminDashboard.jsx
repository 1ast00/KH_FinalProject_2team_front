// src/pages/admin/AdminDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import styles from "./AdminDashboard.module.css";

import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";

export default function AdminDashboard() {
  const [summary, setSummary] = useState({ totalMembers: 0, newThisWeek: 0 });
  const [genderRatio, setGenderRatio] = useState({ M: 0, F: 0 });

  const [recentReviews, setRecentReviews] = useState([]);
  const [recentDiets, setRecentDiets] = useState([]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // --- 로컬 폴백들 (백엔드 실패 시 사용) ---
  const mkDate = (minusDay = 0) =>
    new Date(Date.now() - minusDay * 86400000).toISOString().slice(0, 10);

  const FALLBACK = {
    summary: { totalMembers: 60, newThisWeek: 4 },
    gender: { M: 30, F: 30 },
    reviews: [
      { id: "r1", title: "체지방 감량기 #8", createdAt: mkDate(0) },
      { id: "r2", title: "러닝 기록 #7", createdAt: mkDate(1) },
      { id: "r3", title: "홈트 루틴 공유 #6", createdAt: mkDate(2) },
    ],
    diets: [
      { id: "d1", title: "보충제 맛 비교 #5", createdAt: mkDate(0) },
      { id: "d2", title: "체지방 감량기 #8", createdAt: mkDate(3) },
      { id: "d3", title: "유지어트 꿀팁 #3", createdAt: mkDate(5) },
    ],
  };

  const loadAll = async () => {
    try {
      setLoading(true);
      setErr("");

      // === API 호출 제거, 무조건 FALLBACK 사용 ===
      setSummary(FALLBACK.summary);
      setGenderRatio(FALLBACK.gender);
      setRecentReviews(FALLBACK.reviews);
      setRecentDiets(FALLBACK.diets);
    } catch (e) {
      setErr("대시보드 데이터를 불러오지 못했습니다.");
      setSummary(FALLBACK.summary);
      setGenderRatio(FALLBACK.gender);
      setRecentReviews(FALLBACK.reviews);
      setRecentDiets(FALLBACK.diets);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 총 회원 수 라인(지난주 → 이번주)
  const totalMembersLine = useMemo(() => {
    const total = Number(summary.totalMembers || 0);
    const lastWeek = Math.max(0, total - Number(summary.newThisWeek || 0));
    return [
      { name: "지난주", value: lastWeek },
      { name: "이번주", value: total },
    ];
  }, [summary]);

  // 성별 파이(남/여만)
  const genderPieData = useMemo(
    () => [
      { name: "남성", value: Number(genderRatio.M || 0) },
      { name: "여성", value: Number(genderRatio.F || 0) },
    ],
    [genderRatio]
  );
  const PIE_COLORS = ["#8884d8", "#82ca9d"];

  const fmtDate = (s) => {
    try {
      const d = new Date(s);
      if (Number.isNaN(d.getTime())) return s || "";
      return d.toLocaleDateString?.("ko-KR") || s;
    } catch {
      return s || "";
    }
  };

  return (
    <div className={styles.grid}>
      <section className={styles.chartCol} aria-label="대시보드 차트">
        <h2 className={styles.sectionTitle}>관리자 대시보드</h2>

        {/* 1) 총 회원 수 */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>
            총 회원 수 <small>(지난주 → 이번주)</small>
          </div>
          <div className={styles.kpis}>
            <span>
              총 회원: {loading ? "Loading..." : (summary.totalMembers?.toLocaleString?.() || 0)}
            </span>
          </div>
          <div className={styles.chartBox} role="img" aria-label="총 회원 수 라인 차트">
            {loading ? (
              <div className={styles.skeleton}>Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={totalMembersLine} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 2) 성별 분포 */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>카테고리 별 분포도(성별)</div>
          <div className={styles.chartBox} role="img" aria-label="카테고리 별 분포도 파이 차트">
            {loading ? (
              <div className={styles.skeleton}>Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Tooltip />
                  <Legend />
                  <Pie
                    data={genderPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label
                  >
                    {genderPieData.map((_, idx) => (
                      <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {err && <p className={styles.errorMsg}>{err}</p>}

        {/* 새로고침 */}
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <button className={styles.refreshBtn} onClick={loadAll} disabled={loading}>
            {loading ? "갱신 중..." : "새로고침"}
          </button>
        </div>
      </section>

      {/* 오른쪽: 최근 게시글 */}
      <section className={styles.rightCol} aria-label="최근 활동 및 관리">
        <div className={styles.listCard}>
          <div className={styles.listHeader}>최근 리뷰 게시글</div>
          <ul className={styles.list}>
            {(recentReviews || []).length === 0 && <li>데이터가 없습니다.</li>}
            {(recentReviews || []).map((r, idx) => (
              <li key={r.id ?? idx}>
                <span className={styles.no}>{idx + 1}</span>
                <a className={styles.itemLink} href="#!" title={r.title}>{r.title}</a>
                <span className={styles.meta}>{fmtDate(r.createdAt)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.listCard}>
          <div className={styles.listHeader}>최근 식단 게시글</div>
          <ul className={styles.list}>
            {(recentDiets || []).length === 0 && <li>데이터가 없습니다.</li>}
            {(recentDiets || []).map((p, idx) => (
              <li key={p.id ?? idx}>
                <span className={styles.no}>{idx + 1}</span>
                <a className={styles.itemLink} href="#!" title={p.title}>{p.title}</a>
                <span className={styles.meta}>{fmtDate(p.createdAt)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
