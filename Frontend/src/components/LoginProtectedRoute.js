import React from "react";

import { Navigate, Outlet } from "react-router-dom";

const LoginProtectedRoute = () => {
  const token = localStorage.getItem("token:");
  return token ? <Navigate to="/Feed" /> : <Outlet />;
};

export default LoginProtectedRoute;
