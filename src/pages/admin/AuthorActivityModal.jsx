// src/pages/admin/AuthorActivityModal.jsx
import { useEffect, useState } from "react";
import { getAdminMealAuthorActivity, getAdminReviewDetail } from "../../service/adminApi";
import styles from "./AuthorActivityModal.module.css";

export default function AuthorActivityModal({ bmno, onClose, brno }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const res = await getAdminMealAuthorActivity(bmno);
        if (alive) setData(res.data);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [bmno]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const stop = (e) => e.stopPropagation();

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={stop}>
        {loading && <div className={styles.modal}>불러오는 중…</div>}
        {!loading && !data && <div className={styles.modal}>데이터가 없습니다.</div>}
        {!!data && (
          <>
            <header className={styles.header}>
              <h3>작성자 활동 요약</h3>
              <button className={styles.close} onClick={onClose}>✕</button>
            </header>

            <section className={styles.section}>
              <h4>작성자</h4>
              <div className={styles.kv}>
                <div><b>회원번호</b><span>{data.author.mno}</span></div>
                <div><b>ID</b><span>{data.author.userid}</span></div>
                <div><b>NICK</b><span>{data.author.nickname}</span></div>
                <div><b>게시글수</b><span>{data.author.postCount}</span></div>
                <div><b>신고(글)</b><span>{data.author.totalPostReports}</span></div>
                <div><b>신고(댓글)</b><span>{data.author.totalCommentReports}</span></div>
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
                    {data.posts?.length ? data.posts.map(p => (
                      <tr key={p.bmno}>
                        <td>{p.bmno}</td>
                        <td className={styles.ellipsis}>{p.title}</td>
                        <td>{p.writeDate}</td>
                        <td>{p.likeCount}</td>
                        <td>{p.commentCount}</td>
                        <td>{p.reportCount}</td>
                      </tr>
                    )) : (
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
                    {data.selfCommentsOnOwnPosts?.length ? data.selfCommentsOnOwnPosts.map(c => (
                      <tr key={c.bmcommentno}>
                        <td>{c.bmcommentno}</td>
                        <td>{c.bmno}</td>
                        <td className={styles.ellipsis}>{c.postTitle}</td>
                        <td className={styles.ellipsis}>{c.content}</td>
                        <td>{c.writeDate}</td>
                        <td>{c.likeCount}</td>
                        <td>{c.reportCount}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan={7} className={styles.empty}>없음</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
