import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// 1. API 서비스명 변경: reviewsAPI -> mealsAPI
import { mealsAPI } from "../../../service/boardApi";
import { Viewer } from "@toast-ui/react-editor";
import { getUserData } from "../../../util/authUtil";
// 2. CSS 모듈명 변경
import styles from "../../../css/board/BoardMealsDetail.module.css";

// 3. 컴포넌트명 변경
export default function BoardMealsDetail() {
  const navigate = useNavigate();
  // 4. 파라미터명 변경: brno -> bmno
  const { bmno } = useParams();

  // 5. 상태 변수명 변경: review -> meal
  const [meal, setMeal] = useState(null);
  const [awesomeCount, setAwesomeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);

  // 댓글 관련 상태
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [editingComment, setEditingComment] = useState(null);

  // 로그인 사용자 정보
  const userData = getUserData();
  const loggedInNickname = userData ? userData.nickname : "";
  const loggedInMno = userData ? userData.mno : null;

  // 6. 함수명 및 내부 로직 변경
  const fetchMealDetail = async () => {
    try {
      const response = await mealsAPI.get(`/detail/${bmno}`);
      const mealData = response.data.meal; // review -> meal
      setMeal(mealData);
      setAwesomeCount(response.data.awesomeCount);
      if (mealData && mealData.mno === loggedInMno) {
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
      const response = await mealsAPI.get(`/comment/${bmno}`);
      setComments(response.data);
    } catch (error) {
      console.error("댓글 목록을 불러오는데 실패했습니다.", error);
    }
  };

  const handleEdit = () => {
    navigate(`/board/meals/write/${bmno}`, { state: { meal } }); // 경로 및 state 변경
  };

  const handleDelete = async () => {
    if (window.confirm("정말 게시글을 삭제하시겠습니까?")) {
      try {
        const response = await mealsAPI.delete(`/${bmno}`);
        alert(response.data.msg);
        if (response.data.code === 1) {
          navigate("/board/meals"); // 경로 변경
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
      // payload 키 변경: brno -> bmno
      const response = await mealsAPI.post(`/awesome`, { bmno: bmno });
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
      const response = await mealsAPI.patch(`/danger/${bmno}`);
      if (response.data.code === 1) {
        alert(response.data.msg);
        navigate("/board/meals");
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
      await mealsAPI.post("/comment", {
        bmno: bmno,
        bmccontent: commentText,
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
    setCommentText(comment.bmccontent); 
  };

  const handleCommentUpdate = async () => {
    if (!commentText.trim()) {
    }
    const updatedComment = {
      bmcno: editingComment.bmcno,
      bmccontent: commentText, 
    };
    try {
      await mealsAPI.patch("/comment", updatedComment);
      alert("댓글이 수정되었습니다.");
      setEditingComment(null);
      setCommentText("");
      fetchComments();
    } catch (error) {
      console.error("댓글 수정에 실패했습니다.", error);
      alert("댓글 수정에 실패했습니다.");
    }
  };

  const handleCommentDelete = async (bmcno) => {
    if (window.confirm("정말로 댓글을 삭제하시겠습니까?")) {
      try {
        await mealsAPI.delete(`/comment/${bmcno}`);
        alert("댓글이 삭제되었습니다.");
        fetchComments();
      } catch (error) {
        /* ... */
      }
    }
  };

  const toggleCommentAwesome = async (bmcno) => {
    if (!loggedInMno) {
    }
    try {
      const response = await mealsAPI.post(`/comment/awesome/${bmcno}`);
      alert(response.data.msg);
      fetchComments();
    } catch (error) {
    }
  };

  const handleCommentReport = async (bmcno) => {
    if (!loggedInMno) {
    }
    if (window.confirm("정말로 이 댓글을 신고하시겠습니까?")) {
      try {
        const response = await mealsAPI.patch(`/comment/danger/${bmcno}`);
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
    fetchMealDetail(); // fetchReviewDetail -> fetchMealDetail
    fetchComments();
  }, [bmno]); // brno -> bmno

  //렌더링
  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류가 발생했습니다: {error.message}</div>;
  if (!meal) return <div>게시글을 찾을 수 없습니다.</div>;
  if (meal.bmdanger >= 10)
    return <div>이 게시글은 신고 누적으로 인해 볼 수 없습니다.</div>;

  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.bmtitle}>{meal.bmtitle}</h2>
        <hr className={styles.divider} />
      </div>
      <div className={styles.bminfo}>
        <div className={styles.bmwriter}>
          <span className={styles.nickname}>{meal.nickname}</span>
          <span className={styles.date}>
            작성일: {new Date(meal.bmwrite_date).toLocaleDateString()}
          </span>
          {meal.bmwrite_update && (
            <span className={styles.updatedDate}>
              수정일: {new Date(meal.bmwrite_update).toLocaleDateString()}
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
      <div className={styles.bmcontent}>
        <Viewer initialValue={meal.bmcontent} />
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
              <div key={comment.bmcno} className={styles.commentItem}>
                <div className={styles.commentInfoLine}>
                  <div className={styles.commentHeader}>
                    <span className={styles.commentAuthor}>
                      {comment.nickname}
                    </span>
                    <span className={styles.commentDate}>
                      {new Date(comment.bmcwrite_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className={styles.commentActions}>
                    {/* ◀ 1. bmcno로 수정 */}
                    <button onClick={() => toggleCommentAwesome(comment.bmcno)}>
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
                        {/* ◀ 2. bmcno로 수정 */}
                        <button
                          onClick={() => handleCommentDelete(comment.bmcno)}
                        >
                          삭제
                        </button>
                      </>
                    )}

                    {loggedInMno && loggedInMno !== comment.mno && (
                      /* ◀ 3. bmcno로 수정 */
                      <button
                        onClick={() => handleCommentReport(comment.bmcno)}
                      >
                        신고
                      </button>
                    )}
                  </div>
                </div>
                <div className={styles.commentContent}>
                  {comment.bmccontent}
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
