// src/pages/admin/AdminDashboard.jsx
import { useMemo } from "react";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  // --- 더미 데이터(추후 Axios 교체) ---
  const latestReports = useMemo(
    () => [
      { id: 101, title: "부적절한 댓글 신고", author: "사이하루", date: "2025-08-21", like: true },
      { id: 102, title: "광고성 게시글 신고", author: "YJM민채미", date: "2025-08-20", like: false },
    ],
    []
  );

  const latestPosts = useMemo(
    () => [
      { id: 201, title: "오늘의 다이어트 식단", author: "diet_lee", date: "2025-08-22" },
      { id: 202, title: "웰빙 레시피 공유", author: "wellbeing", date: "2025-08-21" },
    ],
    []
  );

  return (
    <div className={styles.grid}>
      {/* 왼쪽: 차트 3개 */}
      <section className={styles.chartCol} aria-label="대시보드 차트">
        <h2 className={styles.sectionTitle}>관리자 대시보드</h2>

        <div className={styles.card}>
          <div className={styles.cardTitle}>신규 회원 수</div>
          <div className={`${styles.chartBox} ${styles.line}`} role="img" aria-label="신규 회원 수 라인 차트">
            Line Chart
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitle}>일자 별 신고 수</div>
          <div className={`${styles.chartBox} ${styles.bar}`} role="img" aria-label="일자 별 신고 수 바 차트">
            Bar Chart
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitle}>카테고리 별 분포도</div>
          <div className={`${styles.chartBox} ${styles.pie}`} role="img" aria-label="카테고리 별 분포도 파이 차트">
            Pie Chart
          </div>
        </div>
      </section>

      {/* 오른쪽: 최근 게시판 2개 + 댓글관리 버튼 */}
      <section className={styles.rightCol} aria-label="최근 활동 및 관리">
        <div className={styles.listCard}>
          <div className={styles.listHeader}>최근 신고</div>
          <ul className={styles.list}>
            {latestReports.map((r, idx) => (
              <li key={r.id}>
                <span className={styles.no}>{idx + 1}</span>
                {/* 모달 제거: 링크 -> 텍스트 */}
                <span className={styles.itemLink}>{r.title}</span>
                <span className={styles.meta}>
                  {r.author} • {r.date} {r.like ? "" : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.listCard}>
          <div className={styles.listHeader}>최근 게시글</div>
          <ul className={styles.list}>
            {latestPosts.map((p, idx) => (
              <li key={p.id}>
                <span className={styles.no}>{idx + 1}</span>
                {/* 모달 제거: 링크 -> 텍스트 */}
                <span className={styles.itemLink}>{p.title}</span>
                <span className={styles.meta}>
                  {p.author} • {p.date}
                </span>
              </li>
            ))}
          </ul>
        </div>

        
        <button className={styles.commentBtn} disabled aria-disabled="true" title="준비 중">
          댓글 관리
        </button>
      </section>
    </div>
  );
}
