// src/routes/ProtectedRoute.jsx
import RoleRoute from "./RoleRoute";

export default function ProtectedRoute(props) {
  return <RoleRoute {...props} requiredRoles={[]} />;
}
