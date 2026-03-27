import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }: { children: JSX.Element; role: "student" | "teacher" | null }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user?.role;

  if (!token) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
