import { Alert, Tab, Tabs } from "react-bootstrap";
import Home from "./Forms/Home.js";
import HomeCause from "./ParCause/HomeCause.js";
import "./tabchange.css";
import { Navigate, useNavigate } from "react-router-dom";
import {} from "react-router-dom";
import { currentUser, logout } from "../JS/userSlice/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Signup from "./Signup/Signup.js";
import UsersMan from "./usersMan/UsersMan.js";
import { jwtDecode } from "jwt-decode";
import { Link, Outlet, Routes, Route } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

import { Nav, NavDropdown } from "react-bootstrap";
import logo from '../assets/logo.png';

const Tabchange = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const [online, setOnline] = useState(true);

  useEffect(() => {
    dispatch(currentUser());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000; // in seconds

        if (decoded.exp < now) {
          // Token expired
          if (window.confirm("Votre session a expiré. Veuillez vous reconnecter.")) {
            localStorage.removeItem("token");
            navigate("/connection"); // 🔄 Redirect to login
          }
        }
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
        navigate("/connection");
      }
    }
  }, []);

  const currentUserData = useSelector((state) => state.user.user);
  const isSuper = currentUserData?.isSuper;
  const isAdmin = currentUserData?.isAdmin;
  //const isSecurite = currentUserData?.role == "securite";
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
            <div class="header">
  <img src={logo} alt="Logo" className="logo" style={{height:'120px', marginLeft:'100px',marginTop:'50px', }}/>
  <h1 class="title" style={{fontSize:"23px"}}>مصلحة السلامة و الصيانة للطرقات السيارة</h1>
</div>
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
                {!currentUserData.district ? (
                  <h5>Chargement...</h5>
                ) : (
                  <h6>District: {currentUserData.district}</h6>
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
                        to="/par-cause"
                        className="sidebar-subitem"
                        onClick={toggleMenu}
                      >
                        Statistiques
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
                <div class="header">
<img src={logo} alt="Logo" className="logo"/>
  <h1 class="title">مصلحة السلامة و الصيانة للطرقات السيارة</h1>
</div>
                {!currentUserData.name ? (
                  <h5>Chargement...</h5>
                ) : (
                  <h5>
                    Bienvenue,{" "}
                    {isSuper ? "super administrateur" : "administrateur"}{" "}
                    {currentUserData.name}
                  </h5>
                )}
                {!currentUserData.district ? (
                  <h5>Chargement...</h5>
                ) : (
                  <h6>District: {currentUserData.district}</h6>
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
                  <NavDropdown.Item as={Link} to="/par-cause">
                    Statistiques
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
        <div class="header">
<img src={logo} alt="Logo" className="logo" />
  <h1 class="title">مصلحة السلامة و الصيانة للطرقات السيارة</h1>
</div>

          <div className="admin-info">
            {!currentUserData.name ? (
              <h5>Chargement...</h5>
            ) : (
              <h5>Bienvenue {currentUserData.name}</h5>
            )}
            {!currentUserData.district ? (
              <h5>Chargement...</h5>
            ) : (
              <h6>District: {currentUserData.district}</h6>
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
