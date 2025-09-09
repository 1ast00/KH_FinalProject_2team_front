import { useEffect, useState } from "react";
import { getAdminReviewDetail } from "../../service/adminApi";
import styles from "./ReviewDetailModal.module.css";

export default function ReviewDetailModal({ brno, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getAdminReviewDetail(brno);
        setData(data || null);
      } finally {
        setLoading(false);
      }
    })();
  }, [brno]);

  const stop = (e) => e.stopPropagation();

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={stop}>
        <div className={styles.header}>
          <h3 style={{fontSize:18, fontWeight:800, margin:0}}>리뷰 상세</h3>
          <button className={styles.close} onClick={onClose}>닫기</button>
        </div>

        {loading && <div className={styles.empty}>불러오는 중…</div>}
        {!loading && !data && <div className={styles.empty}>데이터가 없습니다.</div>}

        {!!data && (
          <>
            {/* 메타 */}
            <section className={styles.section}>
              <div className={styles.kv}>
                <div><b>ID</b><span>{data.brno}</span></div>
                <div><b>작성자</b><span>{data.writer}</span></div>
                <div><b>작성일/상태</b><span>{data.writeDate} / {data.status}</span></div>
              </div>
            </section>

            {/* 제목 & 본문 */}
            <section className={styles.section}>
              <div className={styles.kv} style={{gridTemplateColumns:'1fr'}}>
                <div><b>제목</b><span>{data.title}</span></div>
              </div>
            </section>
            <section className={styles.section}>
              <div className={styles.tableWrap} style={{padding:12}}>
                <div style={{whiteSpace:'pre-wrap', lineHeight:1.6}}>{data.content}</div>
              </div>
            </section>

            {/* 최근 댓글 */}
            <section className={styles.section}>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th style={{width:100}}>ID</th>
                      <th>내용</th>
                      <th style={{width:160}}>작성자</th>
                      <th style={{width:160}}>작성일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(!data.comments || data.comments.length === 0) && (
                      <tr><td colSpan={4} className={styles.empty}>없음</td></tr>
                    )}
                    {!!data.comments && data.comments.map(c => (
                      <tr key={c.id}>
                        <td>{c.id}</td>
                        <td className={styles.ellipsis}>{c.content}</td>
                        <td>{c.writer}</td>
                        <td>{c.date}</td>
                      </tr>
                    ))}
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
