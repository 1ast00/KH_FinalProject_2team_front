import React from "react";
import { Link } from "react-router-dom";
// 1. CSS 모듈 경로 변경
import styles from "../../../css/board/BoardMealsAllview.module.css";

// 2. props 이름 변경: review -> meal
export default ({ meal, displayNo }) => {
  return (
    <>
      {/* 3. CSS 클래스명 변경 */}
      <td className={styles.col_bmno}>{displayNo}</td>
      <td className={styles.col_bmtitle}>
        {/* 4. 링크 경로 및 데이터 필드명 변경 */}
        <Link to={`/board/meals/${meal.bmno}`}>{meal.bmtitle}</Link>
      </td>
      <td className={styles.col_nickname}>{meal.nickname}</td>
      <td className={styles.col_date}>
        {new Date(meal.bmwrite_date).toLocaleDateString()}
      </td>
      <td className={styles.col_viewcount}>{meal.bmviewcount}</td>
      <td className={styles.col_likes}>❤️</td>
    </>
  );
};