import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Tabchange from "./Components/Tabchange";
import Signin from "./Components/Signin/Signin";
import PrivateRouteHome from "./Components/PrivateRoute/PrivateRouteHome";
import Home from "./Components/Forms/Home";
import HomeSemaine from "./Components/ParSemaine/HomeSemaine";
import HomeSens from "./Components/ParSens/HomeSens";
import HomeHoraire from "./Components/ParHoraire/HomeHoraire";
import HomeCause from "./Components/ParCause/HomeCause";
import HomeLieu from "./Components/ParLieu/HomeLieu";
import Signup from "./Components/Signup/Signup";
import UsersMan from "./Components/usersMan/UsersMan";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { currentUser } from "./JS/userSlice/userSlice";

function App({ userRegion,curuser,userCause,userHoraire,userSemaine,userSens,userLieu }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(currentUser());
  }, [dispatch]);
  
  const userRedux = useSelector((state) => state.user.user);

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
          <Route path="/recap" element={<Home userRegion={userRedux.region} curuser={userRedux} />} />
        <Route path="/par-semaine" element={<HomeSemaine userSemaine={userRedux.region} />} />
        <Route path="/par-sens" element={<HomeSens userSens={userRedux.region} />} />
        <Route path="/par-horaire" element={<HomeHoraire userHoraire={userRedux.region} />} />
        <Route path="/par-cause" element={<HomeCause userCause={userRedux.region} />} />
        <Route path="/par-lieu" element={<HomeLieu userLieu={userRedux.region} />} />
        <Route path="/inscription" element={<Signup />} />
        <Route path="/utilisateurs" element={<UsersMan />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}

export default App;
