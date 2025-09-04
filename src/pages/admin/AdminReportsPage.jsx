import { useMemo, useState } from "react";
import styles from "./AdminMembersPage.module.css"; 

export default function AdminReportsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page] = useState(1);

  const rows = useMemo(
    () => [
      { id: 101, type: "댓글", title: "부적절한 댓글 신고", reporter: "사이하루", date: "2025-08-21", state: "대기" },
      { id: 102, type: "게시글", title: "광고성 게시글 신고", reporter: "YJM민채미", date: "2025-08-20", state: "처리" },
    ],
    []
  );

  const handleSearch = (e) => { e.preventDefault(); /* TODO: API 검색 */ };

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>신고 관리</h2>

      {/* 검색/필터 */}
      <form onSubmit={handleSearch} className={styles.filters}>
        <input
          className={styles.input}
          placeholder="제목/신고자 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className={styles.select}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="ALL">전체</option>
          <option value="WAIT">대기</option>
          <option value="PROC">처리</option>
        </select>
        <button type="submit" className={styles.btn}>검색</button>
      </form>

      {/* 테이블 */}
      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: 80 }}>ID</th>
              <th style={{ width: 100 }}>유형</th>
              <th>제목</th>
              <th style={{ width: 160 }}>신고자</th>
              <th style={{ width: 140 }}>신고일</th>
              <th style={{ width: 100 }}>상태</th>
              <th style={{ width: 200 }}>액션</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.type}</td>
                <td>{r.title}</td>
                <td>{r.reporter}</td>
                <td>{r.date}</td>
                <td><span className={styles.badge}>{r.state}</span></td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.btnGhost}>상세</button>
                    <button className={styles.btn}>처리 완료</button>
                    <button className={styles.btnDanger}>삭제</button>
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