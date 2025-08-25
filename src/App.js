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
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import RegisterSuccess from "./pages/RegisterSuccess";

//  추가
import { isAuthenticated, getUserData } from "./util/authUtil";
import PrivateRoute from "./components/PrivateRoute";
import MyPage from "./pages/MyPage";
import FindIDPage from "./pages/FindIDPage";
import FindPWPage from "./pages/FindPWPage";
import ResetPWPage from "./pages/ResetPWPage";
import FoodSearch from "./components/FoodSearch";

// 추천 운동
import ExerciseListPage from "./pages/ExerciseListPage";
import ExerciseDetailPage from "./pages/ExerciseDetailPage";

//  관리자 페이지들
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMembersPage from "./pages/admin/AdminMembersPage";
import AdminPostsPage from "./pages/admin/AdminPostsPage";
import AdminReviewsPage from "./pages/admin/AdminReviewsPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";
import AdminLayout from "./layout/AdminLayout"

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
          <Route path="/" element={<MainPage />} />
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


          <Route path="/food/search" element={<FoodSearch/>}/>

          {/*  관리자 라우트: 자식 라우트 추가 */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="members" element={<AdminMembersPage />} />
              <Route path="posts" element={<AdminPostsPage />} />        {/* 식단 게시판 */}
              <Route path="reviews" element={<AdminReviewsPage />} />
              <Route path="reports" element={<AdminReportsPage />} />
            </Route>
          </Route>


          {/* 추천 운동 페이지 라우트 */}
          <Route path="/exercise" element={<ExerciseListPage />} />
          <Route path="/exercise/:exerciseName" element={<ExerciseDetailPage />} />

          {/* 비공개 라우트 */}
          
          <Route />


          {/* 404방지 */}
          <Route path="*" element={<h2>404</h2>} />
        </Routes>
      </ChromeFrame>
    </BrowserRouter>
  );
}

export default App;
