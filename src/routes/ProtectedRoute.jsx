// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../util/authUtil";
export default function ProtectedRoute() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
import RoleRoute from "./RoleRoute";

export default function ProtectedRoute(props) {
  return <RoleRoute {...props} requiredRoles={[]} />;
}
