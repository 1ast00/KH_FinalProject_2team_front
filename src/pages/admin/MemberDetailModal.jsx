export default function MemberDetailModal({ data, onClose }) {
  const { basic, summary, recentPosts, recentComments } = data || {};

  return (
    <div style={backdrop} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <h3 style={{ margin: 0 }}>회원 상세</h3>
          <button onClick={onClose}>닫기</button>
        </div>

        <section style={{marginTop:12}}>
          <h4 style={h4}>기본 정보</h4>
          <div style={grid2}>
            <div><b>회원번호</b> {basic?.memberNo}</div>
            <div><b>아이디</b> {basic?.userid}</div>
            <div><b>닉네임</b> {basic?.nickname}</div>
            <div><b>성별</b> {basic?.gender}</div>
            <div><b>키/체중/목표</b> {basic?.height} / {basic?.weight} / {basic?.goalWeight}</div>
            <div><b>권한/상태</b> {basic?.role} / {basic?.status}</div>
          </div>
        </section>

        <section style={{marginTop:16}}>
          <h4 style={h4}>활동 요약</h4>
          <div style={grid4}>
            <div>식단 글: <b>{summary?.dietPostCount ?? 0}</b></div>
            <div>리뷰 글: <b>{summary?.reviewPostCount ?? 0}</b></div>
            <div>식단 댓글: <b>{summary?.dietCommentCount ?? 0}</b></div>
            <div>리뷰 댓글: <b>{summary?.reviewCommentCount ?? 0}</b></div>
          </div>
        </section>

        <section style={{marginTop:16}}>
          <h4 style={h4}>최근 게시글</h4>
          <table width="100%" cellSpacing="0" style={table}>
            <thead><tr><th>구분</th><th>제목</th><th>작성일</th><th>상태</th></tr></thead>
            <tbody>
            {(recentPosts||[]).map((p)=>(
              <tr key={`${p.board}-${p.id}`}>
                <td>{p.board}</td><td>{p.title}</td><td>{p.createdDate}</td><td>{p.visible ? "게시":"숨김"}</td>
              </tr>
            ))}
            {(!recentPosts || recentPosts.length===0) && <tr><td colSpan="4" style={{padding:8,color:"#64748b"}}>없음</td></tr>}
            </tbody>
          </table>
        </section>

        <section style={{marginTop:16}}>
          <h4 style={h4}>최근 댓글</h4>
          <table width="100%" cellSpacing="0" style={table}>
            <thead><tr><th>구분</th><th>내용</th><th>대상글</th><th>작성일</th><th>상태</th></tr></thead>
            <tbody>
            {(recentComments||[]).map((c)=>(
              <tr key={`${c.board}-${c.id}`}>
                <td>{c.board}</td><td>{c.excerpt}</td><td>{c.postTitle}</td><td>{c.createdDate}</td><td>{c.visible ? "게시":"숨김"}</td>
              </tr>
            ))}
            {(!recentComments || recentComments.length===0) && <tr><td colSpan="5" style={{padding:8,color:"#64748b"}}>없음</td></tr>}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

const backdrop = {
  position:"fixed", inset:0, background:"rgba(0,0,0,.35)", display:"flex", alignItems:"center", justifyContent:"center", zIndex: 50
};
const modal = {
  width:"min(920px, 92vw)", background:"#fff", borderRadius:12, padding:16, boxShadow:"0 10px 30px rgba(0,0,0,.15)"
};
const h4 = { margin:"0 0 8px 0" };
const grid2 = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 };
const grid4 = { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 };
const table = { borderCollapse:"collapse" };