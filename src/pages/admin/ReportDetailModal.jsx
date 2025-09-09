import { useEffect, useState } from "react";
import { getAdminReportDetail } from "../../service/adminApi";
import styles from "./MemberDetailModal.module.css"; // 기존 모달 스타일 재사용

export default function ReportDetailModal({ reportId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await getAdminReportDetail(reportId);
        setData(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [reportId]);

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <h3 className={styles.h3}>신고 상세</h3>
          <button className={styles.closeBtn} onClick={onClose}>닫기</button>
        </div>

        {loading && <div style={{marginTop:12}}>불러오는 중…</div>}
        {!loading && !data && <div style={{marginTop:12}}>데이터가 없습니다.</div>}
        {!loading && data && (
          <>
            <section style={{marginTop:12}}>
              <div><b>Report ID</b> {data.reportId}</div>
              <div><b>유형</b> {data.targetType}</div>
              <div><b>대상 ID</b> {data.targetId}</div>
              <div><b>신고자 MNO</b> {data.reporterMno}</div>
              <div><b>상태</b> {data.status}</div>
            </section>

            <section style={{marginTop:12}}>
              <h4 className={styles.h4}>대상 스냅샷</h4>
              <div><b>작성자</b> {data.targetWriter || "-"}</div>
              {data.postTitle && <div><b>제목</b> {data.postTitle}</div>}
              {data.commentExcerpt && (
                <div style={{whiteSpace:"pre-wrap"}}>
                  <b>댓글</b> {data.commentExcerpt}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
