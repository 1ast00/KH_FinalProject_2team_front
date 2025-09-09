import { useEffect, useState } from "react";
import { getAdminMealAuthorActivity } from "../../service/adminApi";
import styles from "./AuthorActivityModal.module.css"; // 없으면 간단한 CSS만들어도 OK

export default function AuthorActivityModal({ bmno, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await getAdminMealAuthorActivity(bmno);
        setData(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [bmno]);

  if (loading) return <Backdrop><div className={styles.modal}>불러오는 중…</div></Backdrop>;
  if (!data)   return <Backdrop><div className={styles.modal}>데이터가 없습니다.</div></Backdrop>;

  const { author, posts, selfCommentsOnOwnPosts } = data;

  return (
    <Backdrop onClick={onClose}>
      <div className={styles.modal} onClick={(e)=>e.stopPropagation()}>
        <header className={styles.header}>
          <h3>작성자 활동 요약</h3>
          <button className={styles.close} onClick={onClose}>✕</button>
        </header>

        <section className={styles.section}>
          <h4>작성자</h4>
          <div className={styles.kv}>
            <div><b>MNO</b><span>{author.mno}</span></div>
            <div><b>USER</b><span>{author.userid}</span></div>
            <div><b>NICK</b><span>{author.nickname}</span></div>
            <div><b>게시글수</b><span>{author.postCount}</span></div>
            <div><b>신고(글)</b><span>{author.totalPostReports}</span></div>
            <div><b>신고(댓글)</b><span>{author.totalCommentReports}</span></div>
          </div>
        </section>

        <section className={styles.section}>
          <h4>이 사용자가 올린 게시글</h4>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr><th>ID</th><th>제목</th><th>작성일</th><th>좋아요</th><th>댓글</th><th>신고</th></tr>
              </thead>
              <tbody>
                {posts?.map(p=>(
                  <tr key={p.bmno}>
                    <td>{p.bmno}</td>
                    <td className={styles.ellipsis}>{p.title}</td>
                    <td>{p.writeDate}</td>
                    <td>{p.likeCount}</td>
                    <td>{p.commentCount}</td>
                    <td>{p.reportCount}</td>
                  </tr>
                ))}
                {(!posts || posts.length===0) && (
                  <tr><td colSpan={6} className={styles.empty}>없음</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.section}>
          <h4>자기 글에 본인이 단 댓글</h4>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr><th>댓글ID</th><th>게시글ID</th><th>게시글 제목</th><th>내용</th><th>작성일</th><th>좋아요</th><th>신고</th></tr>
              </thead>
              <tbody>
                {selfCommentsOnOwnPosts?.map(c=>(
                  <tr key={c.bmcommentno}>
                    <td>{c.bmcommentno}</td>
                    <td>{c.bmno}</td>
                    <td className={styles.ellipsis}>{c.postTitle}</td>
                    <td className={styles.ellipsis}>{c.content}</td>
                    <td>{c.writeDate}</td>
                    <td>{c.likeCount}</td>
                    <td>{c.reportCount}</td>
                  </tr>
                ))}
                {(!selfCommentsOnOwnPosts || selfCommentsOnOwnPosts.length===0) && (
                  <tr><td colSpan={7} className={styles.empty}>없음</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Backdrop>
  );
}

function Backdrop({ children, onClick }) {
  return <div className={styles.backdrop} onClick={onClick}>{children}</div>;
}
