import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { log } from "console";

const PrivateRoute: React.FC<{ children: React.ReactNode; redirectTo?: string }> = ({
  children,
  redirectTo = "/login",
}) => {
  const { checkLogin } = useAuth();
  const isAuthenticated = checkLogin()
  console.log("PrivateRoute isAuthenticated:", isAuthenticated);

  return false ? <>{children}</> : <Navigate to="/admin_login" />;
  return isAuthenticated ? <>{children}</> : <Navigate to={redirectTo} />;
};

export default PrivateRoute;
