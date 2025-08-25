import { useMemo, useState } from "react";

export default function AdminReportsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");

  const rows = useMemo(
    () => [
      { id: 101, type: "댓글", title: "부적절한 댓글 신고", reporter: "사이하루", date: "2025-08-21", state: "대기" },
      { id: 102, type: "게시글", title: "광고성 게시글 신고", reporter: "YJM민채미", date: "2025-08-20", state: "처리" },
    ],
    []
  );

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("검색:", { query, status });
  };

  return (
    <div>
      <h2 style={{ marginBottom: 12 }}>신고 관리</h2>

      <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          type="text"
          placeholder="제목/신고자 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: "8px 10px" }}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: "8px 10px" }}>
          <option value="ALL">전체</option>
          <option value="WAIT">대기</option>
          <option value="PROC">처리</option>
        </select>
        <button type="submit">검색</button>
      </form>

      <table width="100%" cellSpacing="0" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>
            <th style={{ padding: 8, width: 80 }}>ID</th>
            <th style={{ padding: 8, width: 100 }}>유형</th>
            <th style={{ padding: 8 }}>제목</th>
            <th style={{ padding: 8, width: 160 }}>신고자</th>
            <th style={{ padding: 8, width: 140 }}>신고일</th>
            <th style={{ padding: 8, width: 100 }}>상태</th>
            <th style={{ padding: 8, width: 160 }}>액션</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={{ padding: 8 }}>{r.id}</td>
              <td style={{ padding: 8 }}>{r.type}</td>
              <td style={{ padding: 8 }}>{r.title}</td>
              <td style={{ padding: 8 }}>{r.reporter}</td>
              <td style={{ padding: 8 }}>{r.date}</td>
              <td style={{ padding: 8 }}>{r.state}</td>
              <td style={{ padding: 8 }}>
                <button>상세</button>
                <button style={{ marginLeft: 6 }}>처리 완료</button>
                <button style={{ marginLeft: 6 }}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 12, display: "flex", gap: 6 }}>
        <button disabled>이전</button>
        <button className="active">1</button>
        <button disabled>다음</button>
      </div>
    </div>
  );
}
