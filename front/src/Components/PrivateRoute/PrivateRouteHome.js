import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRouteHome = () => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Simulate token validation from localStorage or an API
    const token = localStorage.getItem("token");
    const adminStatus = localStorage.getItem("isAdmin") === "true";

    if (token) {
      setIsAuth(true);
      setIsAdmin(adminStatus);
    }
    setLoading(false); // Mark loading as complete
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Add a spinner or loader component
  }

  return isAuth && isAdmin ? <Outlet /> : <Navigate to="/connection" />;
};

export default PrivateRouteHome;

