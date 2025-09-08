import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import BoardReviewAllview from "../components/board/review/BoardReviewAllview";
import BoardReviewDetail from "../components/board/review/BoardReviewDetail";
import BoardReviewWrite from "../components/board/review/BoardReviewWrite ";
import BoardReviewItem from "../components/board/review/BoardReviewItem";
import BoardMealsAllview from "../components/board/meals/BoardMealsAllview";
import BoardMealsDetail from "../components/board/meals/BoardMealsDetail";
import BoardMealsWrite from "../components/board/meals/BoardMealsWrite";
import BoardMealsItem from "../components/board/meals/BoardMealsItem";
import BoardWeekly from "../components/board/BoardWeekly";
import styles from "../css/board/BoardIndex.module.css";


function BoardIndex() {
  const navigate = useNavigate();
  const location = useLocation(); //현재url정보를 가져옵니다.

  let writepath = "/board/review/write"; //기본값reviewwrite
  if (location.pathname.includes("/board/meals")) {
    writepath = "/board/meals/write"; //mealswrite
  }

  //현재 경로따라 버튼 활성화
  const isReviewActive =
    location.pathname.includes("/board/review") ||
    location.pathname === "/board";
  const isMealsActive = location.pathname.includes("/board/meals");

  const reviewBtnClass = isReviewActive
  ? styles.btn_tapreview_active 
  : styles.btn_tapreview;

  const mealsBtnClass = isMealsActive
  ? styles.btn_tapreview_active
  : styles.btn_tapreview;


  return (
    <div>
      <div className={styles.container}>
        <div className={styles.boardtop}></div>
        <div>
          {/*boardweekly가 잘보여서 바꿈.*/}
          <BoardWeekly />
        </div>
        <div className="btn_getin">
          {/* 참여하기버튼 누르면 회원님이 해야할것 출력  - 여기 참여하기 버튼 없애고 Boardweekly로 이동 <button>+ 참여하기</button> add25.08.29*/}
        </div>
        <div className={styles.boardbox}>
          <div className={styles.menuGroup}>
            <div className={styles.menuLeft}>
              <Link to="/board/review">
                <button className={reviewBtnClass}>리뷰쓰기</button>
              </Link>
              <Link to="/board/meals">
                <button className={mealsBtnClass}>식단정보</button>
              </Link>
            </div>

            <div className={styles.menuRight}>
              <Link to={writepath}>
                {/* 아래 + 글작성버튼 클릭후 content출력후 화면안보여야 함  boardreviewWrite로 이동. */}
                <button className={styles.btn_addword}> + </button>
              </Link>
              <button
                className={styles.btn_moveback}
                onClick={() => navigate(-1)}
              >
                {`<`}
              </button>
            </div>
          </div>
        </div>
        {/* print - BoardReviewAllview, BoardReviewDetail, BoardReviewWrite  */}
        <div id="board-content">
          <Routes>
            <Route index element={<BoardReviewAllview />} />
            <Route path="review" element={<BoardReviewAllview />} />
            <Route path="review/:brno" element={<BoardReviewDetail />} />
            <Route path="review/write/:brno?" element={<BoardReviewWrite />} />
            <Route path="meals" element={<BoardMealsAllview />} />
            <Route path="meals/:bmno" element={<BoardMealsDetail />} />
            <Route path="meals/write" element={<BoardMealsWrite />} />
          </Routes>
        </div>
      </div>
    </div> //class containebefore
  );
}
export default BoardIndex;