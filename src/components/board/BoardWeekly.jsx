import styles from "../../css/board/BoardWeekly.module.css";
import React, { useState } from "react";

// BoardWeekly 컴포넌트 내부에 MyButton 컴포넌트 정의
const JoinButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={`${styles.btn_getin} ${isHovered ? styles.btn_expand : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered ? "＋ 참여하기" : <span className={styles.btn_plus}>＋</span>}
    </button>
  );
};

export default () => {

  return (
    <div className={styles.container}>
      <div className={styles.cheer}>
        회원님의 목표체중을 위한 실천을 응원합니다!
      </div>
      <div className={styles.bestline}>
        <div className={styles.bestbox}>
          <div className={styles.best}>
            Mudi <br />
            BMI 0.01%
            <br /> 목표체중55KG 10대
          </div>
          <div className={styles.best}>
            Terrier <br />
            BMI 2.15% <br />
            목표체중85kg 20대
          </div>
          <div className={styles.best}>
            Kooikerhondje
            <br /> BMI 5.09% <br />
            목표체중119KG 30대
          </div>
          <div className={styles.best}>
            Foresttree
            <br /> BMI 5.09% <br />
            목표체중 42kg 40대이상
          </div>

          <div className={styles.best_btnbox}>
            {/*} <button className={styles.btn_getin}>
            <label className={styles.btn_plus}>+</label>참여하기
          </button> */}
            <JoinButton />
          </div>
        </div>
      </div>
    </div>
  );
};