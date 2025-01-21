import './App.css';
import Add from "./Components/Forms/Add";
import { BrowserRouter as Router,Switch, Route, Routes } from 'react-router-dom';
import Delete from './Components/Forms/Delete';
import React from 'react'; 
import  Home from './Components/Forms/Home.js';
import Update from './Components/Forms/Update.js';
import  Tabchange from './Components/Tabchange.js';
import Signin from './Components/Signin/Signin.js';
import Signup from './Components/Signup/Signup.js';
import PrivateRouteHome from './Components/PrivateRoute/PrivateRouteHome.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeSens from './Components/ParSens/HomeSens.js';

function App() {
  return (
     <div className="App">
      <Tabchange/>
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/connection" element={<Signin />} />
          <Route path="/HomeSens" element={<HomeSens />} />
          <Route path="/" element={<PrivateRouteHome />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}

export default App;
