import styles from "../../css/BoardWeekly.module.css";

export default () => {

  return (
    <div className={styles.bwtitle}>
      <div className={styles.bestbox_before}>
        회원님의 목표체중을 위한 실천을 응원합니다!
      </div>
      <div className={styles.bestbox}>
        <div className={styles.best}>Boardweekly: 출력 best1</div>
        <div className={styles.best}>Boardweekly: 출력 best2</div>
        <div className={styles.best}>Boardweekly: 출력 best3</div>
        <div className={styles.best}>Boardweekly: 출력 best4</div>
        <div className={styles.best_btnbox}>
          <button className={styles.btn_getin}>
            <label className={styles.btn_plus}>+</label>참여하기
          </button>
        </div>
      </div>
    </div>
  );
};