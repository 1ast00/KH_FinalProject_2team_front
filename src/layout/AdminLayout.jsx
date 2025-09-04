import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./AdminLayout.module.css";
import { clearToken, setUserData, getUserData } from "../util/authUtil";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // 로그인 사용자
  const userData = getUserData?.() || null;
  const userid   = userData?.userid || "USER";
  const nickname = userData?.nickname || "관리자";

  const NAV_ITEMS = [
    { key: "dashboard", label: "대시보드",        to: "/admin",          icon: "📊", end: true },
    { key: "members",   label: "회원관리",        to: "/admin/members",   icon: "👥" },
    { key: "posts",     label: "식단 게시판 관리", to: "/admin/posts",     icon: "🍱" },
    { key: "reviews",   label: "리뷰 게시판 관리", to: "/admin/reviews",   icon: "📝" },
    { key: "reports",   label: "신고 관리",       to: "/admin/reports",   icon: "🚩" },
  ];

  const handleLogout = (e) => {
    e.preventDefault();
    try { clearToken?.(); setUserData?.(null); }
    finally { navigate("/login", { replace: true }); }
  };

  /* ===== 다크모드 ===== */
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("vitalog:dark");
    if (saved === "true") return true;
    if (saved === "false") return false;
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("vitalog:dark", "true");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("vitalog:dark", "false");
    }
  }, [dark]);

  return (
    // 전역 스타일 스코프를 위해 "admin" 클래스 추가
    <div className={`admin ${styles.shell}`}>
      {/* 좌측 사이드바 */}
      <aside className={styles.sidebar} aria-label="관리자 사이드바">
        <div className={styles.brand}>
          <span className={styles.brandLabel}>Vitalog</span>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ""}`}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button className={styles.logout} onClick={handleLogout}>
          <span className={styles.icon}>↩</span>
          <span className={styles.label}>로그아웃</span>
        </button>
      </aside>

      {/* 우측 영역 */}
      <main className={styles.main}>
        <header className={styles.topbar}>
          {/* 제목 → 사용자 아이디 */}
          <h1 className={`${styles.pageTitle} pageTitle`}>{userid}</h1>

          <div className={styles.topRight}>
            {/* 🌙/☀️ 다크모드 토글 */}
            <button
              className={`${styles.topIcon} topIcon`}
              aria-label="다크모드 토글"
              title="다크모드 토글"
              onClick={() => setDark(v => !v)}
            >
              {dark ? "🌙" : "☀️"}
            </button>

            {/* 닉네임 (전역 색 적용 위해 username 클래스도 함께) */}
            <span className={`${styles.username} username`}>{nickname}</span>
          </div>
        </header>

        <section className={styles.content}>
          <Outlet />
        </section>
      </main>
    </div>
  );
}