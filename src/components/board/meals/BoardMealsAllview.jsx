import { useNavigate } from "react-router-dom";
import BoardMealsItem from "./BoardMealsItem";

export default () => {

  const navigate = useNavigate();
  return (
    <div>
      <div>
        <p>식단공유 전체글보기 페이지입니다. MealsAllview </p>
        <button onClick={() => navigate(-1)}>뒤로가기</button>
      </div>
    </div>
  );
};