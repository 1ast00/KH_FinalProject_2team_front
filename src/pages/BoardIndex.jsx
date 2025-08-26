import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import BoardReviewAllview from "../components/board/review/BoardReviewAllview";
import BoardReviewDetail from "../components/board/review/BoardReviewDetail";
import BoardReviewWrite  from "../components/board/review/BoardReviewWrite ";
import BoardReviewItem from "../components/board/review/BoardReviewItem";
import BoardMealsAllview from "../components/board/meals/BoardMealsAllview";
import BoardMealsDetail from "../components/board/meals/BoardMealsDetail";
import BoardMealsWrite from "../components/board/meals/BoardMealsWrite";
import BoardMealsItem from "../components/board/meals/BoardMealsItem";
import BoardWeekly from "../components/board/BoardWeekly";


function BoardIndex() {
  const navigate = useNavigate();
  const location = useLocation();  //현재url정보를 가져옵니다.

let writepath = "/board/review/write";  //기본값reviewwrite
if (location.pathname.includes("/board/meals")){
  writepath = "/board/meals/write";  //mealswrite
}

  return (
    <div>
      <div className="container">
        <div className="boardtop">
          여기에 게시판 이미지 출력
          <hr />
        </div>
        <div>여기에 BoardWeekly 출력  - 이 말은 boardIndex에 있습니다.
          <BoardWeekly />
        </div>
        <div className="btn_getin">
          {/* 참여하기버튼 누르면 회원님이 해야할것 출력 */}
          <button>+ 참여하기</button>
        </div>
        <hr />
        <div>
          <Link to="/board/review">
            <button className="btn_tapreview">리뷰쓰기</button>
          </Link>
          <Link to="/board/meals">
            <button className="btn_tapreview">식단정보</button>
          </Link>
        </div>
        <div>
          <Link to={writepath}>
            <button className="btn_addword">+ 글작성</button>
          </Link>
          <button className="btn_moveback" onClick={() => navigate(-1)}>
            뒤로가기
          </button>
        </div>
        {/* print - BoardReviewAllview, BoardReviewDetail, BoardReviewWrite  */}
        <div id="board-content">
          <Routes>
            <Route index element={<BoardReviewAllview />} />
            <Route path="review" element={<BoardReviewAllview />} />
            <Route path="review/:brno" element={<BoardReviewDetail />} />
            <Route path="review/write" element={<BoardReviewWrite />} />
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