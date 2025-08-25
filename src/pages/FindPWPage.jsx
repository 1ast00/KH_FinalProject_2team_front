import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../css/Login.module.css";
import { findPW } from "../service/authApi";

export default () => {
  const [userid, setUserid] = useState("");
  const [mname, setMname] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleFindPW = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      // accessToken 저장
      const data = await findPW(userid, mname);
      alert("사용자 정보가 확인되었습니다.");
      navigate("/reset-password", { state: { userid: userid } });
    } catch (error) {
      console.error("암호 찾기 실패:", error);
      setErrorMsg("아이디 또는 이름을 확인해 주세요.");
    }
  };

  return (
    <div className={Login.container}>
      <h2 className={Login.title}>암호 찾기</h2>
      <form onSubmit={handleFindPW}>
        <input
          className={Login.input}
          type="text"
          placeholder="아이디를 입력해주세요."
          value={userid}
          onChange={(e) => setUserid(e.target.value)}
        />
        <br />
        <input
          className={Login.input}
          type="text"
          placeholder="회원님의 이름을 입력해주세요."
          value={mname}
          onChange={(e) => setMname(e.target.value)}
        />
        <br />
        <button className={Login.btn} type="submit">
          암호 찾기
        </button>
      </form>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      <hr className={Login.linkshr} />
      <div className={Login.links2}>
        <h4 className={Login.lh4}>아이디를 찾고계신가요?</h4>
        <button onClick={() => navigate("/find-id")} className={Login.fbtn}>
          아이디 찾기
        </button>
      </div>
    </div>
  );
};
