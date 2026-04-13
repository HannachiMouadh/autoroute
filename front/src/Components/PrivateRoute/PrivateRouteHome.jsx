import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRouteHome = ({ children }) => {
  const isAuth = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!isAuth) {
    return <Navigate to="/connection" />;
  }

  if (role === "patrouille") {
    localStorage.removeItem("token");
    localStorage.removeItem("isAuth");
    localStorage.removeItem("role");
    return <Navigate to="/connection" state={{ message: "Le role patrouille est reserve a l'application mobile." }} />;
  }

  return children;
};

export default PrivateRouteHome;
