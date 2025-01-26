import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRouteHome = () => {
  const isAuth = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  return isAuth && isAdmin ? <Outlet /> : <Navigate to="/connection" />;
};

export default PrivateRouteHome;
