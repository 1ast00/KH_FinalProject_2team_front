import { useMemo, useState } from "react";
import styles from "./AdminMembersPage.module.css"; 

export default function AdminReviewsPage() {
  const [query, setQuery] = useState("");
  const [page] = useState(1);
  const rows = useMemo(
    () => [
      { id: 301, title: "다이어트 도시락 리뷰", author: "mint", rating: 5, date: "2025-08-20", status: "게시" },
      { id: 302, title: "샐러드바 솔직 후기", author: "yoon", rating: 3, date: "2025-08-19", status: "게시" },
    ],
    []
  );

  const handleSearch = (e) => { e.preventDefault(); /* TODO: API 검색 */ };

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>리뷰 게시판 관리</h2>

      {/* 검색 */}
      <form onSubmit={handleSearch} className={styles.filters}>
        <input
          className={styles.input}
          placeholder="제목/작성자 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className={styles.btn}>검색</button>
      </form>

      {/* 테이블 */}
      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: 80 }}>ID</th>
              <th>제목</th>
              <th style={{ width: 160 }}>작성자</th>
              <th style={{ width: 100 }}>평점</th>
              <th style={{ width: 140 }}>작성일</th>
              <th style={{ width: 100 }}>상태</th>
              <th style={{ width: 140 }}>액션</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.title}</td>
                <td>{r.author}</td>
                <td>{r.rating}</td>
                <td>{r.date}</td>
                <td><span className={styles.badge}>{r.status}</span></td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.btnGhost}>상세</button>
                    <button className={styles.btn}>{r.status === "게시" ? "숨김" : "해제"}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 (샘플) */}
      <div className={styles.pagination}>
        <button className={styles.pageBtn} disabled>이전</button>
        <button className={`${styles.pageBtn} ${styles.pageCurrent}`} aria-current="page" disabled>
          {page}
        </button>
        <button className={styles.pageBtn} disabled>다음</button>
      </div>
    </div>
  );
}
