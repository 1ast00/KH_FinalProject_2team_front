import { useEffect, useState } from "react";
import my from "../css/MyPage.module.css";
import { isAuthenticated } from "../util/authUtil";
import { getUserData, updateUserData } from "../service/authApi";
import { useNavigate } from "react-router-dom";

export default () => {
  const navigate = useNavigate();
  const [userid, setUserid] = useState("");
  const [mname, setMname] = useState("");
  const [nickname, setNickname] = useState("");
  const [goalweight, setGoalWeight] = useState("");
  const [weight, setWeight] = useState("");

  if (!isAuthenticated()) {
    alert("로그인 후 사용할 수 있습니다.");
    return;
  }

  const fetchData = async () => {
    try {
      const res = await getUserData();
      setMname(res.mname);
      setNickname(res.nickname);
      setGoalWeight(res.goalweight);
      setWeight(res.weight);
      setUserid(res.userid);
      console.log(res.goalweight);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = async () => {
    try {
      const data = await updateUserData(mname, nickname, goalweight, userid);
      alert("사용자 정보가 수정되었습니다.");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={my.container}>
      <img className={my.banner_img} src="/img/banner.png" alt="banner.png" />{" "}
      <br />
      <img className={my.user_img} src="/img/user_icon.png" alt="user_icon" />
      <div>
        <h2>개인정보 수정</h2>
        <span className={my.sp}>이름</span>
        <input
          className={my.minput}
          onChange={(e) => setMname(e.target.value)}
          value={mname}
          type="text"
        />
        <br />
        <span className={my.sp}>별명</span>
        <input
          onChange={(e) => setNickname(e.target.value)}
          value={nickname}
          className={my.minput}
          type="text"
        />
        <br />
        <span className={my.sp}>목표 체중</span>
        <input
          onChange={(e) => setGoalWeight(e.target.value)}
          value={goalweight}
          className={my.minput}
          type="text"
        />
        <button onClick={handleEdit} className={my.mbtn}>
          정보 수정하기
        </button>
      </div>
      <div>
        <h2>현재 몸무게</h2>
        <p className={my.goal}>{weight}kg</p>
      </div>
    </div>
  );
};
