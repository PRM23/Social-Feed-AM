import React from "react";

import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token:");
  return token ? (
    <div>
      <Outlet />
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
