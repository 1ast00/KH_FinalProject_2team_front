import styles from "./MemberDetailModal.module.css";

export default function MemberDetailModal({ data, onClose }) {
  const { basic, summary, recentPosts, recentComments } = data || {};
  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e)=>e.stopPropagation()}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <h3 className={styles.h3}>회원 상세</h3>
          <button className={styles.closeBtn} onClick={onClose}>닫기</button>
        </div>

        <section style={{marginTop:12}}>
          <h4 className={styles.h4}>기본 정보</h4>
          <div className={styles.grid2}>
            <div><b>회원번호</b> {basic?.memberNo}</div>
            <div><b>아이디</b> {basic?.userid}</div>
            <div><b>닉네임</b> {basic?.nickname}</div>
            <div><b>성별</b> {basic?.gender}</div>
            <div><b>키/체중/목표</b> {basic?.height} / {basic?.weight} / {basic?.goalWeight}</div>
            <div><b>권한/상태</b> {basic?.role} / {basic?.status}</div>
          </div>
        </section>

        <section style={{marginTop:16}}>
          <h4 className={styles.h4}>활동 요약</h4>
          <div className={styles.grid4}>
            <div>식단 글: <b>{summary?.dietPostCount ?? 0}</b></div>
            <div>리뷰 글: <b>{summary?.reviewPostCount ?? 0}</b></div>
            <div>식단 댓글: <b>{summary?.dietCommentCount ?? 0}</b></div>
            <div>리뷰 댓글: <b>{summary?.reviewCommentCount ?? 0}</b></div>
          </div>
        </section>

        <section style={{marginTop:16}}>
          <h4 className={styles.h4}>최근 게시글</h4>
          <table className={styles.table}>
            <thead><tr><th>구분</th><th>제목</th><th>작성일</th><th>상태</th></tr></thead>
            <tbody>
              {(recentPosts||[]).map(p=>(
                <tr key={`${p.board}-${p.id}`}><td>{p.board}</td><td>{p.title}</td><td>{p.createdDate}</td><td>{p.visible ? "게시":"숨김"}</td></tr>
              ))}
              {(!recentPosts || recentPosts.length===0) && <tr><td colSpan="4" className={styles.empty}>없음</td></tr>}
            </tbody>
          </table>
        </section>

        <section style={{marginTop:16}}>
          <h4 className={styles.h4}>최근 댓글</h4>
          <table className={styles.table}>
            <thead><tr><th>구분</th><th>내용</th><th>대상글</th><th>작성일</th><th>상태</th></tr></thead>
            <tbody>
              {(recentComments||[]).map(c=>(
                <tr key={`${c.board}-${c.id}`}><td>{c.board}</td><td>{c.excerpt}</td><td>{c.postTitle}</td><td>{c.createdDate}</td><td>{c.visible ? "게시":"숨김"}</td></tr>
              ))}
              {(!recentComments || recentComments.length===0) && <tr><td colSpan="5" className={styles.empty}>없음</td></tr>}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
