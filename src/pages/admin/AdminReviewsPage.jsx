// src/pages/admin/AdminReviewsPage.jsx
import { useEffect, useState } from "react";
import styles from "./AdminMembersPage.module.css";
import { getAdminReviews, patchAdminReviewStatus } from "../../service/adminApi";
import ReviewDetailModal from "./ReviewDetailModal"; 

export default function AdminReviewsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL"); // ALL | POSTED | HIDDEN
  const [page, setPage] = useState(1);
  const size = 10;

  const [rows, setRows] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState({ id: null });

  // 상세 모달 (리뷰 상세)
  const [detailBrno, setDetailBrno] = useState(null);
  const openDetail = (brno) => setDetailBrno(brno);
  const closeDetail = () => setDetailBrno(null);

  const load = async (p = page) => {
    setLoading(true);
    try {
      const { data } = await getAdminReviews({ p, size, q, status });
      setRows(data?.items ?? []);
      setTotalPages(data?.totalPage ?? 1);
      setPage(data?.currentPage ?? p);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); }, [q, status]);

  const handleSearch = (e) => { e.preventDefault(); load(1); };

  const onToggle = async (row) => {
    setBusy({ id: row.brno });                  
    try {
      const toPosted = row.visible !== "게시";
      await patchAdminReviewStatus(row.brno, toPosted); 
      await load(page);
    } finally {
      setBusy({ id: null });
    }
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>리뷰 게시판 관리</h2>

      {/* 검색/필터 */}
      <form onSubmit={handleSearch} className={styles.filters}>
        <input
          className={styles.input}
          placeholder="제목/작성자 검색"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className={styles.select}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="ALL">전체</option>
          <option value="POSTED">게시</option>
          <option value="HIDDEN">숨김</option>
        </select>
        <button type="submit" className={styles.btn} disabled={loading}>검색</button>
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
              <th style={{ width: 160 }}>액션</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.brno}>                                  
                <td>{r.brno}</td>                                
                <td className={styles.ellipsis}>{r.title}</td>
                <td>{r.writer}</td>
                <td>{r.writeDate}</td>
                <td>
                  <span className={styles.badge}>{r.visible ?? "-"}</span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.btnGhost}
                      type="button"
                      onClick={() => openDetail(r.brno)}         
                    >
                      상세
                    </button>
                    <button
                      className={styles.btn}
                      type="button"
                      disabled={busy.id === r.brno}              
                      onClick={() => onToggle(r)}
                    >
                      {busy.id === r.brno
                        ? "처리중..."
                        : (r.visible === "게시" ? "숨김" : "게시")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={6} className={styles.empty}>데이터가 없습니다.</td></tr>
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

      {detailBrno !== null && (
        <ReviewDetailModal brno={detailBrno} onClose={closeDetail} /> 
      )}
    </div>
  );
}
