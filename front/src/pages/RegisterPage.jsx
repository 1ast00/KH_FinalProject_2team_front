import { useRef, useState } from "react";
import register from "../css/Register.module.css";
import { signup } from "../service/authApi";
import { useNavigate } from "react-router-dom";

export default () => {
  const userid = useRef(null);
  const password = useRef(null);
  const passwordCheck = useRef(null);
  const mname = useRef(null);
  const nickname = useRef(null);
  const height = useRef(null);
  const weight = useRef(null);
  const gender = useRef(null);
  const goalWeight = useRef(null);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  //회원가입
  const handleRegister = async () => {
    // 입력값 유효성 검사
    if (
      !userid.current.value ||
      !password.current.value ||
      !passwordCheck.current.value ||
      !mname.current.value ||
      !nickname.current.value ||
      !height.current.value ||
      !weight.current.value ||
      !goalWeight.current.value
    ) {
      alert("모든 정보를 입력해주세요.");
      return null;
    }
    // 약관 동의 여부 검사
    if (!isChecked) {
      alert("회원가입 약관에 동의해주세요.");
      return;
    }

    //타입 검사
    if (
      isNaN(height.current.value) ||
      isNaN(weight.current.value) ||
      isNaN(goalWeight.current.value)
    ) {
      alert("키, 체중, 목표 체중은 숫자로 입력해주세요.");
      return null;
    }

    // 비밀번호 일치 여부 검사
    if (password.current.value !== passwordCheck.current.value) {
      alert("비밀번호가 일치하지 않습니다.");
      return null;
    }
    //성별 검사
    if (gender.current.value === "") {
      alert("성별을 선택해주세요.");
      return null;
    }
    try {
      const response = await signup(
        userid.current.value,
        password.current.value,
        mname.current.value,
        nickname.current.value,
        height.current.value,
        weight.current.value,
        gender.current.value,
        goalWeight.current.value
      );
      navigate("/login");
    } catch (error) {
      console.log("you? : ", error);
    }
  };
  return (
    <div className={register.Register}>
      <div>
        <h3>아이디</h3>
        <input
          type="text"
          placeholder="아이디 또는 이메일을 입력해주세요."
          ref={userid}
          maxLength="85"
        />
        <br />
        <input
          type="password"
          placeholder="암호를 입력해주세요."
          ref={password}
          maxLength="85"
        />
        <br />
        <input
          type="password"
          placeholder="암호를 다시 입력해주세요."
          ref={passwordCheck}
          maxLength="85"
        />
        <br />
      </div>
      <div>
        <h3>회원 정보</h3>
        <input
          type="text"
          placeholder="이름을 입력해주세요."
          ref={mname}
          maxLength="30"
        />
        <br />
        <input
          type="text"
          placeholder="회원님의 별명을 입력해주세요."
          ref={nickname}
          maxLength="30"
        />
        <br />
        <input
          type="text"
          placeholder="회원님의 키를 입력해주세요. ex)160"
          ref={height}
          maxLength="3"
        />
        <br />
        <input
          type="text"
          placeholder="회원님의 체중을 입력해주세요. ex)73"
          ref={weight}
          maxLength="3"
        />
        <br />
        <select id="gender" required ref={gender}>
          <option id="gen_test" value="" disabled selected>
            성별을 선택해주세요.
          </option>
          <option value="남">남</option>
          <option value="여">여</option>
        </select>
        <br />
        <input
          type="text"
          placeholder="사이트를 통하여 달성하고 싶은 체중을 입력해주세요!! 💪"
          ref={goalWeight}
          maxLength="3"
        />
        <br />
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
            className={register.chk}
          />
          회원가입 약관에 동의합니다.
        </label>
        <button className={register.chk_btn}>▼</button>
        <p className={register.chk_text}>어쩌고 저쩌고 정보에 동의하십니까?</p>
        <br />
        <button onClick={handleRegister} className={register.rbtn}>
          회원가입
        </button>
      </div>
    </div>
  );
};