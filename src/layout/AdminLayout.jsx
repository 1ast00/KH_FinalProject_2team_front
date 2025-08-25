// src/layout/AdminLayout.jsx
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styles from "./AdminLayout.module.css";
import { clearToken, setUserData } from "../util/authUtil"; // 프로젝트 util 경로 맞춰주세요

export default function AdminLayout() {
  const navigate = useNavigate();
  const username = "admin"; // 고정 표기

  const handleLogout = (e) => {
    e.preventDefault();
    try {
      clearToken?.();
      setUserData?.(null);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar} aria-label="관리자 사이드바">
        <div className={styles.brand}>
          <span className={styles.brandLabel}>Vitalog</span>
        </div>

        <nav className={styles.nav}>
          <NavLink
            to="dashboard"
            className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ""}`}
          >
            <span className={styles.icon}>👥</span>
            <span className={styles.label}>회원 관리</span>
          </NavLink>

          <NavLink
            to="dashboard"
            className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ""}`}
          >
            <span className={styles.icon}>📝</span>
            <span className={styles.label}>리뷰 게시판 관리</span>
          </NavLink>

          <NavLink
            to="posts"
            className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ""}`}
          >
            <span className={styles.icon}>🍱</span>
            <span className={styles.label}>식단 게시판 관리</span>
          </NavLink>

          <NavLink
            to="dashboard"
            className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ""}`}
          >
            <span className={styles.icon}>🚩</span>
            <span className={styles.label}>신고 관리</span>
          </NavLink>
        </nav>

        
        <button className={styles.logout} onClick={handleLogout}>
          <span className={styles.icon}>↩</span>
          <span className={styles.label}>로그아웃</span>
        </button>
      </aside>

      {/* 상단바 , 컨텐츠 , 나중에 로고 처리할게여 */}
      <main className={styles.main}>
        <header className={styles.topbar}>
          <h1 className={styles.pageTitle}>관리자 대시보드</h1>
          <div className={styles.topRight}>
            <button className={styles.topIcon} aria-label="알림">🔔</button>
            <button className={styles.topIcon} aria-label="프로필">👤</button>
            {/* 임시 */}
            <span className={styles.username}>{username}</span>
          </div>
        </header>

        <section className={styles.content}>
          <Outlet />
        </section>
      </main>
    </div>
  );
}
