import { Alert, Tab, Tabs } from "react-bootstrap";
import Home from "./Forms/Home.js";
import HomeSens from "./ParSens/HomeSens.js";
import HomeSemain from "./ParSemaine/HomeSemaine.js";
import HomeHoraire from "./ParHoraire/HomeHoraire.js";
import HomeCause from "./ParCause/HomeCause.js";
import HomeLieu from "./ParLieu/HomeLieu.js";
import "./tabchange.css";
import { Navigate, useNavigate } from "react-router-dom";
import {} from "react-router-dom";
import { currentUser, logout } from "../JS/userSlice/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Signup from "./Signup/Signup.js";
import UsersMan from "./usersMan/UsersMan.js";
import { Link, Outlet, Routes, Route } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

import { Nav, NavDropdown } from "react-bootstrap";

const Tabchange = ({
  userRegion,
  curuser,
  userCause,
  userHoraire,
  userSemaine,
  userSens,
  userLieu,
}) => {
  const dispatch = useDispatch();
  const isAuth = localStorage.getItem("token");
  const [online, setOnline] = useState(true);

  useEffect(() => {
    dispatch(currentUser());
  }, [dispatch]);

  const currentUserData = useSelector((state) => state.user.user);
  const isSuper = currentUserData?.isSuper;
  const isAdmin = currentUserData?.isAdmin;
  //const isSecurite = currentUserData?.role == "securite";
  //const isPatrou = currentUserData?.role == "patrouille";
  //const isEntret = currentUserData?.role == "entretient";

  const navigate = useNavigate();
  const handlelogout = () => {
    dispatch(logout());
    window.location.reload();
  };

  useEffect(() => {
    const handleOnlineStatus = () => {
      setOnline(navigator.onLine);
    };

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  useEffect(() => {
    setOnline(navigator.onLine);
  }, []);

  const isMobileView = useMediaQuery({ query: "(max-width: 760px)" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openAccidents, setOpenAccidents] = useState(false);
  const [openUtilisateurs, setOpenUtilisateurs] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleAccidents = () => setOpenAccidents(!openAccidents);
  const toggleUtilisateurs = () => setOpenUtilisateurs(!openUtilisateurs);

  return (
    <div className="custom-tabs-container">
      {!online && (
        <Alert variant="danger">
          Connection lost! Please check your internet connection.
        </Alert>
      )}

      {isAdmin || isSuper ? (
        <>
          {isMobileView ? (
            <>
              <div className="admin-info">
                {!currentUserData.name ? (
                  <h5>Chargement...</h5>
                ) : (
                  <h5>
                    Bienvenue,{" "}
                    {isSuper ? "super administrateur" : "administrateur"}{" "}
                    {currentUserData.name}
                  </h5>
                )}
                {!currentUserData.region ? (
                  <h5>Chargement...</h5>
                ) : (
                  <h6>District: {currentUserData.region}</h6>
                )}
                <Link onClick={handlelogout} className="logout-link">
                  Déconnexion
                </Link>
              </div>
              <div className="admin-container">
                <button
                  className="hamburger-btn"
                  onClick={toggleMenu}
                  aria-label="Toggle Menu"
                >
                  &#9776;
                </button>

                <div
                  className={`sidebar-menu ${isMenuOpen ? "open" : "closed"}`}
                >
                  {/* Accidents Section */}
                  <div className="sidebar-item" onClick={toggleAccidents}>
                    Accidents
                  </div>
                  {openAccidents && (
                    <div className="submenu">
                      <Link
                        to="/recap"
                        className="sidebar-subitem"
                        onClick={toggleMenu}
                      >
                        Recap
                      </Link>
                      <Link
                        to="/par-semaine"
                        className="sidebar-subitem"
                        onClick={toggleMenu}
                      >
                        Par Semaine
                      </Link>
                      <Link
                        to="/par-sens"
                        className="sidebar-subitem"
                        onClick={toggleMenu}
                      >
                        Par Sens
                      </Link>
                      <Link
                        to="/par-horaire"
                        className="sidebar-subitem"
                        onClick={toggleMenu}
                      >
                        Par Horaire
                      </Link>
                      <Link
                        to="/par-cause"
                        className="sidebar-subitem"
                        onClick={toggleMenu}
                      >
                        Par Cause
                      </Link>
                      <Link
                        to="/par-lieu"
                        className="sidebar-subitem"
                        onClick={toggleMenu}
                      >
                        Par Lieu
                      </Link>
                    </div>
                  )}

                  {/* Utilisateurs Section */}
                  <div className="sidebar-item" onClick={toggleUtilisateurs}>
                    Utilisateurs
                  </div>
                  {openUtilisateurs && (
                    <div className="submenu">
                      <Link
                        to="/inscription"
                        className="sidebar-subitem"
                        onClick={toggleMenu}
                      >
                        Inscription
                      </Link>
                      <Link
                        to="/utilisateurs"
                        className="sidebar-subitem"
                        onClick={toggleMenu}
                      >
                        Utilisateurs
                      </Link>
                    </div>
                  )}

                  {/* Direct Links */}
                  <Link
                    to="/patrouille"
                    className="sidebar-item"
                    onClick={toggleMenu}
                  >
                    Patrouille
                  </Link>
                  <Link
                    to="/entretient"
                    className="sidebar-item"
                    onClick={toggleMenu}
                  >
                    Entretient
                  </Link>
                </div>
                <div className="content">
                  <Outlet />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="admin-info">
                {!currentUserData.name ? (
                  <h5>Chargement...</h5>
                ) : (
                  <h5>
                    Bienvenue,{" "}
                    {isSuper ? "super administrateur" : "administrateur"}{" "}
                    {currentUserData.name}
                  </h5>
                )}
                {!currentUserData.region ? (
                  <h5>Chargement...</h5>
                ) : (
                  <h6>District: {currentUserData.region}</h6>
                )}
                <Link onClick={handlelogout} className="logout-link">
                  Déconnexion
                </Link>
              </div>
              <Nav variant="tabs" className="custom-tabs">
                <NavDropdown title="Sécurité" id="security-dropdown">
                  <NavDropdown.Item as={Link} to="/recap">
                    Recap
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/par-semaine">
                    Par Semaine
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/par-sens">
                    Par Sens
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/par-horaire">
                    Par Horaire
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/par-cause">
                    Par Cause
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/par-lieu">
                    Par Lieu
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Item>
                  <Nav.Link eventKey="patrouille" as={Link} to="/patrouille">
                    Patrouille
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="entretien" as={Link} to="/entretient">
                    Entretien
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="inscr" as={Link} to="/inscription">
                    Inscription
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="uti" as={Link} to="/utilisateurs">
                    Utilisateurs
                  </Nav.Link>
                </Nav.Item>
                <div className="content">
                  <Outlet />
                </div>
              </Nav>
            </>
          )}
        </>
      ) : (
        <>
          <div className="admin-info">
            {!currentUserData.name ? (
              <h5>Chargement...</h5>
            ) : (
              <h5>Bienvenue {currentUserData.name}</h5>
            )}
            {!currentUserData.region ? (
              <h5>Chargement...</h5>
            ) : (
              <h6>District: {currentUserData.region}</h6>
            )}
            <Link onClick={handlelogout} className="logout-link">
              Déconnexion
            </Link>
          </div>
          <Nav variant="tabs" className="custom-tabs">
          <Nav.Item>
              <Nav.Link style={{backgroundColor: "#0b70cf",color: "black" }} eventKey="recap" as={Link} to="/recap">Recap</Nav.Link>
            </Nav.Item>
            <div className="content">
                  <Outlet />
                </div>
          </Nav>
        </>
      )}
    </div>
  );
};

export default Tabchange;
