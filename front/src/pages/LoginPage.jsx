import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData, login } from "../service/authApi";

export default () => {
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const hanldeLogin = async () => {
    try {
      const response = await login(userid, password);
      const userData = await getUserData();
      navigate("/");
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };
  return (
    <div>
      <h2>로그인</h2>
      <div>
        <input
          type="text"
          placeholder="아이디"
          onChange={(e) => setUserid(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="비밀번호"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button onClick={hanldeLogin}>로그인</button>
      </div>
      <div>
        <span></span>
        <div>
          <button>회원가입</button>
          <button>아이디 찾기</button>
          <button>비밀번호 찾기</button>
        </div>
      </div>
    </div>
  );
};