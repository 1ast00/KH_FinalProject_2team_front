import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData as fetchUserData, login } from "../service/authApi";
import Login from "../css/Login.module.css";

export default () => {
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      // accessToken 저장
      await login(userid, password);

      // 사용자 정보 조회 (MemberDTO: role 포함)
      const user = await fetchUserData();
      const role = (user?.role || "").toUpperCase().trim();

      // 역할 분기 - 히스토리 교체 이동
      if (role === "ROLE_ADMIN") {
        window.location.replace("/admin/dashboard");
      } else {
        window.location.replace("/");
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      setErrorMsg("아이디 또는 비밀번호를 확인해 주세요.");
    }
  };

  return (
    <div className={Login.container}>
      <h2 className={Login.title}>로그인</h2>
      <form onSubmit={handleLogin}>
        <input
          className={Login.input}
          type="text"
          placeholder="아이디"
          value={userid}
          onChange={(e) => setUserid(e.target.value)}
        />
        <br />
        <input
          className={Login.input}
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button className={Login.btn} type="submit">
          로그인
        </button>
      </form>

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      <hr className={Login.linkshr} />
      <div className={Login.links}>
        <button className={Login.lbtn} onClick={() => navigate("/register")}>
          회원가입
        </button>
        <button className={Login.lbtn} onClick={() => navigate("/find-id")}>
          아이디 찾기
        </button>
        <button className={Login.lbtn} onClick={() => navigate("/find-pw")}>
          비밀번호 찾기
        </button>
      </div>
    </div>
  );
};