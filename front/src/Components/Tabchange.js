import { Alert, Button, Tab, Tabs } from "react-bootstrap";
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
import Scrollbar from "smooth-scrollbar";
import { Nav, NavDropdown } from "react-bootstrap";
import logo from "../assets/logo.png";
import avatar from "../assets/avatar.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { UpdateProfile } from "./UpdateUser/UpdateProfile.js";
import { FiEdit } from "react-icons/fi";

const Tabchange = ({ rowData, user }) => {
  const [isSidebarToggled, setIsSidebarToggled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const isAuth = localStorage.getItem("isAuth");
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
          if (
            window.confirm("Votre session a expiré. Veuillez vous reconnecter.")
          ) {
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
  const { users, status } = useSelector((state) => state.user);
  console.log(users);

  const isSuper = currentUserData?.isSuper;
  const isAdmin = currentUserData?.isAdmin;
  const isSecurite = currentUserData.role == "securite";
  const isEntretient = currentUserData.role == "entretient";
  console.log("UUUSER", currentUserData);

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

  // SidebarToggle.js (or inside any component)
  const handleSidebarToggle = () => {
    // Toggle class on body
    document.body.classList.toggle("sidebar-toggled");
    // Toggle class on sidebar
    const sidebar = document.getElementById("accordionSidebar");
    if (sidebar) {
      sidebar.classList.toggle("toggled");
    }
  };

  console.log("User image:", currentUserData.image);

  return (
    <div id="page-top">
      {!online && (
        <Alert variant="danger">
          Connection lost! Please check your internet connection.
        </Alert>
      )}
      <body>
        <div id="wrapper">
          <ul
            class="navbar-nav bg-gradient-success sidebar sidebar-dark accordion"
            id="accordionSidebar"
          >
            {/* <!-- Sidebar - Brand --> */}
            <Link
              class="sidebar-brand d-flex align-items-center justify-content-center"
              to="/"
            >
              <div class="sidebar-brand-icon">
                <img
                  src={logo}
                  alt="Logo"
                  className="logo"
                  style={{ width: "60px" }}
                />
              </div>
              <div class="sidebar-brand-text mx-3">
                <p>District: {currentUserData.district}</p>
                <p>Rôle: {currentUserData.role}</p>
              </div>
            </Link>
            {isSuper ? (
              <>
                <hr class="sidebar-divider my-0" />

                {/* <!-- Nav Item - Charts --> */}
                <li class="nav-item">
                  <Link class="nav-link" to="/par-cause">
                    <i class="fas fa-fw fa-chart-area"></i>
                    <span>Statistiques</span>
                  </Link>
                </li>

                {/* <!-- Divider --> */}
                <hr class="sidebar-divider" />

                {/* <!-- Heading --> */}
                <div class="sidebar-heading">Toutes les districts</div>

                {/* <!-- Nav Item - Pages Collapse Menu --> */}
                <li class="nav-item">
                  <a
                    class="nav-link collapsed"
                    href="#"
                    data-toggle="collapse"
                    data-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    <i class="fas fa-fw fa-car-crash"></i>
                    <span>Accidents</span>
                  </a>
                  <div
                    id="collapseOne"
                    class="collapse"
                    aria-labelledby="headingTwo"
                    data-parent="#accordionSidebar"
                  >
                    <div class="bg-white py-2 collapse-inner rounded">
                      <h6 class="collapse-header">Touts les accidents:</h6>
                      <Link class="collapse-item" to="/baja">
                        Baja
                      </Link>
                      <Link class="collapse-item" to="/bizerte">
                        Bizerte
                      </Link>
                      <Link class="collapse-item" to="/hergla">
                        Hergla
                      </Link>
                      <Link class="collapse-item" to="/jem">
                        Jem
                      </Link>
                      <Link class="collapse-item" to="/mahres">
                        Mahres
                      </Link>
                      <Link class="collapse-item" to="/mdjazbab">
                        Mdjazbab
                      </Link>
                      <Link class="collapse-item" to="/oudhref">
                        Oudhref
                      </Link>
                      <Link class="collapse-item" to="/turki">
                        Turki
                      </Link>
                    </div>
                  </div>
                </li>

                {/* <!-- Nav Item - Pages Collapse Menu --> */}
                <li class="nav-item">
                  <a
                    class="nav-link collapsed"
                    href="#"
                    data-toggle="collapse"
                    data-target="#collapseTwo"
                    aria-expanded="true"
                    aria-controls="collapseTwo"
                  >
                    <i class="fas fa-fw fa-tools"></i>
                    <span>Entretients</span>
                  </a>
                  <div
                    id="collapseTwo"
                    class="collapse"
                    aria-labelledby="headingTwo"
                    data-parent="#accordionSidebar"
                  >
                    <div class="bg-white py-2 collapse-inner rounded">
                      <h6 class="collapse-header">Touts les entretients:</h6>
                      <Link class="collapse-item" to="/entbaja">
                        Baja
                      </Link>
                      <Link class="collapse-item" to="/entbizerte">
                        Bizerte
                      </Link>
                      <Link class="collapse-item" to="/enthergla">
                        Hergla
                      </Link>
                      <Link class="collapse-item" to="/entjem">
                        Jem
                      </Link>
                      <Link class="collapse-item" to="/entmahres">
                        Mahres
                      </Link>
                      <Link class="collapse-item" to="/entmdjazbab">
                        Mdjazbab
                      </Link>
                      <Link class="collapse-item" to="/entpatoudhref">
                        Oudhref
                      </Link>
                      <Link class="collapse-item" to="/entpatturki">
                        Turki
                      </Link>
                    </div>
                  </div>
                </li>
                {/* <!-- Nav Item - Pages Collapse Menu --> */}
                <li class="nav-item">
                  <a
                    class="nav-link collapsed"
                    href="#"
                    data-toggle="collapse"
                    data-target="#collapseThree"
                    aria-expanded="true"
                    aria-controls="collapseThree"
                  >
                    <i class="fas fa-fw fa-helmet-safety"></i>
                    <span>Patrouilles</span>
                  </a>
                  <div
                    id="collapseThree"
                    class="collapse"
                    aria-labelledby="headingTwo"
                    data-parent="#accordionSidebar"
                  >
                    <div class="bg-white py-2 collapse-inner rounded">
                      <h6 class="collapse-header">Touts les patrouilles:</h6>
                      <Link class="collapse-item" to="/patbaja">
                        Baja
                      </Link>
                      <Link class="collapse-item" to="/patbizerte">
                        Bizerte
                      </Link>
                      <Link class="collapse-item" to="/pathergla">
                        Hergla
                      </Link>
                      <Link class="collapse-item" to="/patjem">
                        Jem
                      </Link>
                      <Link class="collapse-item" to="/patmahres">
                        Mahres
                      </Link>
                      <Link class="collapse-item" to="/patmdjazbab">
                        Mdjazbab
                      </Link>
                      <Link class="collapse-item" to="/patoudhref">
                        Oudhref
                      </Link>
                      <Link class="collapse-item" to="/patturki">
                        Turki
                      </Link>
                    </div>
                  </div>
                </li>

                {/* <!-- Divider --> */}
                <hr class="sidebar-divider" />

                {/* <!-- Heading --> */}
                <div class="sidebar-heading">utilisateurs</div>

                {/* <!-- Nav Item - Tables --> */}
                <li className="nav-item">
                  <Link className="nav-link" to="/inscription">
                    <i className="fas fa-fw fa-user-plus"></i>
                    <span>Inscription</span>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/utilisateurs">
                    <i className="fas fa-fw fa-users-cog"></i>
                    <span>Gérer utilisateurs</span>
                  </Link>
                </li>
              </>
            ) : isAdmin ? (
              <>
                <hr class="sidebar-divider my-0" />

                {/* <!-- Nav Item - Dashboard --> */}
                <li className="nav-item active">
                  <Link className="nav-link" to="/recap">
                    <i className="fas fa-fw fa-car-crash"></i>
                    <span>Securité des accidents</span>
                  </Link>
                </li>
                <li className="nav-item active">
                  <Link className="nav-link" to="/entretient">
                    <i className="fas fa-fw fa-tools"></i>
                    <span>Entretient</span>
                  </Link>
                </li>
                <li className="nav-item active">
                  <Link className="nav-link" to="/patrouille">
                    <i className="fas fa-fw fa-helmet-safety"></i>
                    <span>Patrouille</span>
                  </Link>
                </li>
                {/* <!-- Nav Item - Charts --> */}
                <li class="nav-item">
                  <Link class="nav-link" to="/par-cause">
                    <i class="fas fa-fw fa-chart-area"></i>
                    <span>Statistiques</span>
                  </Link>
                </li>

                {/* <!-- Divider --> */}
                <hr class="sidebar-divider" />

                {/* <!-- Heading --> */}
                <div class="sidebar-heading">utilisateurs</div>

                {/* <!-- Nav Item - Tables --> */}
                <li className="nav-item">
                  <Link className="nav-link" to="/inscription">
                    <i className="fas fa-fw fa-user-plus"></i>
                    <span>Inscription</span>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/utilisateurs">
                    <i className="fas fa-fw fa-users-cog"></i>
                    <span>Gérer utilisateurs</span>
                  </Link>
                </li>
              </>
            ) : isSecurite ? (
              <>
                <hr class="sidebar-divider my-0" />

                {/* <!-- Nav Item - Dashboard --> */}
                <li className="nav-item active">
                  <Link className="nav-link" to="/recap">
                    <i className="fas fa-fw fa-car-crash"></i>
                    <span>Securité des accidents</span>
                  </Link>
                </li>
              </>
            ) : isEntretient ? (
              <>
                <hr class="sidebar-divider my-0" />

                {/* <!-- Nav Item - Dashboard --> */}
                <li className="nav-item active">
                  <Link className="nav-link" to="/entretient">
                    <i className="fas fa-fw fa-tools"></i>
                    <span>Entretient</span>
                  </Link>
                </li>
              </>
            ) : (
              <ul>
                <p>Utilisateur connecté</p>
                <p> n'est pas valide !</p>
              </ul>
            )}
            {/* <!-- Divider --> */}
            <hr class="sidebar-divider d-none d-md-block" />

            {/* <!-- Sidebar Toggler (Sidebar) --> */}
            <div className="text-center d-none d-md-inline">
              <button
                className="rounded-circle border-0"
                id="sidebarToggle"
                onClick={handleSidebarToggle}
              ></button>
            </div>
          </ul>

          {/* <!-- End of Sidebar --> */}

          {/* <!-- Content Wrapper --> */}
          <div id="content-wrapper" class="d-flex flex-column">
            {/* <!-- Main Content --> */}
            <div id="content">
              {/* <!-- Topbar --> */}
              <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                {/* Header Title */}
                {isSidebarToggled ? (
                  <div style={{ position: "absolute", left: "70px" }}>
                    <h3 className="header-title">
                      مصلحة السلامة و الصيانة للطرقات السيارة
                    </h3>

                    <p
                      className="text-muted mt-1 d-block d-md-none"
                      style={{ fontSize: "0.9rem" }}
                    >
                      Bienvenue{" "}
                      {isSuper
                        ? "Super administrateur "
                        : isAdmin
                        ? "Administrateur "
                        : ""}
                      , {currentUserData.name} {currentUserData.lastName}
                    </p>
                  </div>
                ) : (
                    <div style={{ position: "absolute", left: "320px" }}>
                    <h3 className="header-title">
                      مصلحة السلامة و الصيانة للطرقات السيارة
                    </h3>

                    <p
                      className="text-muted mt-1 d-block d-md-none"
                      style={{ fontSize: "0.9rem" }}
                    >
                      Bienvenue{" "}
                      {isSuper
                        ? "Super administrateur "
                        : isAdmin
                        ? "Administrateur "
                        : ""}
                      , {currentUserData.name} {currentUserData.lastName}
                    </p>
                  </div>
                )}

                {/* Sidebar Toggle (Topbar) */}
                <button
                  className="btn btn-link d-md-none rounded-circle mr-3"
                  onClick={() => {
                    document.body.classList.toggle("sidebar-toggled");
                    const sidebar = document.getElementById("accordionSidebar");
                    if (sidebar) {
                      sidebar.classList.toggle("toggled");
                    }

                    // Toggle header title visibility
                    setIsSidebarToggled((prev) => !prev);
                  }}
                >
                  <i className="fa fa-bars"></i>
                </button>

                {/* Topbar Navbar */}
                <ul class="navbar-nav ml-auto">
                  {/* User Info (image only visible always) */}
                  <li class="nav-item dropdown no-arrow">
                    <a
                      class="nav-link dropdown-toggle"
                      href="#"
                      id="userDropdown"
                      role="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      {/* Hidden on mobile, shown on md+ */}
                      <span class="mr-2 d-none d-lg-inline text-gray-600 small">
                        Bienvenue{" "}
                        {isSuper
                          ? "Super administrateur "
                          : isAdmin
                          ? "Administrateur "
                          : ""}
                        , {currentUserData.name} {currentUserData.lastName}
                      </span>
                      <img
                        class="img-profile rounded-circle"
                        src={
                          Array.isArray(currentUserData.image) &&
                          currentUserData.image.length === 0
                            ? avatar
                            : currentUserData.image
                        }
                        alt="user photo"
                        className="avatar"
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    </a>

                    {/* Dropdown */}
                    <div
                      class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                      aria-labelledby="userDropdown"
                    >
                      <a
                        className="dropdown-item d-flex align-items-center"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowModal(true);
                        }}
                      >
                        Modifier le profil
                      </a>
                      {currentUserData && (
                        <UpdateProfile
                          showModal={showModal}
                          onHide={() => setShowModal(false)}
                          dataId={currentUserData._id}
                          rowData={currentUserData}
                        />
                      )}

                      <div class="dropdown-divider"></div>
                      <a
                        class="dropdown-item"
                        href="#"
                        data-toggle="modal"
                        data-target="#logoutModal"
                      >
                        <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                        Déconnexion
                      </a>
                    </div>
                  </li>
                </ul>
              </nav>

              {/* <!-- End of Topbar --> */}

              {/* <!-- Begin Page Content --> */}
              <div class="container-fluid">
                {/* <!-- Page Heading --> */}
                <div class="d-sm-flex align-items-center justify-content-between mb-4">
                  <h1 class="h3 mb-0 text-gray-800">Dashboard</h1>
                </div>

                <div className="content" >
                  <Outlet />
                </div>
              </div>
              {/* <!-- /.container-fluid ----------------------#############################################> */}
            </div>
            {/* <!-- End of Main Content --> */}
          </div>
          {/* <!-- End of Content Wrapper --> */}
        </div>
        {/* <!-- End of Page Wrapper -->

    <!-- Scroll to Top Button--> */}
        <a class="scroll-to-top rounded" href="#page-top">
          <i class="fas fa-angle-up"></i>
        </a>

        <div
          class="modal fade"
          id="logoutModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">
                  Ready to Leave?
                </h5>
                <button
                  class="close"
                  type="button"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div class="modal-body">
                Select "Déconnexion" below if you are ready to end your current
                session.
              </div>
              <div class="modal-footer">
                <button
                  class="btn btn-secondary"
                  type="button"
                  data-dismiss="modal"
                >
                  Cancel
                </button>
                <Link class="btn btn-primary" onClick={handlelogout}>
                  Déconnexion
                </Link>
              </div>
            </div>
          </div>
        </div>
      </body>
    </div>
  );
};

export default Tabchange;
