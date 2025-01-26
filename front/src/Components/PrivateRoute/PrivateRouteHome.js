import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRouteHome = () => {
  const isAuth = localStorage.getItem("token");

  return isAuth ? <Outlet/> : <Navigate to="/connection" />;
};

export default PrivateRouteHome;
