import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BoardReviewItem from "./BoardReviewItem";
import styles from "../../../css/board/BoardReviewAllview.module.css";
import axios from "axios";

export default () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9999/api/reviews/list")
      .then((res) => {
        setReviews(res.data);
        console.log("boardReview_res: ", res.data);
      })
      .catch((err) => {
        console.error("리뷰 목록 불러오기 실패", err);
      });
  }, []);

  return (
    <div className={styles.container}>
      {/*<div>
        <p>리뷰하기 게시판 전체 출력</p>
        <button onClick={() => navigate(-1)}>뒤로가기</button>
      </div>*/}
      <div>
        {reviews.map((review) => (
          <BoardReviewItem key={review.brno} review={review} />
        ))}
      </div>
    </div>
  );
};
