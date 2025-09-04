import React from "react";
import { Link } from "react-router-dom";
import styles from "../../../css/board/BoardReviewAllview.module.css";

export default ({ review, displayNo }) => {
  return (
    <>
      <td className={styles.col_brno}>{displayNo}</td>
      <td className={styles.col_brtitle}>
        <Link to={`/board/review/${review.brno}`}>{review.brtitle}</Link>
      </td>
      <td className={styles.col_nickname}>{review.nickname}</td>
      <td className={styles.col_date}>
        {new Date(review.brwrite_date).toLocaleDateString()}
      </td>
      <td className={styles.col_viewcount}>{review.brviewcount}</td>
      <td className={styles.col_likes}>❤️</td>
    </>
  );
};