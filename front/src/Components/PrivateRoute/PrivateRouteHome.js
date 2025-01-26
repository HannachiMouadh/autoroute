import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRouteHome = () => {
  const isAuth = localStorage.getItem("token"); // Ensure token check logic is correct
  const isAdmin = localStorage.getItem("isAdmin") === "true"; // Parse admin status properly

  // Check if the user is authenticated and an admin
  return isAuth || isAdmin ? <Outlet /> : <Navigate to="/connection" />;
};

export default PrivateRouteHome;
