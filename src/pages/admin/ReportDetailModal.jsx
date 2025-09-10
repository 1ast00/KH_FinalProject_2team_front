// src/pages/admin/ReportDetailModal.jsx
import { useEffect, useState } from "react";
import { getAdminReportDetail } from "../../service/adminApi";
import styles from "./ReportDetailModal.module.css";

export default function ReportDetailModal({ reportId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getAdminReportDetail(reportId);
        setData(res.data);
      } finally {
        setLoading(false);
      }
    })();
  }, [reportId]);

  const stop = (e) => e.stopPropagation();
  const mapStatus = (s, ko) => ko ?? (s && s.toUpperCase() === "PENDING" ? "대기"
                              : (s && (s.toUpperCase() === "RESOLVED" || s.toUpperCase() === "DONE")) ? "처리완료"
                              : s || "-");

  if (loading) return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={stop}><div className={styles.empty}>불러오는 중…</div></div>
    </div>
  );
  if (!data) return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={stop}><div className={styles.empty}>데이터가 없습니다.</div></div>
    </div>
  );

  // ----- 안전 폴백 -----
  const reporterMno        = data.reporterMno ?? data.reporter_mno;
  const reporterUserId     = data.reporterUserId ?? data.reporter_id ?? data.reporterUser ?? ""; // 아이디
  const reporterNick       = data.reporterNick ?? data.reporter_nick ?? "";                       // 닉네임
  const reporterDisplay    = reporterUserId ? `${reporterUserId} / ${reporterNick || reporterUserId}` : "-";

  const targetOwnerMno     = data.targetOwnerMno ?? data.targetWriterMno ?? data.target_mno ?? null;
  const targetOwnerUserId  = data.targetOwnerUserId ?? data.target_id_user ?? ""; // 신고대상 아이디
  const targetOwnerNick    = data.targetOwnerNick ?? data.targetWriterNick ?? "";
  const targetOwnerDisplay = targetOwnerUserId ? `${targetOwnerUserId} / ${targetOwnerNick || targetOwnerUserId}` : "-";

  const statusLabel        = mapStatus(data.status, data.statusKo);

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={stop}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <h3 className={styles.h3}>신고 상세</h3>
          <button className={styles.closeBtn} onClick={onClose}>닫기</button>
        </div>

        {/* 신고 정보 */}
        <section className={styles.section}>
          <h4 className={styles.h4}>신고 정보</h4>
          <div className={styles.kv}>
            {/* 사용자 ID = 신고자 아이디 */}
            <div><b>사용자 ID</b><span>{reporterUserId || "-"}</span></div>
            <div><b>신고자(회원번호)</b><span>{reporterMno ?? "-"}</span></div>
            <div><b>신고자(아이디/닉네임)</b><span>{reporterDisplay}</span></div>
            <div><b>처리 상태</b><span>{statusLabel}</span></div>
          </div>
        </section>

        {/* 대상 정보 */}
        <section className={styles.section}>
          <h4 className={styles.h4}>대상 정보</h4>
          <div className={styles.kv}>
            <div><b>신고대상ID</b><span>{targetOwnerUserId || "-"}</span></div>
            <div><b>신고대상(회원번호)</b><span>{targetOwnerMno ?? "-"}</span></div>
            <div><b>신고대상(아이디/닉네임)</b><span>{targetOwnerDisplay}</span></div>
            <div><b>대상 작성자(회원번호)</b><span>{targetOwnerMno ?? "-"}</span></div>
            <div><b>대상 작성자(아이디/닉네임)</b><span>{targetOwnerDisplay}</span></div>
          </div>
        </section>

        {/* 글 제목/댓글 내용 (있을 때만) */}
        {data.postTitle && (
          <section className={styles.section}>
            <div className={styles.kv} style={{gridTemplateColumns:"1fr"}}>
              <div><b>대상 제목</b><span>{data.postTitle}</span></div>
            </div>
          </section>
        )}
        {data.commentExcerpt && (
          <section className={styles.section}>
            <div className={styles.tableWrap} style={{padding:12}}>
              <div style={{whiteSpace:"pre-wrap", lineHeight:1.6}}>
                <b>대상 댓글 내용</b> {data.commentExcerpt}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
