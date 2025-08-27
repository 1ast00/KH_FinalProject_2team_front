import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../util/authUtil";

export default () => {
  if (isAuthenticated()) {
    return <Outlet />;
  } else {
    alert("로그인 후 이용 가능합니다.");
    return <Navigate to="/login" replace />;
  }
};