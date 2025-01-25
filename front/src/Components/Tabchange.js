import { Alert, Tab, Tabs } from 'react-bootstrap';
import  Home from './Forms/Home.js';
import HomeSens from './ParSens/HomeSens.js';
import  HomeSemain from './ParSemaine/HomeSemaine.js';
import HomeHoraire from './ParHoraire/HomeHoraire.js';
import HomeCause from './ParCause/HomeCause.js';
import HomeLieu from './ParLieu/HomeLieu.js';
import './tabchange.css';
import { useNavigate } from 'react-router-dom';
import { currentUser, logout } from "../JS/userSlice/userSlice.js";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Signup from './Signup/Signup.js';
import UsersMan from './usersMan/UsersMan.js';
import { Link, Routes, Route } from "react-router-dom";



const Tabchange = ({ userRegion,curuser,userCause,userHoraire,userSemaine,userSens,userLieu }) => {
  const dispatch = useDispatch();
  const isAuth = localStorage.getItem("token");
  const userRedux = useSelector((state) => state.user.user);
  const [online, setOnline] = useState(true);
  useEffect(() => {
          dispatch(currentUser());
        }, [dispatch]);
        
        const currentUserData = useSelector((state) => state.user.user);
        const isSuper = currentUserData?.isSuper;
        const isAdmin = currentUserData?.isAdmin;
        
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

const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    // Set up media query listener
    const mediaQuery = window.matchMedia("(max-width: 1000px)");

    // Update state based on media query
    const handleResize = () => {
      setIsMobileView(mediaQuery.matches);
    };

    // Initial check
    handleResize();

    // Add event listener
    mediaQuery.addEventListener('change', handleResize);

    // Cleanup listener on component unmount
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);
const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="custom-tabs-container">
    {!online && (
        <Alert variant="danger">
          Connection lost! Please check your internet connection.
        </Alert>
      )}
       {isAdmin || isSuper ? (
        <>
        <div className="admin-info">
        <h5>
            Bienvenue, {isSuper ? "super administrateur" : "administrateur"}{" "}
            {userRedux?.name}
          </h5>
        <h6>District: {userRedux?.region}</h6>
        <Link onClick={handlelogout} className="logout-link">Déconnexion</Link>
      </div>
      {isMobileView && (
        <>
        <div className="admin-container">
        <button
        className="hamburger-btn"
        onClick={toggleMenu}
        aria-label="Toggle Menu"
      >
        &#9776;
      </button>
      <div className={`sidebar-menu ${isMenuOpen ? "open" : "closed"}`}>
            <Link to="/recap" className="sidebar-item" onClick={toggleMenu}>
              Recap
            </Link>
            <Link to="/par-semaine" className="sidebar-item" onClick={toggleMenu}>
              Par Semain
            </Link>
            <Link to="/par-sens" className="sidebar-item" onClick={toggleMenu}>
              Par Sens
            </Link>
            <Link to="/par-horaire" className="sidebar-item" onClick={toggleMenu}>
              Par Horaire
            </Link>
            <Link to="/par-cause" className="sidebar-item" onClick={toggleMenu}>
              Par Cause
            </Link>
            <Link to="/par-lieu" className="sidebar-item" onClick={toggleMenu}>
              Par Lieu
            </Link>
            <Link to="/inscription" className="sidebar-item" onClick={toggleMenu}>
              Inscription
            </Link>
            <Link to="/utilisateurs" className="sidebar-item" onClick={toggleMenu}>
              Utilisateurs
            </Link>
          </div>
          <div className="content">
            <Routes>
              <Route
                path="/recap"
                element={
                  <div className="tab-content-container">
                    <Home userRegion={userRedux.region} curuser={userRedux} />
                  </div>
                }
              />
              <Route
                path="/par-semaine"
                element={
                  <div className="tab-content-container">
                    <HomeSemain userSemaine={userRedux.region} />
                  </div>
                }
              />
              <Route
                path="/par-sens"
                element={
                  <div className="tab-content-container">
                    <HomeSens userSens={userRedux.region} />
                  </div>
                }
              />
              <Route
                path="/par-horaire"
                element={
                  <div className="tab-content-container">
                    <HomeHoraire userHoraire={userRedux.region} />
                  </div>
                }
              />
              <Route
                path="/par-cause"
                element={
                  <div className="tab-content-container">
                    <HomeCause userCause={userRedux.region} />
                  </div>
                }
              />
              <Route
                path="/par-lieu"
                element={
                  <div className="tab-content-container">
                    <HomeLieu userLieu={userRedux.region} />
                  </div>
                }
              />
              <Route
                path="/inscription"
                element={
                  <div className="tab-content-container">
                    <Signup />
                  </div>
                }
              />
              <Route
                path="/utilisateurs"
                element={
                  <div className="tab-content-container">
                    <UsersMan />
                  </div>
                }
              />
            </Routes>
          </div>
        </div>
      </>
       )} 
       {!isMobileView && (
          <>
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
        )}</>
        ) : isAuth  && !isAdmin && !isSuper && (
          <>
          <div className="admin-info">
        <h5>Bienvenue {userRedux?.name}</h5>
        <h6>District: {userRedux?.region}</h6>
        <Link onClick={handlelogout} className="logout-link">Déconnexion</Link>
      </div>
        <Tabs
        defaultActiveKey="home"
        id="uncontrolled-tab-example" className="custom-tabs" >
        <Tab eventKey="home" title="Recap" >
        <div className="tab-content-container">
          <Home userRegion={userRedux.region}/>
          </div>
        </Tab>
        </Tabs></>
      )}
      </div>
  );
  };

export default Tabchange;