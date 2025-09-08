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
  const [awesomeCount, setAwesomeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userData = getUserData();
  const loggedInNickname = userData ? userData.nickname : "";
  const loggedInMno = userData ? userData.mno : null;
  const [awesomeMemberIds, setAwesomeMemberIds] = useState([]);
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    const fetchReviewDetail = async () => {
      try {
        const response = await reviewsAPI.get(`/detail/${brno}`);
        setReview(response.data.review);
        setAwesomeCount(response.data.awesomeCount);
        setAwesomeMemberIds(response.data.awesomeMemberIds);

        if (response.data.review.mno === loggedInMno) {
          setIsAuthor(true);
        }

        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchReviewDetail();
  }, [brno, loggedInMno]);

  const handleEdit = () => {
    navigate(`/board/review/write/${brno}`, { state: { review } });
  };

  const handleDelete = async () => {
    if (window.confirm("정말 게시글을 삭제하시겠습니까?")) {
      try {
        const response = await reviewsAPI.delete(`/${brno}`);
        alert(response.data.msg);
        if (response.data.code === 1) {
          navigate("/board/review");
        }
      } catch (error) {
        console.error("게시글 삭제 실패:", error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

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

  const handleDanger = async () => {
    if (!loggedInMno) {
      alert("로그인 후 이용해주세요");
      navigate("/login");
      return;
    }
    try {
      const response = await reviewsAPI.patch(`/danger/${brno}`);
      if (response.data.code === 1) {
        alert(response.data.msg);
        navigate("/board/review");
      } else {
        alert("신고에 실패했습니다.");
      }
    } catch (error) {
      console.error("신고실패", error);
      alert("신고실패, 다시시도해주세요.");
    }
  };

  // 렌더링 전 조건부 처리 로직을 한 곳으로 통합합니다.
  if (loading) {
    return <div>로딩 중...</div>;
  }
  if (error) {
    return <div>오류가 발생했습니다: {error.message}</div>;
  }
  if (!review) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  // 게시글 상태가 '신고' 상태일 때 
  if (review.brdanger >= 10) {
    return <div>이 게시글은 신고 누적으로 인해 볼 수 없습니다.</div>;
  }

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
          {isAuthor && (
            <>
              <span onClick={handleEdit}>수정</span>
              <span onClick={handleDelete}>삭제</span>
            </>
          )}
          <button className={styles.btn_heart} onClick={handleAwesomeToggle}>
            {heartIcon} {awesomeCount}
          </button>
          <span onClick={handleDanger}>신고</span>
        </div>
      </div>
      <p></p>
      <div className={styles.brcontent}>
        <Viewer initialValue={review.brcontent} />
      </div>
      <hr className={styles.divider} />
      <div className={styles.commentSection}>
        <div className={styles.commentInputBox}>
          <span className={styles.loggedInUser}>{loggedInNickname}</span>
          <textarea
            className={styles.commentInput}
            placeholder="댓글을 남겨주세요."
            rows="3"
          />
          <button className={styles.commentSubmitBtn}>등록</button>
        </div>
        <div className={styles.commentList}></div>
      </div>
    </div>
  );
}
