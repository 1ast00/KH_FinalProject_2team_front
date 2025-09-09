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
  const [isAuthor, setIsAuthor] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [editingComment, setEditingComment] = useState(null);

  const userData = getUserData();
  const loggedInNickname = userData ? userData.nickname : "";
  const loggedInMno = userData ? userData.mno : null;

  const fetchReviewDetail = async () => {
    try {
      const response = await reviewsAPI.get(`/detail/${brno}`);
      const reviewData = response.data.review;
      setReview(reviewData);
      setAwesomeCount(response.data.awesomeCount);
      if (reviewData && reviewData.mno === loggedInMno) {
        setIsAuthor(true);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await reviewsAPI.get(`/comment/${brno}`);
      setComments(response.data);
    } catch (error) {
      console.error("댓글 목록을 불러오는데 실패했습니다.", error);
    }
  };

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
      const response = await reviewsAPI.post(`/awesome`, { brno: brno });
      setAwesomeCount(response.data.awesomeCount);
      alert(response.data.msg);
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
      alert("오류가 발생하였습니다. 다시 시도해 주세요.");
    }
  };

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
        navigate("/board/review"); // 경로 수정
      } else {
        alert("신고에 실패했습니다.");
      }
    } catch (error) {
      console.error("신고 실패", error);
      alert("신고 실패, 다시 시도해주세요.");
    }
  };

  const handleCommentSubmit = async () => {
    if (!loggedInMno) {
    }
    if (!commentText.trim()) {
    }
    try {
      await reviewsAPI.post("/comment", {
        brno: brno,
        brccontent: commentText,
      });
      alert("댓글이 등록되었습니다.");
      setCommentText("");
      fetchComments();
    } catch (error) {
      console.error("댓글 등록에 실패했습니다.", error);
      alert("댓글 등록에 실패했습니다.");
    }
  };

  const handleCommentUpdateStart = (comment) => {
    setEditingComment(comment);
    setCommentText(comment.brccontent);
  };

  const handleCommentUpdate = async () => {
    if (!commentText.trim()) {
    }
    const updatedComment = {
      brcno: editingComment.brcno,
      brccontent: commentText,
    };
    try {
      await reviewsAPI.patch("/comment", updatedComment);
      alert("댓글이 수정되었습니다.");
      setEditingComment(null);
      setCommentText("");
      fetchComments();
    } catch (error) {
      console.error("댓글 수정에 실패했습니다.", error);
      alert("댓글 수정에 실패했습니다.");
    }
  };

  const handleCommentDelete = async (brcno) => {
    if (window.confirm("정말로 댓글을 삭제하시겠습니까?")) {
      try {
        await reviewsAPI.delete(`/comment/${brcno}`);
        alert("댓글이 삭제되었습니다.");
        fetchComments();
      } catch (error) {
        /* ... */
      }
    }
  };

  const toggleCommentAwesome = async (brcno) => {
    if (!loggedInMno) {
      /* ... */
    }
    try {
      const response = await reviewsAPI.post(`/comment/awesome/${brcno}`);
      alert(response.data.msg);
      fetchComments();
    } catch (error) {
      /* ... */
    }
  };

  const handleCommentReport = async (brcno) => {
    if (!loggedInMno) {
    }
    if (window.confirm("정말로 이 댓글을 신고하시겠습니까?")) {
      try {
        const response = await reviewsAPI.patch(`/comment/danger/${brcno}`);
        if (response.data.code === 1) {
          alert(response.data.msg);
        } else {
          alert("신고 접수에 실패했습니다.");
        }
      } catch (error) {
      }
    }
  };

  useEffect(() => {
    fetchReviewDetail();
    fetchComments();
  }, [brno]);

  //렌더링
  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류가 발생했습니다: {error.message}</div>;
  if (!review) return <div>게시글을 찾을 수 없습니다.</div>;
  if (review.brdanger >= 10)
    return <div>이 게시글은 신고 누적으로 인해 볼 수 없습니다.</div>;

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
            {awesomeCount > 0 ? "♥" : "♡"} {awesomeCount}
          </button>
          <span onClick={handleDanger}>신고</span>
        </div>
      </div>
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
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          {editingComment ? (
            <button
              className={styles.commentSubmitBtn}
              onClick={handleCommentUpdate}
            >
              수정 완료
            </button>
          ) : (
            <button
              className={styles.commentSubmitBtn}
              onClick={handleCommentSubmit}
            >
              등록
            </button>
          )}
        </div>
        <div className={styles.commentList}>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.brcno} className={styles.commentItem}>
                <div className={styles.commentInfoLine}>
                  
                  <div className={styles.commentHeader}>
                    <span className={styles.commentAuthor}>
                      {comment.nickname}
                    </span>
                    <span className={styles.commentDate}>
                      {new Date(comment.brcwrite_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className={styles.commentActions}>
                    <button onClick={() => toggleCommentAwesome(comment.brcno)}>
                      <span className={styles.heartIcon}>
                        {comment.awesomeCount > 0 ? "♥" : "♡"}
                      </span>
                      {comment.awesomeCount}
                    </button>
                    {loggedInMno && loggedInMno === comment.mno && (
                      <>
                        <button
                          onClick={() => handleCommentUpdateStart(comment)}
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleCommentDelete(comment.brcno)}
                        >
                          삭제
                        </button>
                      </>
                    )}
                    {loggedInMno && loggedInMno !== comment.mno && (
                      <button
                        onClick={() => handleCommentReport(comment.brcno)}
                      >
                        신고
                      </button>
                    )}
                  </div>
                </div>
                <div className={styles.commentContent}>
                  {comment.brccontent}
                </div>
              </div>
            ))
          ) : (
            <p>현재 댓글이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
