// src/pages/admin/AdminMembersPage.jsx
import { useMemo, useState } from "react";

export default function AdminMembersPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [role, setRole] = useState("ALL");

  // TODO: Axios 연동 전 더미 데이터
  const rows = useMemo(
    () => [
      { id: "U001", username: "diet_lee",  email: "diet@ex.com",   joined: "2025-08-10", role: "USER",  state: "활성" },
      { id: "U002", username: "mint",      email: "mint@ex.com",   joined: "2025-08-12", role: "USER",  state: "정지" },
      { id: "A001", username: "admin",     email: "admin@ex.com",  joined: "2025-08-01", role: "ADMIN", state: "활성" },
    ],
    []
  );

  const handleSearch = (e) => {
    e.preventDefault(); // 중요: 새로고침 방지
    // TODO: Axios로 query/status/role 적용 검색
    console.log("검색:", { query, status, role });
  };

  return (
    <div>
      <h2 style={{ marginBottom: 12 }}>회원 관리</h2>

      {/* 검색/필터 */}
      <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="아이디/이메일 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: "1 1 280px", minWidth: 220, padding: "8px 10px" }}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: "8px 10px" }}>
          <option value="ALL">상태(전체)</option>
          <option value="ACTIVE">활성</option>
          <option value="SUSPENDED">정지</option>
        </select>
        <select value={role} onChange={(e) => setRole(e.target.value)} style={{ padding: "8px 10px" }}>
          <option value="ALL">권한(전체)</option>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button type="submit">검색</button>
      </form>

      {/* 테이블 */}
      <table width="100%" cellSpacing="0" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>
            <th style={{ padding: 8, width: 100 }}>회원번호</th>
            <th style={{ padding: 8, width: 180 }}>아이디</th>
            <th style={{ padding: 8 }}>이메일</th>
            <th style={{ padding: 8, width: 140 }}>가입일</th>
            <th style={{ padding: 8, width: 100 }}>권한</th>
            <th style={{ padding: 8, width: 100 }}>상태</th>
            <th style={{ padding: 8, width: 180 }}>액션</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((m) => (
            <tr key={m.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={{ padding: 8 }}>{m.id}</td>
              <td style={{ padding: 8 }}>{m.username}</td>
              <td style={{ padding: 8 }}>{m.email}</td>
              <td style={{ padding: 8 }}>{m.joined}</td>
              <td style={{ padding: 8 }}>{m.role}</td>
              <td style={{ padding: 8 }}>{m.state}</td>
              <td style={{ padding: 8 }}>
                <button>상세</button>
                <button style={{ marginLeft: 6 }}>정지/해제</button>
                <button style={{ marginLeft: 6 }}>권한변경</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 자리 */}
      <div style={{ marginTop: 12, display: "flex", gap: 6 }}>
        <button disabled>이전</button>
        <button className="active">1</button>
        <button disabled>다음</button>
      </div>
    </div>
  );
}