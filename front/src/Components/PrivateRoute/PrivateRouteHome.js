import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRouteHome = ({ children }) => {
  const isAuth = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  return isAuth ? children : <Navigate to="/connection" />;
};

export default PrivateRouteHome;
