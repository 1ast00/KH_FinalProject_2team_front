// src/App.jsx
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/MainPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import RegisterSuccess from "./pages/RegisterSuccess";

//  추가
import AdminLayout from "./layout/AdminLayout";
import { isAuthenticated, getUserData } from "./util/authUtil";
import PrivateRoute from "./components/PrivateRoute";
import MyPage from "./pages/MyPage";
import FindIDPage from "./pages/FindIDPage";
import FindPWPage from "./pages/FindPWPage";
import ResetPWPage from "./pages/ResetPWPage";

//  관리자 권한 가드
function AdminRoute() {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  const role = (getUserData()?.role || "").toString().toUpperCase();
  return role.includes("ADMIN") ? <Outlet /> : <Navigate to="/" replace />;
}

//  관리자 경로에서는 Header/Footer 숨김
function ChromeFrame({ children }) {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  return (
    <>
      {!isAdmin && <Header />}
      <div>{children}</div>
      {!isAdmin && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ChromeFrame>
        <Routes>
          {/* 공개된 라우트 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/RegisterSuccess" element={<RegisterSuccess />} />
          <Route path="/find-id" element={<FindIDPage />} />
          <Route path="/find-pw" element={<FindPWPage />} />
          <Route path="/reset-password" element={<ResetPWPage />} />
          {/* 비공개 라우트 */}
          <Route element={<PrivateRoute />}>
            <Route path="/mypage" element={<MyPage />} />
          </Route>

          {/* 관리자 라우트 */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/*" element={<AdminLayout />} />
          </Route>

          {/* 404방지 */}
          <Route path="*" element={<h2>404</h2>} />
        </Routes>
      </ChromeFrame>
    </BrowserRouter>
  );
}

export default App;
