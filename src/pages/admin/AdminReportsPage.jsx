import { useEffect, useState } from "react";
import styles from "./AdminMembersPage.module.css";
import {
  getAdminReports,
  patchAdminReportStatus,
  resolveAdminReport,
  deleteAdminReport,
} from "../../service/adminApi";
import { getUserData } from "../../util/authUtil";
import ReportDetailModal from "./ReportDetailModal";

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
  const [busy, setBusy] = useState({ id: null, kind: null }); // kind: 'status' | 'resolve' | 'delete'
  const [detailId, setDetailId] = useState(null);

  const me = getUserData?.(); // {mno,...} (resolve 호출 시 사용)

  const load = async (p = page) => {
    setLoading(true);
    try {
      const { data } = await getAdminReports({ p, size, q: query, type, status });
      setRows(data?.items ?? []);
      setTotalPages(data?.paging?.totalPage ?? data?.totalPage ?? 1);
      setPage(data?.paging?.currentPage ?? data?.currentPage ?? p);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); }, [query, type, status]);
  const handleSearch = (e) => { e.preventDefault(); load(1); };

  const setStatusAction = async (row, next) => {
    setBusy({ id: row.reportId, kind: "status" });
    try {
      await patchAdminReportStatus(row.reportId, next);
      await load(page);
    } finally { setBusy({ id: null, kind: null }); }
  };

  const onResolve = async (row) => {
    setBusy({ id: row.reportId, kind: "resolve" });
    try {
      await resolveAdminReport(row.reportId, me?.mno);
      await load(page);
    } finally { setBusy({ id: null, kind: null }); }
  };

  const onDelete = async (row) => {
    if (!window.confirm("이 신고 내역을 삭제할까요?")) return;
    setBusy({ id: row.reportId, kind: "delete" });
    try {
      await deleteAdminReport(row.reportId);
      await load(page);
    } finally { setBusy({ id: null, kind: null }); }
  };

  const mapStatusBadge = (s) => (s === "PENDING" ? "대기" : s === "DONE" ? "처리" : s);
  const mapTypeLabel  = (t) => (TYPE_OPTIONS.find(o => o.value === t)?.label ?? t);

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>신고 관리</h2>

      <form onSubmit={handleSearch} className={styles.filters}>
        <input
          className={styles.input}
          placeholder="유형/ID 검색"
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

      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: 80 }}>ID</th>
              <th style={{ width: 140 }}>유형</th>
              <th style={{ width: 160 }}>신고자MNO</th>
              <th style={{ width: 100 }}>상태</th>
              <th style={{ width: 320 }}>액션</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const isBusy = busy.id === r.reportId;
              return (
                <tr key={r.reportId}>
                  <td>{r.reportId}</td>
                  <td>{mapTypeLabel(r.targetType)}</td>
                  <td>{r.reporterMno}</td>
                  <td><span className={styles.badge}>{mapStatusBadge(r.status)}</span></td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.btnGhost} onClick={() => setDetailId(r.reportId)}>
                        상세
                      </button>
                      <button
                        className={styles.btn}
                        disabled={isBusy || r.status === "DONE"}
                        onClick={() => onResolve(r)}
                      >
                        {isBusy && busy.kind === "resolve" ? "처리중..." : "처리 완료"}
                      </button>
                      <button
                        className={styles.btn}
                        disabled={isBusy || r.status === "PENDING"}
                        onClick={() => setStatusAction(r, "PENDING")}
                      >
                        {isBusy && busy.kind === "status" ? "변경중..." : "대기 상태"}
                      </button>
                      <button
                        className={styles.btnDanger}
                        disabled={isBusy}
                        onClick={() => onDelete(r)}
                      >
                        {isBusy && busy.kind === "delete" ? "삭제중..." : "삭제"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={5} className={styles.empty}>데이터가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <button className={styles.pageBtn} onClick={() => load(page - 1)} disabled={page <= 1 || loading}>이전</button>
        <button className={`${styles.pageBtn} ${styles.pageCurrent}`} disabled>{page}</button>
        <button className={styles.pageBtn} onClick={() => load(page + 1)} disabled={page >= totalPages || loading}>다음</button>
      </div>

      {detailId && <ReportDetailModal reportId={detailId} onClose={() => setDetailId(null)} />}
    </div>
  );
}
