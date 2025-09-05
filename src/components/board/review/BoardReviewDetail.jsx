import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { reviewsAPI } from "../../../service/boardApi";
import { Viewer } from "@toast-ui/react-editor";
import { getUserData } from "../../../util/authUtil";
import styles from "../../../css/board/BoardReviewDetail.module.css";

export default function BoardReviewDetail() {
  const navigate = useNavigate();
  const { brno } = useParams();
  const [review, setReview] = useState(null);
  const [awesomeCount, setAwesomeCount] = useState(0); //25.09.03 awesomeCount
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userData = getUserData();
  const loggedInNickname = userData ? userData.nickname : "";
  const loggedInMno = userData ? userData.mno : null; // 로그인한 회원의 mno 가져오기
  const [awesomeMemberIds, setAwesomeMemberIds] = useState([]);

  useEffect(() => {
    const fetchReviewDetail = async () => {
      try {
        // console.log("brno:", brno);
        console.log("API 요청 시작"); // 이 메시지가 두 번 출력되면 조회수 2증가
        const response = await reviewsAPI.get(`/detail/${brno}`);
        setReview(response.data.review); // 'review' 키로 데이터에 접근
        setAwesomeCount(response.data.awesomeCount);
        setAwesomeMemberIds(response.data.awesomeMemberIds);
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

  
  const handleAwesomeToggle = async () => {
    if (!loggedInMno) {
      alert("로그인 후 이용해주세요");
      navigate("/login");
      return;
    }

    try {
      const response = await reviewsAPI.post(`/awesome`, {
        brno: brno,
        mno: loggedInMno,
      });

      setAwesomeCount(response.data.awesomeCount); 
      
      alert(response.data.msg);
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
      alert("오류가 발생하였습니다. 다시 시도해 주세요.");
    }
  };

  const heartIcon = awesomeCount > 0 ? "♥" : "♡";

  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.brtitle}>{review.brtitle}</h2>
        <hr className={styles.divider} />
      </div>
      <div className={styles.brinfo}>
        <div className={styles.brwriter}>
          <span className={styles.nickname}>{review.nickname}</span>
          <span className={styles.date}>
            작성일: {new Date(review.brwrite_date).toLocaleDateString()}
          </span>
          {review.brwrite_update && (
            <span className={styles.updatedDate}>
              수정일: {new Date(review.brwrite_update).toLocaleDateString()}
            </span>
          )}
        </div>
        <div className={styles.actions}>
          <button className={styles.btn_heart} onClick={handleAwesomeToggle}>
            {heartIcon} {awesomeCount}
          </button>
          <span>신고</span>
        </div>
      </div>
          <p></p>
      <div className={styles.brcontent}>
        <Viewer initialValue={review.brcontent} />
      </div>

      <hr className={styles.divider} />
      {/* 댓글 영역 (추후 추가할 공간) */}
      <div className={styles.commentSection}>
        {/* 로그인한 회원 아이디 (예시) */}
        <div className={styles.commentInputBox}>
          <span className={styles.loggedInUser}>{loggedInNickname}</span>
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
