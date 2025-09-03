import styles from "../css/HealthDailyLog.module.css";

export default function HealthDailyLogCard({ item, onEdit, onDelete }) {
  const hasExercise = !!(item.exercise && item.exercise.trim() && item.exercise !== "-");
  const hasFood = !!(item.food && item.food.trim() && item.food !== "-");

  return (
    <div className={styles.card}>
      <div className={styles.cardDate}>{item.hdateStr}</div>

      <div className={styles.row}>
        <span className={styles.label}>체중</span>
        <span>{item.weight?.toFixed?.(1) ?? "-"}kg</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>수면 시간</span>
        <span>{item.sleeptimeStr ?? "-"}</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>물</span>
        <span>{item.wateramount} L</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>운동</span>
        <span className={!hasExercise ? styles.cross : ""}>
          {hasExercise ? item.exercise : "❌"}
        </span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>식단</span>
        <span className={`${styles.foodInline} ${!hasFood ? styles.cross : ""}`}>
          {hasFood ? item.food : "❌"}
        </span>
      </div>

      <div className={styles.cardActions}>
        <button onClick={() => onEdit(item)} className={styles.linkBtn}>수정</button>
        <button onClick={() => onDelete(item)} className={styles.linkBtn}>삭제</button>
      </div>
    </div>
  );
}
