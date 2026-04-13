import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { currentUser, logout } from "../JS/userSlice/userSlice.js";
import { UpdateProfile } from "./UpdateUser/UpdateProfile.jsx";
import logo from "../assets/logo.png";
import avatar from "../assets/avatar.png";

// Material UI
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Collapse,
  Menu,
  MenuItem,
  Divider,
  Alert,
  Avatar
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

// Icons
import {
  FaBars,
  FaChartArea,
  FaCarCrash,
  FaTools,
  FaHardHat,
  FaUserPlus,
  FaUsersCog,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
  FaUser
} from "react-icons/fa";

const drawerWidth = 280;
const collapsedDrawerWidth = 65;

const Tabchange = () => {
  const theme = useTheme();
  // Mobile check
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  
  // Sidebar Collapse States
  const [openAccidents, setOpenAccidents] = useState(false);
  const [openEntretients, setOpenEntretients] = useState(false);
  const [openPatrouilles, setOpenPatrouilles] = useState(false);

  // Hover state for desktop drawer
  const [isHovered, setIsHovered] = useState(false);
  const isSidebarHovered = isHovered || isMobile;

  // Dynamic drawer width based on hover
  const currentDrawerWidth = isSidebarHovered ? drawerWidth : collapsedDrawerWidth;

  const [showModal, setShowModal] = useState(false);
  const [online, setOnline] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const userUser = useSelector((state) => state.user);
  const currentUserData = userUser.user || {};
  
  const isSuper = currentUserData?.isSuper;
  const isAdmin = currentUserData?.isAdmin;
  const isSecurite = currentUserData?.role === "securite";
  const isEntretient = currentUserData?.role === "entretient";
  const isAyman = currentUserData?.name === "ayman";

  // Auth & Token Check
  useEffect(() => {
    dispatch(currentUser());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp < now) {
          if (window.confirm("Votre session a expiré. Veuillez vous reconnecter.")) {
            localStorage.removeItem("token");
            navigate("/");
          }
        }
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  }, [navigate]);

  useEffect(() => {
    const handleOnlineStatus = () => setOnline(navigator.onLine);
    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);
    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleCloseUserMenu();
    window.location.reload(); 
  };

  // Drawer Content
  const districts = [
    { name: "Baja", path: "/baja" },
    { name: "Bizerte", path: "/bizerte" },
    { name: "Hergla", path: "/hergla" },
    { name: "Jem", path: "/jem" },
    { name: "Mahres", path: "/mahres" },
    { name: "Mdjazbab", path: "/mdjazbab" },
    { name: "Oudhref", path: "/oudhref" },
    { name: "Turki", path: "/turki" }
  ];

  const entDistricts = [
    { name: "Baja", path: "/entbaja" },
    { name: "Bizerte", path: "/entbizerte" },
    { name: "Hergla", path: "/enthergla" },
    { name: "Jem", path: "/entjem" },
    { name: "Mahres", path: "/entmahres" },
    { name: "Mdjazbab", path: "/entmdjazbab" },
    { name: "Oudhref", path: "/entoudhref" },
    { name: "Turki", path: "/entturki" }
  ];

  const patDistricts = [
    { name: "Baja", path: "/patbaja" },
    { name: "Bizerte", path: "/patbizerte" },
    { name: "Hergla", path: "/pathergla" },
    { name: "Jem", path: "/patjem" },
    { name: "Mahres", path: "/patmahres" },
    { name: "Mdjazbab", path: "/patmdjazbab" },
    { name: "Oudhref", path: "/patoudhref" },
    { name: "Turki", path: "/patturki" }
  ];

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#1e293b', color: 'white' }}>
      {/* Sidebar Header / Brand */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', minHeight: '64px' }}>
        <img src={logo} alt="Logo" style={{ width: "40px", marginRight: isSidebarHovered ? "10px" : "0px", transition: 'all 0.3s' }} />
        <Box sx={{ display: isSidebarHovered ? 'block' : 'none', opacity: isSidebarHovered ? 1 : 0, transition: 'opacity 0.3s' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>District: {currentUserData.district}</Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>Rôle: {currentUserData.role}</Typography>
        </Box>
      </Box>

      <List component="nav" sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {(isAyman && isAdmin) && (
          <>
          <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
                <Typography variant="overline" sx={{ px: 2, color: '#94a3b8', display: isSidebarHovered ? 'block' : 'none' }}>Gestion District</Typography>
                  <ListItemButton component={Link} to="/recap" sx={{ justifyContent: isSidebarHovered ? 'initial' : 'center', px: 2.5 }}>
                    <ListItemIcon sx={{ color: '#ffffff', minWidth: 0, mr: isSidebarHovered ? 3 : 'auto', justifyContent: 'center' }}><FaCarCrash /></ListItemIcon>
                    <ListItemText primary="Securité des accidents" sx={{ opacity: isSidebarHovered ? 1 : 0, display: isSidebarHovered ? 'block' : 'none' }} />
                </ListItemButton>
                <ListItemButton component={Link} to="/entretient" sx={{ justifyContent: isSidebarHovered ? 'initial' : 'center', px: 2.5 }}>
                    <ListItemIcon sx={{ color: '#ffffff', minWidth: 0, mr: isSidebarHovered ? 3 : 'auto', justifyContent: 'center' }}><FaTools /></ListItemIcon>
                    <ListItemText primary="Entretient" sx={{ opacity: isSidebarHovered ? 1 : 0, display: isSidebarHovered ? 'block' : 'none' }} />
                </ListItemButton>
                <ListItemButton component={Link} to="/patrouille" sx={{ justifyContent: isSidebarHovered ? 'initial' : 'center', px: 2.5 }}>
                    <ListItemIcon sx={{ color: '#ffffff', minWidth: 0, mr: isSidebarHovered ? 3 : 'auto', justifyContent: 'center' }}><FaHardHat /></ListItemIcon>
                    <ListItemText primary="Patrouille" sx={{ opacity: isSidebarHovered ? 1 : 0, display: isSidebarHovered ? 'block' : 'none' }} />
                </ListItemButton>
               </>)}
        {(isSuper || isAyman) && (
            <>
                {/* Stats */}
                <ListItemButton component={Link} to="/par-cause-superadmin" sx={{ justifyContent: isSidebarHovered ? 'initial' : 'center', px: 2.5 }}>
                    <ListItemIcon sx={{ color: '#ffffff', minWidth: 0, mr: isSidebarHovered ? 3 : 'auto', justifyContent: 'center' }}><FaChartArea /></ListItemIcon>
                    <ListItemText primary="Statistiques" sx={{ opacity: isSidebarHovered ? 1 : 0, display: isSidebarHovered ? 'block' : 'none' }} />
                </ListItemButton>

                <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
                <Typography variant="overline" sx={{ px: 2, color: '#94a3b8', display: isSidebarHovered ? 'block' : 'none' }}>Toutes les districts</Typography>

                {/* Accidents */}
                <ListItemButton onClick={() => setOpenAccidents(!openAccidents)} sx={{ justifyContent: isSidebarHovered ? 'initial' : 'center', px: 2.5 }}>
                    <ListItemIcon sx={{ color: '#ffffff', minWidth: 0, mr: isSidebarHovered ? 3 : 'auto', justifyContent: 'center' }}><FaCarCrash /></ListItemIcon>
                    <ListItemText primary="Accidents" sx={{ opacity: isSidebarHovered ? 1 : 0, display: isSidebarHovered ? 'block' : 'none' }} />
                    {isSidebarHovered && (openAccidents ? <FaChevronUp size={12}/> : <FaChevronDown size={12}/>)}
                </ListItemButton>
                <Collapse in={openAccidents && isSidebarHovered} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {districts.map(d => (
                            <ListItemButton key={d.name} component={Link} to={d.path} sx={{ pl: 4 }}>
                                <ListItemText primary={d.name} primaryTypographyProps={{ fontSize: '0.9rem', color: '#cbd5e1' }} />
                            </ListItemButton>
                        ))}
                    </List>
                </Collapse>

                 {/* Entretients */}
                 <ListItemButton onClick={() => setOpenEntretients(!openEntretients)} sx={{ justifyContent: isSidebarHovered ? 'initial' : 'center', px: 2.5 }}>
                    <ListItemIcon sx={{ color: '#ffffff', minWidth: 0, mr: isSidebarHovered ? 3 : 'auto', justifyContent: 'center' }}><FaTools /></ListItemIcon>
                    <ListItemText primary="Entretients" sx={{ opacity: isSidebarHovered ? 1 : 0, display: isSidebarHovered ? 'block' : 'none' }} />
                    {isSidebarHovered && (openEntretients ? <FaChevronUp size={12}/> : <FaChevronDown size={12}/>)}
                </ListItemButton>
                <Collapse in={openEntretients && isSidebarHovered} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {entDistricts.map(d => (
                            <ListItemButton key={d.name} component={Link} to={d.path} sx={{ pl: 4 }}>
                                <ListItemText primary={d.name} primaryTypographyProps={{ fontSize: '0.9rem', color: '#cbd5e1' }} />
                            </ListItemButton>
                        ))}
                    </List>
                </Collapse>

                {/* Patrouilles */}
                <ListItemButton onClick={() => setOpenPatrouilles(!openPatrouilles)} sx={{ justifyContent: isSidebarHovered ? 'initial' : 'center', px: 2.5 }}>
                    <ListItemIcon sx={{ color: '#ffffff', minWidth: 0, mr: isSidebarHovered ? 3 : 'auto', justifyContent: 'center' }}><FaHardHat /></ListItemIcon>
                    <ListItemText primary="Patrouilles" sx={{ opacity: isSidebarHovered ? 1 : 0, display: isSidebarHovered ? 'block' : 'none' }} />
                    {isSidebarHovered && (openPatrouilles ? <FaChevronUp size={12}/> : <FaChevronDown size={12}/>)}
                </ListItemButton>
                <Collapse in={openPatrouilles && isSidebarHovered} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {patDistricts.map(d => (
                            <ListItemButton key={d.name} component={Link} to={d.path} sx={{ pl: 4 }}>
                                <ListItemText primary={d.name} primaryTypographyProps={{ fontSize: '0.9rem', color: '#cbd5e1' }} />
                            </ListItemButton>
                        ))}
                    </List>
                </Collapse>
                
                 <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
                 <Typography variant="overline" sx={{ px: 2, color: '#94a3b8', display: isSidebarHovered ? 'block' : 'none' }}>Utilisateurs</Typography>
                 
                 <ListItemButton component={Link} to="/inscription" sx={{ justifyContent: isSidebarHovered ? 'initial' : 'center', px: 2.5 }}>
                    <ListItemIcon sx={{ color: '#ffffff', minWidth: 0, mr: isSidebarHovered ? 3 : 'auto', justifyContent: 'center' }}><FaUserPlus /></ListItemIcon>
                    <ListItemText primary="Inscription" sx={{ opacity: isSidebarHovered ? 1 : 0, display: isSidebarHovered ? 'block' : 'none' }} />
                 </ListItemButton>
                  <ListItemButton component={Link} to="/utilisateurs" sx={{ justifyContent: isSidebarHovered ? 'initial' : 'center', px: 2.5 }}>
                    <ListItemIcon sx={{ color: '#ffffff', minWidth: 0, mr: isSidebarHovered ? 3 : 'auto', justifyContent: 'center' }}><FaUsersCog /></ListItemIcon>
                    <ListItemText primary="Gérer utilisateurs" sx={{ opacity: isSidebarHovered ? 1 : 0, display: isSidebarHovered ? 'block' : 'none' }} />
                 </ListItemButton>
            </>
        )}
        
        
        {isAdmin && !isAyman && !isSuper && (
             <>
             <ListItemButton component={Link} to="/par-cause-admin" sx={{ justifyContent: isSidebarHovered ? 'initial' : 'center', px: 2.5 }}>
                    <ListItemIcon sx={{ color: '#ffffff', minWidth: 0, mr: isSidebarHovered ? 3 : 'auto', justifyContent: 'center' }}><FaChartArea /></ListItemIcon>
                    <ListItemText primary="Statistiques" sx={{ opacity: isSidebarHovered ? 1 : 0, display: isSidebarHovered ? 'block' : 'none' }} />
                </ListItemButton>
                <ListItemButton component={Link} to="/recap" sx={{ justifyContent: isSidebarHovered ? 'initial' : 'center', px: 2.5 }}>
                    <ListItemIcon sx={{ color: '#ffffff', minWidth: 0, mr: isSidebarHovered ? 3 : 'auto', justifyContent: 'center' }}><FaCarCrash /></ListItemIcon>
                    <ListItemText primary="Securité des accidents" sx={{ opacity: isSidebarHovered ? 1 : 0, display: isSidebarHovered ? 'block' : 'none' }} />
                </ListItemButton>
                <ListItemButton component={Link} to="/entretient" sx={{ justifyContent: isSidebarHovered ? 'initial' : 'center', px: 2.5 }}>
                    <ListItemIcon sx={{ color: '#ffffff', minWidth: 0, mr: isSidebarHovered ? 3 : 'auto', justifyContent: 'center' }}><FaTools /></ListItemIcon>
                    <ListItemText primary="Entretient" sx={{ opacity: isSidebarHovered ? 1 : 0, display: isSidebarHovered ? 'block' : 'none' }} />
                </ListItemButton>
                <ListItemButton component={Link} to="/patrouille" sx={{ justifyContent: isSidebarHovered ? 'initial' : 'center', px: 2.5 }}>
                    <ListItemIcon sx={{ color: '#ffffff', minWidth: 0, mr: isSidebarHovered ? 3 : 'auto', justifyContent: 'center' }}><FaHardHat /></ListItemIcon>
                    <ListItemText primary="Patrouille" sx={{ opacity: isSidebarHovered ? 1 : 0, display: isSidebarHovered ? 'block' : 'none' }} />
                </ListItemButton>
                <ListItemButton component={Link} to="/par-cause" sx={{ justifyContent: isSidebarHovered ? 'initial' : 'center', px: 2.5 }}>
                    <ListItemIcon sx={{ color: '#ffffff', minWidth: 0, mr: isSidebarHovered ? 3 : 'auto', justifyContent: 'center' }}><FaChartArea /></ListItemIcon>
                    <ListItemText primary="Statistiques" sx={{ opacity: isSidebarHovered ? 1 : 0, display: isSidebarHovered ? 'block' : 'none' }} />
                </ListItemButton>
                
                 <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
                 <Typography variant="overline" sx={{ px: 2, color: '#94a3b8', display: isSidebarHovered ? 'block' : 'none' }}>Utilisateurs</Typography>
                 
                <ListItemButton component={Link} to="/inscription" sx={{ justifyContent: isSidebarHovered ? 'initial' : 'center', px: 2.5 }}>
                    <ListItemIcon sx={{ color: '#ffffff', minWidth: 0, mr: isSidebarHovered ? 3 : 'auto', justifyContent: 'center' }}><FaUserPlus /></ListItemIcon>
                    <ListItemText primary="Inscription" sx={{ opacity: isSidebarHovered ? 1 : 0, display: isSidebarHovered ? 'block' : 'none' }} />
                 </ListItemButton>
                  <ListItemButton component={Link} to="/utilisateurs" sx={{ justifyContent: isSidebarHovered ? 'initial' : 'center', px: 2.5 }}>
                    <ListItemIcon sx={{ color: '#ffffff', minWidth: 0, mr: isSidebarHovered ? 3 : 'auto', justifyContent: 'center' }}><FaUsersCog /></ListItemIcon>
                    <ListItemText primary="Gérer utilisateurs" sx={{ opacity: isSidebarHovered ? 1 : 0, display: isSidebarHovered ? 'block' : 'none' }} />
                 </ListItemButton>
             </>
        )}

        
        {isSecurite && !isAyman && !isSuper && !isAdmin && (
              <ListItemButton component={Link} to="/recap" sx={{ justifyContent: isSidebarHovered ? 'initial' : 'center', px: 2.5 }}>
                    <ListItemIcon sx={{ color: '#ffffff', minWidth: 0, mr: isSidebarHovered ? 3 : 'auto', justifyContent: 'center' }}><FaCarCrash /></ListItemIcon>
                    <ListItemText primary="Securité des accidents" sx={{ opacity: isSidebarHovered ? 1 : 0, display: isSidebarHovered ? 'block' : 'none' }} />
               </ListItemButton>
        )}
        
        {isEntretient && !isAyman && !isSuper && !isAdmin && (
             <ListItemButton component={Link} to="/entretient" sx={{ justifyContent: isSidebarHovered ? 'initial' : 'center', px: 2.5 }}>
                <ListItemIcon sx={{ color: '#ffffff', minWidth: 0, mr: isSidebarHovered ? 3 : 'auto', justifyContent: 'center' }}><FaTools /></ListItemIcon>
                <ListItemText primary="Entretient" sx={{ opacity: isSidebarHovered ? 1 : 0, display: isSidebarHovered ? 'block' : 'none' }} />
            </ListItemButton>
        )}
        
        {(!isSuper && !isAdmin && !isSecurite && !isEntretient && !isAyman) && (
             <ListItemButton sx={{ justifyContent: isSidebarHovered ? 'initial' : 'center', px: 2.5 }}>
                 <ListItemText primary="Utilisateur non valide" sx={{ opacity: isSidebarHovered ? 1 : 0, display: isSidebarHovered ? 'block' : 'none', whiteSpace: 'nowrap' }} />
             </ListItemButton>
        )}
      </List>
      
      {/* Footer Info or just spacing */}
      <Box sx={{ p: 2, textAlign: 'center', display: isSidebarHovered ? 'block' : 'none' }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>© 2024 AutoRoute</Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Top AppBar */}
      <AppBar 
        position="fixed" 
        sx={{ 
            width: { md: `calc(100% - ${currentDrawerWidth}px)` },
            ml: { md: `${currentDrawerWidth}px` },
            bgcolor: 'white',
            color: '#333',
            boxShadow: 1,
            transition: 'width 0.3s, margin 0.3s'
        }}
      >
        <Toolbar>
           <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <FaBars />
          </IconButton>

          <Box sx={{ flexGrow: 1 }}>
             <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: '#0f172a' }}>
                 مصلحة السلامة و الصيانة للطرقات السيارة
             </Typography>
             {/* Mobile welcome subtext often hidden or simplified */}
             <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' }, color: '#64748b' }}>
                 Bienvenue {isSuper ? "Super Admin" : isAdmin ? "Admin" : ""}, {currentUserData.name} {currentUserData.lastName}
             </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 0 }}>
             <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                 <Avatar 
                    alt={currentUserData.name} 
                    src={ (currentUserData.image && currentUserData.image.length > 0) ? currentUserData.image : avatar} 
                    sx={{ width: 40, height: 40, border: '2px solid #e2e8f0' }}
                 />
             </IconButton>
              <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={() => { handleCloseUserMenu(); setShowModal(true); }}>
                <ListItemText>{currentUserData && (
        <UpdateProfile
            showModal={showModal}
            onHide={() => setShowModal(false)}
            dataId={currentUserData._id}
            rowData={currentUserData}
        />
      )}Modifier Profile</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon><FaSignOutAlt /></ListItemIcon>
                <ListItemText>Déconnexion</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ 
            width: { md: currentDrawerWidth }, 
            flexShrink: { md: 0 },
            transition: 'width 0.3s'
        }}
      >
         {/* Mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }} 
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
        
        {/* Desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: currentDrawerWidth,
                transition: 'width 0.3s',
                overflowX: 'hidden'
            },
          }}
          open
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{ 
            flexGrow: 1, 
            p: 3, 
            width: { md: `calc(100% - ${currentDrawerWidth}px)` },
            minHeight: '100vh',
            bgcolor: '#f8fafc',
            mt: '64px',
            transition: 'width 0.3s, margin 0.3s'
        }}
        >
        {!online && (
             <Alert severity="error" sx={{ mb: 2 }}>
               Connection lost! Please check your internet connection.
             </Alert>
        )}
        <Box sx={{ width: '100%' }}>
           <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Tabchange;