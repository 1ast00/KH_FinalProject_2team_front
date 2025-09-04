import { useEffect, useState } from "react";
import adminApi from "../../service/adminApi";
import styles from "./AdminMembersPage.module.css";

export default function AdminMembersPage() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("ALL");
  const [page, setPage] = useState(1);
  const size = 10;

  const [rows, setRows] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState({ id: null, type: null }); // 'role' | 'delete' | null

  const load = async (p = page) => {
    setLoading(true);
    try {
      const { data } = await adminApi.getAdminMembers({
        p,
        size,
        q: query,
        role,
        sort: "mno,asc",
      });
      setRows(data.items || []);
      setTotalPages(data?.paging?.totalPage ?? 1);
      setPage(data?.paging?.currentPage ?? p);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
    // eslint-disable-next-line
  }, [role]);

  const handleSearch = (e) => {
    e.preventDefault();
    load(1);
  };

  const changeRole = async (memberNo, currRole) => {
    const mno = parseInt(memberNo, 10);
    const next = currRole === "ROLE_ADMIN" ? "ROLE_USER" : "ROLE_ADMIN";
    try {
      setBusy({ id: mno, type: "role" });
      await adminApi.patchAdminMemberRole(mno, next);
      await load(page);
    } finally {
      setBusy({ id: null, type: null });
    }
  };

  const removeMember = async (memberNo) => {
    const mno = parseInt(memberNo, 10);
    if (!window.confirm("정말 삭제하시겠어요? 복구할 수 없습니다.")) return;
    try {
      setBusy({ id: mno, type: "delete" });
      await adminApi.deleteAdminMember(mno);
      await load(1);
    } finally {
      setBusy({ id: null, type: null });
    }
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>회원 관리</h2>

      {/* 검색 필터 */}
      <form onSubmit={handleSearch} className={styles.filters}>
        <input
          className={styles.input}
          type="text"
          placeholder="아이디 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className={styles.select}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="ALL">권한(전체)</option>
          <option value="ROLE_USER">ROLE_USER</option>
          <option value="ROLE_ADMIN">ROLE_ADMIN</option>
        </select>
        <button type="submit" className={styles.btn} disabled={loading}>
          {loading ? "검색 중..." : "검색"}
        </button>
      </form>

      {/* 테이블 */}
      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: 120 }}>회원번호</th>
              <th style={{ width: 200 }}>아이디</th>
              <th style={{ width: 80 }}>성별</th>
              <th style={{ width: 160 }}>권한</th>
              <th style={{ width: 240 }}>액션</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => {
              const isBusy = busy.id === parseInt(m.memberNo, 10);
              const isRoleBusy = isBusy && busy.type === "role";
              const isDeleteBusy = isBusy && busy.type === "delete";
              return (
                <tr key={m.memberNo}>
                  <td>{m.memberNo}</td>
                  <td>{m.userid}</td>
                  <td>{(m.gender || "").toUpperCase()}</td>
                  <td>
                    <span className={styles.badge}>{m.role}</span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.btn}
                        onClick={() => changeRole(m.memberNo, m.role)}
                        disabled={isBusy || loading}
                      >
                        {isRoleBusy ? "변경 중..." : "권한변경"}
                      </button>
                      <button
                        className={styles.btnDanger}
                        onClick={() => removeMember(m.memberNo)}
                        disabled={isBusy || loading}
                      >
                        {isDeleteBusy ? "삭제 중..." : "삭제"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: 12, color: "var(--muted)" }}>
                  {loading ? "로딩..." : "데이터가 없습니다."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className={styles.pagination}>
        <button
          className={styles.pageBtn}
          disabled={page <= 1 || loading}
          onClick={() => load(page - 1)}
        >
          이전
        </button>
        <button
          className={`${styles.pageBtn} ${styles.pageCurrent}`}
          aria-current="page"
          disabled
        >
          {page}
        </button>
        <button
          className={styles.pageBtn}
          disabled={page >= totalPages || loading}
          onClick={() => load(page + 1)}
        >
          다음
        </button>
      </div>
    </div>
  );
}