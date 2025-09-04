import styles from "../../css/board/BoardWeekly.module.css";
import React, { useState } from "react";

// BoardWeekly 컴포넌트 내부에 MyButton 컴포넌트 정의
const JoinButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={`${styles.btn_getin} ${isHovered ? styles.btn_expand : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered ? '+ 참여하기' : <span className={styles.btn_plus}>+</span>}
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
          <div className={styles.best}>Boardweekly: 출력 best1</div>
          <div className={styles.best}>Boardweekly: 출력 best2</div>
          <div className={styles.best}>Boardweekly: 출력 best3</div>
          <div className={styles.best}>Boardweekly: 출력 best4</div>
        
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