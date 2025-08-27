import { useNavigate } from "react-router-dom";

export default () => {
  const navigate = useNavigate();
  return (
    <div>
      <div>
        <p>식단공유 글쓰기 페이지입니다.</p>
        <button>연결없음</button>
        <button onClick={() => navigate(-1)}>뒤로가기</button>
      </div>
    </div>
  );
};