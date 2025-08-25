import { useMemo, useState } from "react";

export default function AdminReviewsPage() {
  const [query, setQuery] = useState("");

  const rows = useMemo(
    () => [
      { id: 301, title: "다이어트 도시락 리뷰", author: "mint", rating: 5, date: "2025-08-20", status: "게시" },
      { id: 302, title: "샐러드바 솔직 후기", author: "yoon", rating: 3, date: "2025-08-19", status: "게시" },
    ],
    []
  );

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("검색:", query);
  };

  return (
    <div>
      <h2 style={{ marginBottom: 12 }}>리뷰 게시판 관리</h2>

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
            <th style={{ padding: 8, width: 100 }}>평점</th>
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
              <td style={{ padding: 8 }}>{r.rating}</td>
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

      <div style={{ marginTop: 12, display: "flex", gap: 6 }}>
        <button disabled>이전</button>
        <button className="active">1</button>
        <button disabled>다음</button>
      </div>
    </div>
  );
}
