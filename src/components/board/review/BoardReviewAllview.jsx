import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BoardReviewItem from "./BoardReviewItem";
import styles from "../../../css/board/BoardReviewAllview.module.css";
import { getPostBoardList } from "../../../service/boardApi";
import { isAuthenticated } from "../../../util/authUtil"; 

export default () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);

  const handleRowClick = (brno) => {
    if (!isAuthenticated()) {
      alert("로그인 후 이용 해주세요.");
      navigate("/login"); 
    } else {
     navigate(`/board/review/${brno}`);
    }
  };

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
            <th className={styles.col_brno}>글번호</th>
            <th className={styles.col_brtitle}>제목</th>
            <th className={styles.col_nickname}>작성자</th>
            <th className={styles.col_date}>작성일</th>
            <th className={styles.col_viewcount}>조회수</th>
            <th className={styles.col_likes}>좋아요</th>
          </tr>
        </thead>
        <tbody>
          {/* 각 아이템을 BoardReviewItem 컴포넌트로 렌더링합니다. */}
          {reviews.map((review, index) => (
            <tr
              key={review.brno}
              onClick={() => handleRowClick(review.brno)}
              className={styles.row} // 클릭 가능한 행 스타일 추가
            >
              <BoardReviewItem
                key={review.brno}
                review={review}
                displayNo={reviews.length - index}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
