import { useNavigate } from "react-router-dom";
import BoardReviewItem from "./BoardReviewItem";
import styles from "../../../css/board/BoardReviewAllview.module.css";



export default () => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div>
        <p>리뷰하기 게시판 전체 출력 예정</p>
        <button onClick={() => navigate(-1)}>뒤로가기</button>
      </div>
    </div>
  );
};