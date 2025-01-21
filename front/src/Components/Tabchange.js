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



const Tabchange = ({ userRegion,curuser,userCause,userHoraire,userSemaine,userSens,userLieu }) => {
  const dispatch = useDispatch();
  const isAuth = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const userRedux = useSelector((state) => state.user.user);
  const [online, setOnline] = useState(true);
  console.log(userRedux?.isAdmin);
  useEffect(() => {
    if (isAuth) {
      dispatch(currentUser());
    }
  }, [dispatch, isAuth]);
  const navigate = useNavigate();
  const handlelogout =()=>{
    dispatch(logout());
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

  setOnline(navigator.onLine);
}, []);


 useEffect(() => {
  if (!isAuth && !isAdmin) {
    navigate('/connection');
  }
}, [isAuth,isAdmin, navigate]);

  return (
    <div className="custom-tabs-container">
    {!online && (
        <Alert variant="danger">
          Connection lost! Please check your internet connection.
        </Alert>
      )}
       {userRedux?.isAdmin ? (
        <>
        <div className="left">
        <h5>Bienvenue, administrateur {userRedux?.name}</h5>
        <h6>District: {userRedux?.region}</h6>
            <Link onClick={handlelogout}>Deconnexion</Link>
            </div>
            <div className="tabs-wrapper">
        <Tabs
        defaultActiveKey="home"
        id="uncontrolled-tab-example" className="custom-tabs"  >
        <Tab eventKey="home" title="Recap">
        <div className="tab-content-container">
        <Home userRegion={userRedux.region} curuser={userRedux}/>
        </div>
      </Tab>
      <Tab  eventKey="profile" title="Par Semain" >
      <div className="tab-content-container">
      <HomeSemain userSemaine={userRedux.region}/>
      </div>
      </Tab>
      <Tab  eventKey="kkk" title="Par Sens" >
      <div className="tab-content-container">
      <HomeSens userSens={userRedux.region}/>
      </div>
      </Tab>
      <Tab  eventKey="bbbb" title="Par Horaire" >
      <div className="tab-content-container">
      <HomeHoraire userHoraire={userRedux.region}/>
      </div>
      </Tab>
      <Tab  eventKey="cccc" title="Par Cause" >
      <div className="tab-content-container">
      <HomeCause userCause={userRedux.region}/>
      </div>
      </Tab>
      <Tab  eventKey="hjhj" title="Par Lieu" >
      <div className="tab-content-container">
      <HomeLieu userLieu={userRedux.region}/>
      </div>
      </Tab>
      <Tab  eventKey="hjsdfdhj" title="Inscription" >
      <div className="tab-content-container">
      <Signup/>
      </div>
      </Tab>
      <Tab  eventKey="userss" title="Utilisateurs" >
        <div className="tab-content-container">
      <UsersMan/>
      </div>
      </Tab>
      </Tabs></div></>
        ) : isAuth ? (
          <>
          <div className="left">
        <h5>Bienvenue {userRedux?.name}</h5>
        <h6>District: {userRedux?.region}</h6>
        <Link onClick={handlelogout}>Deconnexion</Link></div>
        <Tabs
        defaultActiveKey="home"
        id="uncontrolled-tab-example" className="custom-tabs" >
        <Tab eventKey="home" title="Recap" >
        <div className="tab-content-container">
          <Home userRegion={userRedux.region}/>
          </div>
        </Tab>
        </Tabs></>
      ) : (
        <></>
      )}
      </div>
  );
  };

export default Tabchange;