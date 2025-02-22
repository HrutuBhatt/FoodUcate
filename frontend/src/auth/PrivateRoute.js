import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAuthToken } from "./auth";

const PrivateRoute = () => {
  return getAuthToken() ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
