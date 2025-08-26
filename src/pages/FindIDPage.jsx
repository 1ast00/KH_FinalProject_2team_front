import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../css/Login.module.css";
import { findID } from "../service/authApi";

export default () => {
  const [mname, setMname] = useState("");
  const [nickName, setNickName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [userid, setUserid] = useState("");
  const navigate = useNavigate();

  const handleFindLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      // accessToken 저장
      const data = await findID(mname, nickName);
      setUserid(data.userid);
    } catch (error) {
      console.error("로그인 실패:", error);
      setErrorMsg("이름 또는 별명을 확인해 주세요.");
      setUserid("");
    }
  };

  return (
    <div className={Login.container}>
      <h2 className={Login.title}>아이디 찾기</h2>
      <form onSubmit={handleFindLogin}>
        <input
          className={Login.input}
          type="text"
          placeholder="회원님의 이름을 입력해주세요."
          value={mname}
          onChange={(e) => setMname(e.target.value)}
        />
        <br />
        <input
          className={Login.input}
          type="text"
          placeholder="회원님의 별명을 입력해주세요."
          value={nickName}
          onChange={(e) => setNickName(e.target.value)}
        />
        <br />
        <button className={Login.btn} type="submit">
          아이디 찾기
        </button>
      </form>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      {userid && (
        <p style={{ color: "blue", fontWeight: "bold" }}>
          회원님의 아이디는 "{userid}" 입니다.
        </p>
      )}
      <hr className={Login.linkshr} />
      <div className={Login.links2}>
        <h4 className={Login.lh4}>비밀번호를 찾고계신가요?</h4>
        <button onClick={() => navigate("/find-pw")} className={Login.fbtn}>
          비밀번호 찾기
        </button>
      </div>
    </div>
  );
};
