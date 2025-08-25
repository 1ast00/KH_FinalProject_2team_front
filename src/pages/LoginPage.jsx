import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData as fetchUserData, login } from "../service/authApi";

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
    <div>
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="아이디"
          value={userid}
          onChange={(e) => setUserid(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">로그인</button>
      </form>

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      <div style={{ marginTop: 12 }}>
        <button onClick={() => navigate("/register")}>회원가입</button>
        <button onClick={() => navigate("/find-id")}>아이디 찾기</button>
        <button onClick={() => navigate("/find-pw")}>비밀번호 찾기</button>
      </div>
    </div>
  );
};
