import { useNavigate } from "react-router-dom";

export default () => {
  const navigate = useNavigate();
  return (
    <div>
      <div>
        <p>여기는 BoardReviewDetail입니다.</p>
        <button onClick={() => navigate(-1)}>뒤로가기</button>
      </div>
    </div>
  );
};
