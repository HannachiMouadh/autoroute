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
import { Baja } from "./Components/AccidentDistricts/Baja";
import { Bizerte } from "./Components/AccidentDistricts/Bizerte";
import { Hergla } from "./Components/AccidentDistricts/Hergla";
import { Jem } from "./Components/AccidentDistricts/Jem";
import { Mahres } from "./Components/AccidentDistricts/Mahres";
import { Mdjazbab } from "./Components/AccidentDistricts/Mdjazbab";
import { Oudhref } from "./Components/AccidentDistricts/Oudhref";
import { Turki } from "./Components/AccidentDistricts/Turki";
import { PatOudhref } from "./Components/PatrouilleDistricts/PatOudhref";
import { PatBaja } from "./Components/PatrouilleDistricts/PatBaja";
import { PatBizerte } from "./Components/PatrouilleDistricts/PatBizerte";
import { PatHergla } from "./Components/PatrouilleDistricts/PatHergla";
import { PatJem } from "./Components/PatrouilleDistricts/PatJem";
import { PatMahres } from "./Components/PatrouilleDistricts/PatMahres";
import { PatMdjazbab } from "./Components/PatrouilleDistricts/PatMdjazbab";
import { PatTurki } from "./Components/PatrouilleDistricts/PatTurki";
import { EntBaja } from "./Components/EntretientDistricts/EntBaja";
import { EntTurki } from "./Components/EntretientDistricts/EntTurki";
import { EntMdjazbab } from "./Components/EntretientDistricts/EntMdjazbab";
import { EntMahres } from "./Components/EntretientDistricts/EntMahres";
import { EntJem } from "./Components/EntretientDistricts/EntJem";
import { EntHergla } from "./Components/EntretientDistricts/EntHergla";
import { EntBizerte } from "./Components/EntretientDistricts/EntBizerte";
import { EntOudhref } from "./Components/EntretientDistricts/EntOudhref";
import 'bootstrap/dist/css/bootstrap.min.css';


function App({ userDistrict,curuser,userRole,userAutonum,patUserAutonum,patUserDistrict}) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(currentUser());
  }, [dispatch]);
  
  const currentUserConnected = useSelector((state) => state.user.user);
const isSuper = currentUserConnected?.isSuper;
  console.log('app autonum',currentUserConnected.autonum);
    console.log('app district',currentUserConnected.district);
  

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
          <Route
        index
        element={
          isSuper ? (
            <Navigate to="/utilisateurs" />
          ) : currentUserConnected.role === "entretient" ? (
            <Navigate to="/entretient" />
          ) : currentUserConnected.role === "securite" ? (
            <Navigate to="/recap" /> // fallback
          ) : (
            <p>Loading...</p>
          )
        }
      />
          <Route path="/recap" element={<Home userDistrict={currentUserConnected.district} curuser={currentUserConnected} userRole={currentUserConnected.role} userAutonum={currentUserConnected.autonum} />} />
        <Route path="/par-cause" element={<HomeCause currentUserDistrict={currentUserConnected.district} currentUserAuto={currentUserConnected.autonum}/>} />
        <Route path="/entretient" element={<DisplayEntretient />} />
        <Route path="/patrouille" element={<Patrouille />} patUserAutonum={currentUserConnected.autonum} patUserDistrict={currentUserConnected.district}/>
        <Route path="/inscription" element={<Signup />} />
        <Route path="/utilisateurs" element={<UsersMan userManLieu={currentUserConnected.district}/>} />
        <Route path="/baja" element={<Baja />} />
        <Route path="/bizerte" element={<Bizerte/>} />
        <Route path="/hergla" element={<Hergla />} />
        <Route path="/jem" element={<Jem/>} />
        <Route path="/mahres" element={<Mahres />} />
        <Route path="/mdjazbab" element={<Mdjazbab/>} />
        <Route path="/oudhref" element={<Oudhref />} />
        <Route path="/patoudhref" element={<PatOudhref />} />
        <Route path="/turki" element={<Turki/>} />
        <Route path="/patbaja" element={<PatBaja />} />
        <Route path="/patbizerte" element={<PatBizerte/>} />
        <Route path="/pathergla" element={<PatHergla />} />
        <Route path="/patjem" element={<PatJem/>} />
        <Route path="/patmahres" element={<PatMahres />} />
        <Route path="/patmdjazbab" element={<PatMdjazbab/>} />
        <Route path="/patturki" element={<PatTurki/>} />
        <Route path="/entbaja" element={<EntBaja />} />
        <Route path="/entoudhref" element={<EntOudhref/>} />
        <Route path="/entbizerte" element={<EntBizerte/>} />
        <Route path="/enthergla" element={<EntHergla />} />
        <Route path="/entjem" element={<EntJem/>} />
        <Route path="/entmahres" element={<EntMahres />} />
        <Route path="/entmdjazbab" element={<EntMdjazbab/>} />
        <Route path="/entturki" element={<EntTurki/>} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}

export default App;
