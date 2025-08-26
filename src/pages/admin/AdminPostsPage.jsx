import { useMemo, useState } from "react";

export default function AdminPostsPage() {
  const [query, setQuery] = useState("");

  const rows = useMemo(
    () => [
      { id: 201, title: "오늘의 다이어트 식단", author: "diet_lee", date: "2025-08-22", status: "게시" },
      { id: 202, title: "저당 레시피 3선", author: "wellbeing", date: "2025-08-21", status: "숨김" },
    ],
    []
  );

  const handleSearch = (e) => {
    e.preventDefault(); // 중요: 새로고침 방지
    // TODO: Axios 연동 시 query로 검색
    console.log("검색:", query);
  };

  return (
    <div>
      <h2 style={{ marginBottom: 12 }}>식단 게시판 관리</h2>

      <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          type="text"
          placeholder="제목/작성자 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: "8px 10px" }}
        />
        <button type="submit">검색</button>
      </form>

      <table width="100%" cellSpacing="0" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>
            <th style={{ padding: 8, width: 80 }}>ID</th>
            <th style={{ padding: 8 }}>제목</th>
            <th style={{ padding: 8, width: 160 }}>작성자</th>
            <th style={{ padding: 8, width: 140 }}>작성일</th>
            <th style={{ padding: 8, width: 100 }}>상태</th>
            <th style={{ padding: 8, width: 120 }}>액션</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={{ padding: 8 }}>{r.id}</td>
              <td style={{ padding: 8 }}>{r.title}</td>
              <td style={{ padding: 8 }}>{r.author}</td>
              <td style={{ padding: 8 }}>{r.date}</td>
              <td style={{ padding: 8 }}>{r.status}</td>
              <td style={{ padding: 8 }}>
                <button>상세</button>
                <button style={{ marginLeft: 6 }}>숨김/해제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 간단 페이지네이션 자리 */}
      <div style={{ marginTop: 12, display: "flex", gap: 6 }}>
        <button disabled>이전</button>
        <button className="active">1</button>
        <button disabled>다음</button>
      </div>
    </div>
  );
}
