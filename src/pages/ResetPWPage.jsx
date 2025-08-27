import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Login from "../css/Login.module.css";
import { resetPW } from "../service/authApi";

export default () => {
  const location = useLocation();
  const userid = location.state?.userid;

  const [passwd, setPasswd] = useState("");
  const [passwdCHK, setPasswdCHK] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userid) {
      alert("잘못된 접근입니다.");
      navigate("/");
      return;
    }
  }, [userid, navigate]);

  const handleResetPW = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (passwd !== passwdCHK) {
      setErrorMsg("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // accessToken 저장
      const data = await resetPW(userid, passwd);
      alert("암호를 성공적으로 변경하였습니다.");
      navigate("/login");
    } catch (error) {
      console.error("재설정 실패:", error);
    }
  };

  return (
    <div className={Login.container}>
      <h2 className={Login.title}>암호 재설정</h2>
      <form onSubmit={handleResetPW}>
        <input
          className={Login.input}
          type="password"
          placeholder="암호를 입력해주세요."
          value={passwd}
          onChange={(e) => setPasswd(e.target.value)}
        />
        <br />
        <input
          className={Login.input}
          type="password"
          placeholder="암호를 재입력해주세요."
          value={passwdCHK}
          onChange={(e) => setPasswdCHK(e.target.value)}
        />
        <br />
        <button className={Login.btn} type="submit">
          암호 재설정
        </button>
      </form>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      <hr className={Login.linkshr} />
      <div className={Login.links2}>
        <h4 className={Login.lh4}>암호를 재설정하고 로그인하세요!</h4>
        <button onClick={() => navigate("/login")} className={Login.rbtn}>
          로그인
        </button>
      </div>
    </div>
  );
};