import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { reviewsAPI } from "../../../service/boardApi";
import { Viewer } from "@toast-ui/react-editor";
import styles from "../../../css/board/BoardReviewDetail.module.css";

export default function BoardReviewDetail() {
  const { brno } = useParams();
  const [review, setReview] = useState(null);
  const [awesomeCount, setAwesomeCount] = useState(0); //25.09.03 awesomeCount
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviewDetail = async () => {
      try {
        const response = await reviewsAPI.get(`/detail/${brno}`);
        setReview(response.data.review); // 'review' 키로 데이터에 접근
        setAwesomeCount(response.data.awesomeCount);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchReviewDetail();
  }, [brno]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>오류가 발생했습니다: {error.message}</div>;
  }

  if (!review) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      {/* 이미지에 보이는 게시글 제목 영역 */}
      <h1 className={styles.brtitle}>{review.brtitle}</h1>
      <hr className={styles.divider} />

      {/* 작성자 정보 및 좋아요, 신고 버튼 영역 */}
      <div className={styles.brinfo}>
        <div className={styles.brwriter}>
          {/*<span className={styles.username}>{review.username}</span>*/} 
          <span className={styles.username}>{review.mname}</span> 
          review.username
          <span className={styles.date}>
            {new Date(review.brwrite_date).toLocaleDateString()}
          </span>
          {review.brwrite_update && (
            <span className={styles.updatedDate}>
              {" "}
              (수정: {new Date(review.brwrite_update).toLocaleDateString()})
            </span>
          )}
        </div>
        <div className={styles.actions}>
          {/* <span>❤ {review.awesomeCount}</span> */}
          <span>❤ {awesomeCount}</span>
          <span>신고</span>
        </div>
      </div>
      <hr className={styles.divider} />

      {/* TUI Viewer를 사용하여 HTML 내용을 렌더링 */}
      <div className={styles.brcontent}>
        <Viewer initialValue={review.brcontent} />
      </div>

      <hr className={styles.divider} />

      {/* 댓글 영역 (추후 추가할 공간) */}
      <div className={styles.commentSection}>
        {/* 로그인한 회원 아이디 (예시) */}
        <div className={styles.commentInputBox}>
          <span className={styles.loggedInUser}>로그인한 회원 아이디</span>
          <textarea
            className={styles.commentInput}
            placeholder="댓글을 남겨주세요."
            rows="3"
          />
          <button className={styles.commentSubmitBtn}>등록</button>
        </div>
        <div className={styles.commentList}>
          {/* 댓글 목록이 들어갈 자리 */}
        </div>
      </div>
    </div>
  );
}
