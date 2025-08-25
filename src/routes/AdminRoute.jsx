// src/routes/AdminRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, getUserData } from "../util/authUtil";
export default function AdminRoute() {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  const user = getUserData();
  if (user && user.role === "ROLE_ADMIN") return <Outlet />;
  return <Navigate to="/home" replace />;
import RoleRoute from "./RoleRoute";

export default function AdminRoute(props) {
  return <RoleRoute {...props} requiredRoles={["ROLE_ADMIN"]} />;
}
