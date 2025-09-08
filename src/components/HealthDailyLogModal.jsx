// src/components/HealthDailyLogModal.jsx
import React from "react";
import styles from "../css/HealthDailyLog.module.css";

/* 0907 이름 변경 - 시작 (AiFeedbackModal → HealthDailyLogModal) */
export default function HealthDailyLogModal({ open, loading, text, onClose }) {
  if (!open) return null;

  // 간단 URL 하이퍼링크 처리
  const linkify = (s) => {
    const parts = (s || "").split(/(\s+)/);
    return parts.map((t, i) => {
      const isUrl = /^https?:\/\/[^\s]+$/i.test(t);
      return isUrl ? (
        <a key={i} href={t} target="_blank" rel="noreferrer">{t}</a>
      ) : (
        <span key={i}>{t}</span>
      );
    });
  };

  return (
    <div className={styles.modalBack}>
      <div className={styles.modalBox}>
        <div className={styles.modalTitle}>AI 피드백</div>
        <div className={styles.modalBody}>
          {loading ? (
            <div className={styles.modalLoading}>피드백 생성 중...</div>
          ) : (
            <div className={styles.modalText}>{linkify(text)}</div>
          )}
        </div>
        <div className={styles.modalActions}>
          <button onClick={onClose} className={styles.primaryBtn}>확인</button>
        </div>
      </div>
    </div>
  );
}
/* 0907 이름 변경 - 끝 */
