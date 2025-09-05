import { useEffect, useMemo, useState } from "react";
import styles from "./AdminMembersPage.module.css";
import { getAdminReports, resolveAdminReport, deleteAdminReport } from "../../service/adminApi";
import { getUserData } from "../../util/authUtil";

const TYPE_OPTIONS = [
  { value: "ALL", label: "전체" },
  { value: "MEAL_POST", label: "식단 게시글" },
  { value: "MEAL_COMMENT", label: "식단 댓글" },
  { value: "REVIEW_POST", label: "리뷰 게시글" },
  { value: "REVIEW_COMMENT", label: "리뷰 댓글" },
];

const STATUS_OPTIONS = [
  { value: "ALL", label: "전체" },
  { value: "PENDING", label: "대기" },
  { value: "DONE", label: "처리" },
];

export default function AdminReportsPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const size = 10;

  const [rows, setRows] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState({ id: null, type: null }); // 'resolve' | 'delete'

  const currentAdmin = getUserData?.(); // {mno, role, ...}

  const load = async (p = page) => {
    setLoading(true);
    try {
      const { data } = await getAdminReports({
        p: p,
        size,
        q: query,
        type,
        status,
      });
      setRows(data?.items ?? []);
      setTotalPages(data?.totalPage ?? 1);
      setPage(data?.currentPage ?? p);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); }, [query, type, status]);

  const onResolve = async (reportId) => {
    if (!currentAdmin?.mno) {
      alert("관리자 식별값(mno)을 찾을 수 없습니다.");
      return;
    }
    setBusy({ id: reportId, type: "resolve" });
    try {
      await resolveAdminReport(reportId, currentAdmin.mno);
      await load(page);
    } finally {
      setBusy({ id: null, type: null });
    }
  };

  const onDelete = async (reportId) => {
    if (!window.confirm("이 신고 내역을 삭제할까요?")) return;
    setBusy({ id: reportId, type: "delete" });
    try {
      await deleteAdminReport(reportId);
      // 현재 페이지에서 1건 지워진 상태에 맞춰 재조회
      await load(page);
    } finally {
      setBusy({ id: null, type: null });
    }
  };

  const mapStatusBadge = (s) => (s === "PENDING" ? "대기" : s === "DONE" ? "처리" : s);
  const mapTypeLabel = (t) => (TYPE_OPTIONS.find(o => o.value === t)?.label ?? t);

  const handleSearch = (e) => { e.preventDefault(); load(1); };

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>신고 관리</h2>

      {/* 검색/필터 */}
      <form onSubmit={handleSearch} className={styles.filters}>
        <input
          className={styles.input}
          placeholder="제목(스냅샷) 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className={styles.select} value={type} onChange={(e) => setType(e.target.value)}>
          {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <button type="submit" className={styles.btn} disabled={loading}>검색</button>
      </form>

      {/* 테이블 */}
      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: 80 }}>ID</th>
              <th style={{ width: 140 }}>유형</th>
              <th>제목 스냅샷</th>
              <th style={{ width: 120 }}>신고자MNO</th>
              <th style={{ width: 160 }}>신고일</th>
              <th style={{ width: 100 }}>상태</th>
              <th style={{ width: 210 }}>액션</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.reportId}>
                <td>{r.reportId}</td>
                <td>{mapTypeLabel(r.targetType)}</td>
                <td className={styles.ellipsis} title={r.titleSnapshot || ""}>
                  {r.titleSnapshot || "-"}
                </td>
                <td>{r.reporterMno}</td>
                <td>{r.createdAt}</td>
                <td><span className={styles.badge}>{mapStatusBadge(r.status)}</span></td>
                <td>
                  <div className={styles.actions}>
                    {/* 상세 모달은 추후 연결(타겟 이동/미리보기 등) */}
                    <button className={styles.btnGhost} disabled>상세</button>
                    <button
                      className={styles.btn}
                      disabled={r.status === "DONE" || busy.id === r.reportId}
                      onClick={() => onResolve(r.reportId)}
                    >
                      {busy.id === r.reportId && busy.type === "resolve" ? "처리중..." : "처리 완료"}
                    </button>
                    <button
                      className={styles.btnDanger}
                      disabled={busy.id === r.reportId}
                      onClick={() => onDelete(r.reportId)}
                    >
                      {busy.id === r.reportId && busy.type === "delete" ? "삭제중..." : "삭제"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={7} className={styles.empty}>데이터가 없습니다.</td></tr>
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
    </div>
  );
}
