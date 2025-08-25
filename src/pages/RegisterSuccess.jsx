import { useNavigate } from "react-router-dom";
import rs from "../css/RegisterSuccess.module.css";

export default () => {
  const navigate = useNavigate();
  return (
    <div className={rs.container}>
      <span className={rs.chk}>√</span>
      <h3 className={rs.complete}>회원가입이 완료 되었습니다.</h3>
      <p className={rs.text}>
        로그인 하시면 더욱 다양한 서비스와 혜택을 제공 받으실 수 있습니다.
      </p>
      <button onClick={() => navigate("/login")} className={rs.btn}>
        로그인
      </button>
    </div>
  );
};
};
