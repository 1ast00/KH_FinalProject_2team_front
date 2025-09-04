import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BoardReviewItem from "./BoardReviewItem";
import styles from "../../../css/board/BoardReviewAllview.module.css";
import { getPostBoardList } from "../../../service/boardApi";

export default () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        console.log("시작");
        const response = await getPostBoardList();
        console.log(response);
        setReviews(response.reviewList);
      } catch (error) {
        console.error("상세 조회 실패:", error);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className={styles.container}>
      <table className={styles.boardTable}>
        <thead>
          <tr>
            <th className={styles.column_brno}>글번호</th>
            <th className={styles.column_brtitle}>제목</th>
            <th className={styles.column_mname}>작성자</th>
            <th className={styles.column_date}>작성일</th>
            <th className={styles.column_viewcount}>조회수</th>
            <th className={styles.column_likes}>좋아요</th>
          </tr>
        </thead>
        <tbody>
          {/* 각 아이템을 BoardReviewItem 컴포넌트로 렌더링합니다. */}
          {reviews.map((review, index) => (
            <BoardReviewItem
              key={review.brno}
              review={review}
              displayNo={reviews.length - index}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};