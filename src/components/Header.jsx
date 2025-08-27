import { Link, useNavigate } from "react-router-dom";
import header from "../css/Header.module.css";
import { clearUserData, getUserData, isAuthenticated } from "../util/authUtil";
import { apiLogout } from "../service/authApi";

export default () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiLogout();
      clearUserData();

      window.location.reload(); // 로그아웃 시 페이지 새로고침

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className={header.Header}>
      <ul className={header.hul}>
        <li className={header.hli}>
          <Link to="/">
            <img className={header.Logo} src="/img/Logo.png" alt="로고" />
          </Link>
        </li>
        <div className={header.tp_menu}>
          <li className={header.hli}>
            <Link to="/healthdailylog">
              <p>건강일지</p>
            </Link>
          </li>
          <li className={header.hli}>
            <Link to="/exercise">
              <p>추천운동</p>
            </Link>
          </li>
          <li className={header.hli}>
            <Link to="/food/search">
              <p>식품</p>
            </Link>
          </li>
          <li className={header.hli}>
            <Link to={"/board"}>
              <p>게시판</p>
            </Link>
          </li>
          <li className={header.hli}>
            <Link>
              <p>AI질문</p>
            </Link>
          </li>
        </div>
        <div className={header.tp_btn_menu}>
          {isAuthenticated() && getUserData() ? (
            getUserData().role === "ROLE_ADMIN" ? (
              <>
                <li className={header.hli}>
                  <Link>관리자 페이지</Link>
                </li>
                <li className={header.hli}>
                  <button onClick={handleLogout} className={header.hbtn}>
                    로그아웃
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className={header.hli}>
                  <Link to="/mypage">
                    <button className={header.hbtn}>마이페이지</button>
                  </Link>
                </li>
                <li className={header.hli}>
                  <button onClick={handleLogout} className={header.hbtn}>
                    로그아웃
                  </button>
                </li>
              </>
            )
          ) : (
            <>
              <li className={header.hli}>
                <Link to="/login">
                  <button className={header.hbtn}>로그인</button>
                </Link>
              </li>
              <li className={header.hli}>
                <Link to="/register">
                  <button className={header.hbtn}>회원가입</button>
                </Link>
              </li>
            </>
          )}
        </div>
      </ul>
    </nav>
  );
};
