import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainPage from "./pages/MainPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div>
        <Routes>
          {/* 공개된 라우트 */}
          <Route path="/" element={<MainPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* 비공개 라우트 */}
          <Route />
          {/* 404방지 */}
          <Route path="*" element={<h2>404</h2>} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
