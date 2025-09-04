import React from "react";
import { Link } from "react-router-dom";
import styles from "../../../css/board/BoardReviewAllview.module.css"; // CSS 파일 경로 수정

export default ({ review, displayNo }) => {
  // 컴포넌트가 <tr>을 반환하도록 수정합니다.
  return (
    <tr className={styles.boardRow}>
      <td className={styles.column_brno}>{displayNo}</td>
      <td className={styles.column_brtitle}>
        {/* to 속성은 프런트엔드 라우팅 경로를 의미 */}
        <Link to={`/board/review/${review.brno}`}>{review.brtitle}</Link>
      </td>
      <td className={styles.column_mname}>{review.mname}</td>
      <td className={styles.column_date}>
        {new Date(review.brwrite_date).toLocaleDateString()}
      </td>
      <td className={styles.column_viewcount}>{review.brviewcount}</td>
      <td className={styles.column_likes}>❤️</td>
    </tr>
  );
};
