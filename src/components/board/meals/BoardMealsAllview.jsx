import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// 1. 컴포넌트명 변경: BoardReviewItem -> BoardMealsItem
import BoardMealsItem from "./BoardMealsItem";
// 2. CSS 모듈명 변경: BoardReviewAllview.module.css -> BoardMealsAllview.module.css
import styles from "../../../css/board/BoardMealsAllview.module.css";
// 3. API 서비스 함수 변경: getPostBoardList -> getMealsList (가정)
import { getMealsList } from "../../../service/boardApi";
import { isAuthenticated } from "../../../util/authUtil";

export default () => {
  const navigate = useNavigate();
  // 4. 상태 변수명 변경: reviews -> meals, setReviews -> setMeals
  const [meals, setMeals] = useState([]);

  // 5. 핸들러 파라미터명 변경: brno -> bmno
  const handleRowClick = (bmno) => {
    if (!isAuthenticated()) {
      alert("로그인 후 이용 해주세요.");
      navigate("/login");
    } else {
      // 6. 라우팅 경로 변경: review -> meals
      navigate(`/board/meals/${bmno}`);
    }
  };

  useEffect(() => {
    // 7. 함수명 변경: fetchReviews -> fetchMeals
    const fetchMeals = async () => {
      try {
        console.log("시작");
        const response = await getMealsList(); // API 함수 호출 변경
        console.log(response);
        // 8. 응답 데이터 키 변경: reviewList -> mealsList (백엔드와 일치 필요)
        setMeals(response.mealsList);
      } catch (error) {
        console.error("상세 조회 실패:", error);
      }
    };
    fetchMeals();
  }, []);

  return (
    <div className={styles.container}>
      <table className={styles.boardTable}>
        <thead>
          <tr>
            {/* 9. CSS 클래스명 변경 (예시): col_brno -> col_bmno */}
            <th className={styles.col_bmno}>글번호</th>
            <th className={styles.col_bmtitle}>제목</th>
            <th className={styles.col_nickname}>작성자</th>
            <th className={styles.col_date}>작성일</th>
            <th className={styles.col_viewcount}>조회수</th>
            <th className={styles.col_likes}>좋아요</th>
          </tr>
        </thead>
        <tbody>
          {/* 10. map()에 사용된 변수명 변경: reviews -> meals, review -> meal */}
          {meals.map((meal, index) => (
            <tr
              key={meal.bmno} // key 변경: review.brno -> meal.bmno
              onClick={() => handleRowClick(meal.bmno)} // 파라미터 변경
              className={styles.row}
            >
              {/* 11. 자식 컴포넌트 및 props 변경 */}
              <BoardMealsItem
                key={meal.bmno}
                meal={meal} // review -> meal
                displayNo={meals.length - index} // reviews -> meals
              />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
