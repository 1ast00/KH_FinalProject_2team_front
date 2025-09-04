import { useNavigate } from "react-router-dom";
import BoardMealsItem from "./BoardMealsItem";
import styles from "../../../../src/css/board/BoardMealsAllview.module.css";

export default () => {

  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div>
        <p>식단공유 게시판 전체 출력 예정 </p>
        <button onClick={() => navigate(-1)}>뒤로가기</button>
      </div>
    </div>
  );
};
