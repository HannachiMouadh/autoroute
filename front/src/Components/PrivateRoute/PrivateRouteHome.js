import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRouteHome = ({ children }) => {
  const isAuth = localStorage.getItem("token"); // Check if the user is authenticated
  const isAdmin = localStorage.getItem("isAdmin") === "true"; // Check admin status

  // Render children if authenticated and admin, otherwise redirect to Signin
  return isAuth && isAdmin ? children : <Navigate to="/connection" />;
};

export default PrivateRouteHome;
