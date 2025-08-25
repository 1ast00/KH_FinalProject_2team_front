// src/routes/AdminRoute.jsx
import RoleRoute from "./RoleRoute";

export default function AdminRoute(props) {
  return <RoleRoute {...props} requiredRoles={["ROLE_ADMIN"]} />;
}
