import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { log } from "console";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  console.log("PrivateRoute isAuthenticated:", isAuthenticated);

  return true ? <>{children}</> : <Navigate to="/admin_login" />;
};

export default PrivateRoute;
