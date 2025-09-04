import styles from "../css/HealthDailyLog.module.css";

export default function HealthDailyLogCard({ item, onEdit, onDelete }) {
  const hasExercise = !!(item.exercise && item.exercise.trim() && item.exercise !== "-");
  const hasFood = !!(item.food && item.food.trim() && item.food !== "-");

  // 0903 표시 문자열 정리(, 로 이어주고 툴팁 제공) - 시작
  const exerciseTitle = hasExercise ? item.exercise : "";
  const foodTitle = hasFood ? item.food : "";
  const exerciseDisplay = hasExercise ? item.exercise.split("\n").join(", ") : "❌";
  const foodDisplay = hasFood ? item.food.replace(/\n/g, ", ") : "❌";
  // 0903 표시 문자열 정리(, 로 이어주고 툴팁 제공) - 끝

  return (
    <div className={styles.card}>
      <div className={styles.cardDate}>{item.hdateStr}</div>

      <div className={styles.row}>
        <span className={styles.label}>몸무게</span>
        <span>{item.weight?.toFixed?.(2) ?? "-"}kg</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>수면 시간</span>
        <span>{item.sleeptimeStr ?? "-"}</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>물</span>
        <span>{item.wateramount ?? "-"} L</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>운동</span>
        <span
          className={`${!hasExercise ? styles.cross : styles.limit2} ${styles.keepWords}`}
          title={exerciseTitle}
        >
          {exerciseDisplay}
        </span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>식단</span>
        <span
          className={`${styles.foodInline} ${!hasFood ? styles.cross : ""} ${styles.keepWords}`}
          title={foodTitle}
        >
          {foodDisplay}
        </span>
      </div>

      <div className={styles.cardActions}>
        <button onClick={() => onEdit(item)} className={styles.linkBtn}>수정</button>
        <button onClick={() => onDelete(item)} className={styles.linkBtn}>삭제</button>
      </div>
    </div>
  );
}
