import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Tabchange from "./Components/Tabchange";
import Signin from "./Components/Signin/Signin";
import PrivateRouteHome from "./Components/PrivateRoute/PrivateRouteHome";
import Home from "./Components/Forms/Home";
import HomeCause from "./Components/ParCause/HomeCause";
import Signup from "./Components/Signup/Signup";
import UsersMan from "./Components/usersMan/UsersMan";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { currentUser } from "./JS/userSlice/userSlice";
import DisplayEntretient from "./Components/Entretient/DisplayEntretient";
import Patrouille from "./Components/Patrouille/Patrouille";

function App({ userDistrict,curuser,userRole,userAutonum,patUserAutonum,patUserDistrict}) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(currentUser());
  }, [dispatch]);
  
  const userRedux = useSelector((state) => state.user.user);

  console.log('app autonum',userRedux.autonum);
    console.log('app district',userRedux.district);
  

  return (
    <div className="App">
      <Routes>
        <Route path="/connection" element={<Signin />} />
        <Route
          path="/"
          element={
            <PrivateRouteHome>
              <Tabchange />
            </PrivateRouteHome>
          }
        >
          <Route path="/" element={<Navigate to="/recap" />} />
          <Route path="/recap" element={<Home userDistrict={userRedux.district} curuser={userRedux} userRole={userRedux.role} userAutonum={userRedux.autonum} />} />
        <Route path="/par-cause" element={<HomeCause currentUserDistrict={userRedux.district} currentUserAuto={userRedux.autonum}/>} />
        <Route path="/entretient" element={<DisplayEntretient />} />
        <Route path="/patrouille" element={<Patrouille />} patUserAutonum={userRedux.autonum} patUserDistrict={userRedux.district}/>
        <Route path="/inscription" element={<Signup />} />
        <Route path="/utilisateurs" element={<UsersMan userManLieu={userRedux.district}/>} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}

export default App;
