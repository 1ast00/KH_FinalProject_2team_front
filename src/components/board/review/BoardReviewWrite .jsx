import { useNavigate } from "react-router-dom";

export default () => {
  const navigate = useNavigate();
  return (
    <div>
      <div>
        <h2>잘잘잘 돌아갈것입니다.</h2>
        <p>리뷰하기 글쓰기 페이지입니다</p>
        <button>연결없음</button>
        <button onClick={() => navigate(-1)}>뒤로가기</button>
      </div>
    </div>
  );
};
