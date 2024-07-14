import { Alert, Tab, Tabs } from 'react-bootstrap';
import  Home from './Forms/Home.js';
import HomeSens from './ParSens/HomeSens.js';
import  HomeSemain from './ParSemaine/HomeSemaine.js';
import HomeHoraire from './ParHoraire/HomeHoraire.js';
import HomeCause from './ParCause/HomeCause.js';
import HomeLieu from './ParLieu/HomeLieu.js';
import './tabchange.css';
import { Link, useNavigate } from 'react-router-dom';
import { currentUser, logout } from "../JS/userSlice/userSlice.js";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Signup from './Signup/Signup.js';
import UsersMan from './usersMan/UsersMan.js';



const Tabchange = () => {
  const dispatch = useDispatch();
  const isAuth = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const userRedux = useSelector((state) => state.user.user);
  const [online, setOnline] = useState(true);
  console.log(userRedux);
  useEffect(() => {
    if (isAuth) {
      dispatch(currentUser());
    }
  }, [dispatch, isAuth]);
  const navigate = useNavigate();
  const handlelogout =()=>{
    dispatch(logout());
    navigate('/');
    window.location.reload()
 }


 useEffect(() => {
  const handleOnlineStatus = () => {
    setOnline(navigator.onLine);
  };

  window.addEventListener('online', handleOnlineStatus);
  window.addEventListener('offline', handleOnlineStatus);

  return () => {
    window.removeEventListener('online', handleOnlineStatus);
    window.removeEventListener('offline', handleOnlineStatus);
  };
}, []);

useEffect(() => {
  // Check internet connection status on component mount
  setOnline(navigator.onLine);
}, []);


 useEffect(() => {
  if (!isAuth && !isAdmin) {
    navigate('/connection');
  }
}, [isAuth,isAdmin, navigate]);
  return (
    <>
    {!online && (
        <Alert variant="danger">
          Connection lost! Please check your internet connection.
        </Alert>
      )}
       {userRedux?.isAdmin ? (
        <>
        <div className="left">
        <h5>Bienvenue, administrateur {userRedux?.name}</h5>
            <Link onClick={handlelogout}>Deconnexion</Link>
            </div>
        <Tabs
        defaultActiveKey="home"
        id="uncontrolled-tab-example" className="custom-tabs"  >
        <Tab eventKey="home" title="Recap">
        <Home/>
      </Tab>
      <Tab  eventKey="profile" title="Par Semain" >
      <HomeSemain/>
      </Tab>
      <Tab  eventKey="kkk" title="Par Sens" >
      <HomeSens/>
      </Tab>
      <Tab  eventKey="bbbb" title="Par Horaire" >
      <HomeHoraire/>
      </Tab>
      <Tab  eventKey="cccc" title="Par Cause" >
      <HomeCause/>
      </Tab>
      <Tab  eventKey="hjhj" title="Par Lieu" >
      <HomeLieu/>
      </Tab>
      <Tab  eventKey="hjsdfdhj" title="Inscription" >
      <Signup/>
      </Tab>
      <Tab  eventKey="userss" title="Utilisateurs" >
      <UsersMan/>
      </Tab>
      </Tabs></>
        ) : isAuth ? (
          <>
          <div className="left">
        <h5>Bienvenue {userRedux?.name}</h5>
        <Link onClick={handlelogout}>Deconnexion</Link></div>
        <Tabs
        defaultActiveKey="home"
        id="uncontrolled-tab-example" className="custom-tabs" >
        <Tab eventKey="home" title="Recap" >
          <Home/>
        </Tab>
        </Tabs></>
      ) : (
        <></>
      )}
    </>
  )
}

export default Tabchange;