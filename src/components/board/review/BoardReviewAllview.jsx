import { useNavigate } from "react-router-dom";
import BoardReviewItem from "./BoardReviewItem";



export default () => {
  const navigate = useNavigate();
  return (
    <div>
      <div>
        <p>리뷰하기 전체출력페이지입니다.</p>
        <button onClick={() => navigate(-1)}>뒤로가기</button>
      </div>
    </div>
  );
};