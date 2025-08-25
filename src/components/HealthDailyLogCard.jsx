import styles from "../css/HealthDailyLog.module.css";

export default function HealthDailyLogCard({ item, onEdit, onDelete }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardDate}>{item.hdateStr}</div>

      <div className={styles.row}><span className={styles.label}>몸무게</span>{item.weight?.toFixed?.(1) ?? "-" }kg</div>
      <div className={styles.row}><span className={styles.label}>수면</span>{item.sleeptimeStr ?? "-"}</div>
      <div className={styles.row}><span className={styles.label}>물</span>{item.wateramount} L</div>
      <div className={styles.row}><span className={styles.label}>운동</span>{item.exercise || "-"}</div>

      <div className={styles.foodWrap}>
        <span className={styles.label}>식단</span>
        <pre className={styles.food}>{item.food || "-"}</pre>
      </div>

      <div className={styles.cardActions}>
        <button onClick={() => onDelete(item)} className={styles.linkBtn}>삭제</button>
        <button onClick={() => onEdit(item)} className={styles.linkBtn}>수정</button>
      </div>
    </div>
  );
}