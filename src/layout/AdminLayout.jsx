// src/layout/AdminLayout.jsx
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import styles from "./AdminLayout.module.css";
import { clearToken, setUserData } from "../util/authUtil";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const username = "admin"; // 고정 표기

  const pageTitle =
    pathname.startsWith("/admin/posts")   ? "식단 게시판 관리" :
    pathname.startsWith("/admin/reviews") ? "리뷰 게시판 관리" :
    pathname.startsWith("/admin/reports") ? "신고 관리" :
    pathname.startsWith("/admin/members") ? "회원 관리" :
    "관리자 대시보드";

  
  const NAV_ITEMS = [
    { key: "dashboard", label: "대시보드", to: "/admin",          icon: "📊", end: true },
    { key: "members",   label: "회원관리", to: "/admin/members",   icon: "👥" },
    { key: "posts",     label: "식단 게시판 관리", to: "/admin/posts",   icon: "🍱" },
    { key: "reviews",   label: "리뷰 게시판 관리", to: "/admin/reviews", icon: "📝" },
    { key: "reports",   label: "신고 관리", to: "/admin/reports",  icon: "🚩" },
  ];

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
      {/* 좌측 사이드바: /admin 전체에서 공용 */}
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
              className={({ isActive }) =>
                `${styles.item} ${isActive ? styles.active : ""}`
              }
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

      {/* 우측 영역: 상단바 + 컨텐츠 */}
      <main className={styles.main}>
        <header className={styles.topbar}>
          <h1 className={styles.pageTitle}>{pageTitle}</h1>
          <div className={styles.topRight}>
            <button className={styles.topIcon} aria-label="알림">🔔</button>
            <button className={styles.topIcon} aria-label="프로필">👤</button>
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