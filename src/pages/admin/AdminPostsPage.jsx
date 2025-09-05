import { useEffect, useState } from "react";
import styles from "./AdminMembersPage.module.css";
import { getAdminMeals } from "../../service/adminApi";
import AuthorActivityModal from "./AuthorActivityModal";

export default function AdminPostsPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const size = 10;

  const [rows, setRows] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [detailBmno, setDetailBmno] = useState(null);

  const load = async (p = page) => {
    setLoading(true);
    try {
      const { data } = await getAdminMeals({ p, size, q });
      setRows(data?.items ?? []);
      setTotalPages(data?.totalPage ?? 1);
      setPage(data?.currentPage ?? p);
    } finally {
      setLoading(false);
    }
  };

  // 검색어만 의존
  useEffect(() => { load(1); }, [q]);

  const handleSearch = (e) => { e.preventDefault(); load(1); };

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>식단 게시판 관리</h2>

      {/* 검색 */}
      <form onSubmit={handleSearch} className={styles.filters}>
        <input
          className={styles.input}
          placeholder="제목/작성자 검색"
          value={q}
          onChange={(e) => setQ(e.target.value)}
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
              <th style={{ width: 140 }}>작성일</th>
              <th style={{ width: 100 }}>상태</th>
              <th style={{ width: 120 }}>액션</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.bmno}>
                <td>{r.bmno}</td>
                <td>{r.title}</td>
                <td>{r.writer}</td>
                <td>{r.writeDate}</td>
                <td><span className={styles.badge}>-</span></td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.btnGhost}
                      onClick={() => setDetailBmno(r.bmno)}
                    >
                      상세
                    </button>
                    <button className={styles.btn} disabled title="상태 컬럼 없음">토글</button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className={styles.empty}>데이터가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className={styles.pagination}>
        <button
          className={styles.pageBtn}
          onClick={() => load(page - 1)}
          disabled={page <= 1 || loading}
        >
          이전
        </button>
        <button className={`${styles.pageBtn} ${styles.pageCurrent}`} disabled>
          {page}
        </button>
        <button
          className={styles.pageBtn}
          onClick={() => load(page + 1)}
          disabled={page >= totalPages || loading}
        >
          다음
        </button>
      </div>

      {/* 상세 모달 */}
      {detailBmno && (
        <AuthorActivityModal bmno={detailBmno} onClose={() => setDetailBmno(null)} />
      )}
    </div>
  );
}
