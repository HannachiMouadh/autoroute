import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRouteHome = () => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Simulate token validation from localStorage or an API
    const token = localStorage.getItem("token");

    if (token) {
      setIsAuth(true);
    }
    setLoading(false); // Mark loading as complete
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Add a spinner or loader component
  }

  return isAuth ? <Outlet /> : <Navigate to="/connection" />;
};

export default PrivateRouteHome;
