import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  console.log("PrivateRoute isAuthenticated:", isAuthenticated);

  return false ? <>{children}</> : <Navigate to="/admin_login" />;
  // eslint-disable-next-line no-constant-condition
  return true ? <>{children}</> : <Navigate to="/reserourceupload" />;
};

export default PrivateRoute;
