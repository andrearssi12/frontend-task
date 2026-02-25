import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // kalau sudah login → lempar ke dashboard
  return token ? <Navigate to="/dashboard" /> : children;
};

export default PublicRoute;