import { useEffect, useState } from "react";
import adminApi from "../../service/adminApi";
import MemberDetailModal from "./MemberDetailModal";

export default function AdminMembersPage() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("ALL");

  const [page, setPage] = useState(1);
  const size = 10;

  const [rows, setRows] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [detail, setDetail] = useState(null); // 모달 데이터

  const load = async (p = page) => {
    setLoading(true);
    try {
      const { data } = await adminApi.getAdminMembers({
        p, size, q: query, role, sort: "mno,asc",
      });
      setRows(data.items || []);
      setTotalPages(data?.paging?.totalPage ?? 1);
      setPage(data?.paging?.currentPage ?? p);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); /* eslint-disable-next-line */ }, [role]);

  const handleSearch = (e) => {
    e.preventDefault();
    load(1);
  };

  const openDetail = async (memberNo) => {
    const mno = parseInt(memberNo, 10);
    const { data } = await adminApi.getAdminMemberDetail(mno);
    setDetail(data);
  };

  const changeRole = async (memberNo, currRole) => {
    const mno = parseInt(memberNo, 10);
    const next = currRole === "ADMIN" ? "USER" : "ADMIN";
    await adminApi.patchAdminMemberRole(mno, next);
    await load(page);
    if (detail?.basic?.mno === mno) {
      const { data } = await adminApi.getAdminMemberDetail(mno);
      setDetail(data);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 12 }}>회원 관리</h2>

      <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="아이디 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: "1 1 280px", minWidth: 220, padding: "8px 10px" }}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} style={{ padding: "8px 10px" }}>
          <option value="ALL">권한(전체)</option>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button type="submit">검색</button>
      </form>

      <table width="100%" cellSpacing="0" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>
            <th style={{ padding: 8, width: 120 }}>회원번호</th>
            <th style={{ padding: 8, width: 200 }}>아이디</th>
            <th style={{ padding: 8, width: 120 }}>권한</th>
            <th style={{ padding: 8, width: 120 }}>상태</th>
            <th style={{ padding: 8, width: 240 }}>액션</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((m) => (
            <tr key={m.memberNo} style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={{ padding: 8 }}>{m.memberNo}</td>
              <td style={{ padding: 8 }}>{m.userid}</td>
              <td style={{ padding: 8 }}>{m.role}</td>
              <td style={{ padding: 8 }}>{m.status}</td>
              <td style={{ padding: 8 }}>
                <button onClick={() => openDetail(m.memberNo)}>상세</button>
                <button onClick={() => changeRole(m.memberNo, m.role)} style={{ marginLeft: 6 }}>
                  권한변경
                </button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan="5" style={{ padding: 12, color: "#64748b" }}>
                {loading ? "로딩..." : "데이터가 없습니다."}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ marginTop: 12, display: "flex", gap: 6 }}>
        <button disabled={page <= 1} onClick={() => load(page - 1)}>이전</button>
        <button className="active">{page}</button>
        <button disabled={page >= totalPages} onClick={() => load(page + 1)}>다음</button>
      </div>

      {detail && <MemberDetailModal data={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}