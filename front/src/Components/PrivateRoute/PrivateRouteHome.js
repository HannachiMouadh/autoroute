import React from 'react'
import {Route,Navigate   } from 'react-router-dom';


const PrivateRouteHome = ({component:Component,...rest}) => {
    const isAuth = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin") === "true";


    <Route
            {...rest}
            element={isAuth && isAdmin ? <Component /> : <Navigate to="/connection" />}
        />
}

export default PrivateRouteHome;