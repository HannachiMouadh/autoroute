import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllUsers, deleteUser, currentUser } from "../../JS/userSlice/userSlice";
import Table from "react-bootstrap/Table";
import Swal from "sweetalert2";
import "./usersMan.css";
import { UpdateUserData } from "../UpdateUser/UpdateUserData";

const UsersMan = ({userManLieu}) => {
  const dispatch = useDispatch();
  const { users, status } = useSelector((state) => state.user);
    const isAuth = localStorage.getItem("token");
      const userRedux = useSelector((state) => state.user.users);
  
      useEffect(() => {
        dispatch(currentUser());
      }, [dispatch]);
      
      const currentUserData = useSelector((state) => state.user.user);
      const isSuper = currentUserData?.isSuper;
      const isAdmin = currentUserData?.isAdmin;
      const isAyman = currentUserData?.name === "ayman";
        const currentRole = currentUserData?.role;
        const currentDistrict = currentUserData?.district;
      
      // Only isSuper and isAyman can access this page
      const canAccess = isSuper || (isAyman && isAdmin);
      
      useEffect(() => {
        if (currentUserData) {
          console.log("Current user data:", currentUserData);
          console.log("Is Super Admin:", isSuper);
          console.log("Is Admin:", isAdmin);
        }
      }, [currentUserData, isSuper, isAdmin]);
      

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleDelete = (_id) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: 'Voulez-vous supprimer cet utilisateur ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteUser(_id)).then(() => {
          swalWithBootstrapButtons.fire(
            'Deleted!',
            'User has been deleted.',
            'success'
          );
          window.location.reload();
        });
      }
    });
    
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Failed to fetch users</div>;
  }

  // // If user doesn't have access, show nothing
  // if (!canAccess) {
  //   return <div style={{textAlign:"center", padding:"2rem"}}>Accès non autorisé</div>;
  // }

  // All regular users (non-admin) across all districts
  const allRegularUsers = Array.isArray(users) ? users.filter(user => user?.district === currentDistrict && !user.isAdmin && !user.isSuper) : [];
  // All district admins (admin but not super)
  const allRegularUsersSuperAdmin = Array.isArray(users) ? users.filter(user => !user.isAdmin && !user.isSuper) : [];
  const allDistrictAdmins = Array.isArray(users) ? users.filter(user => user?.district === currentDistrict && user.isAdmin && !user.isSuper) : [];
  // All admins including super (only for isAyman)
  const allAdmins = Array.isArray(users) ? users.filter(user => user.isAdmin && !user.isSuper) : [];
  const SuperAdmin = Array.isArray(users) ? users.filter(user => user?.isSuper && user?.isAdmin) : [];

  return (
    <div className="users-container">
      <h2>Utilisateurs</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Prénom</th>
            <th>Nom</th>
            <th>District</th>
            <th>Login</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {allRegularUsers.length > 0 ? allRegularUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.lastName}</td>
              <td>{user.district}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td style={{textAlign:"center"}}>
                <UpdateUserData dataId={user._id} rowData={user} />
                <button 
                  className="btn btn-danger" 
                  onClick={() => handleDelete(user._id)}
                >
                  <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-trash"
                          viewBox="0 0 16 16"
                        >
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                        </svg>
                </button>
              </td>
            </tr>
          )) : allRegularUsersSuperAdmin.length > 0 ? allRegularUsersSuperAdmin.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.lastName}</td>
              <td>{user.district}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td style={{textAlign:"center"}}>
                <UpdateUserData dataId={user._id} rowData={user} />
                <button 
                  className="btn btn-danger" 
                  onClick={() => handleDelete(user._id)}
                >
                  <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-trash"
                          viewBox="0 0 16 16"
                        >
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                        </svg>
                </button>
              </td>
            </tr>
          )) : ( <tr><td colSpan="6" style={{textAlign:"center"}}>Aucun utilisateur trouvé</td></tr>)}
        </tbody>
      </Table>

      <h2>Administrateurs de district</h2>
      <Table striped bordered hover className="tab">
        <thead>
          <tr>
            <th>Prénom</th>
            <th>Nom</th>
            <th>District</th>
            <th>Login</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          { allDistrictAdmins.length > 0 ? allDistrictAdmins.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.lastName}</td>
              <td>{user.district}</td>
              <td>{user.email}</td>
              <td style={{textAlign:"center"}}>
                <UpdateUserData dataId={user._id} rowData={user} />
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(user._id)}
                >
                  <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-trash"
                          viewBox="0 0 16 16"
                        >
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                        </svg>
                </button>
              </td>
            </tr>
          )) : ((isSuper && allAdmins.length > 0) ? allAdmins.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.lastName}</td>
              <td>{user.district}</td>
              <td>{user.email}</td>
              <td style={{textAlign:"center"}}>
                <UpdateUserData dataId={user._id} rowData={user} />
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(user._id)}
                >
                  <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-trash"
                          viewBox="0 0 16 16"
                        >
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                        </svg>
                </button>
              </td>
            </tr>)) : <tr><td colSpan="5" style={{textAlign:"center"}}>Aucun administrateur trouvé</td></tr>)}
        </tbody>
      </Table>

      {/* Only isAyman can see and manage all admins (including super admins) */}
      {isAyman && (
        <>
          <h2>Tous les Administrateurs</h2>
          <Table striped bordered hover className="tab">
            <thead>
              <tr>
                <th>Prénom</th>
                <th>Nom</th>
                <th>District</th>
                <th>Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allAdmins.length > 0 ? allAdmins.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.lastName}</td>
                  <td>{user.district}</td>
                  <td>{user.email}</td>
                  <td style={{textAlign:"center"}}>
                    <UpdateUserData dataId={user._id} rowData={user} />
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(user._id)}
                    >
                      <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-trash"
                              viewBox="0 0 16 16"
                            >
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                            </svg>
                    </button>
                  </td>
                </tr>
              )) : (isSuper && SuperAdmin.length > 0 ? SuperAdmin.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.lastName}</td>
                  <td>{user.district}</td>
                  <td>{user.email}</td>
                  <td style={{textAlign:"center"}}>
                    <UpdateUserData dataId={user._id} rowData={user} />
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(user._id)}
                    >
                      <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-trash"
                              viewBox="0 0 16 16"
                            >
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                            </svg>
                    </button>
                  </td>
                </tr>)) :<tr><td colSpan="5" style={{textAlign:"center"}}>Aucun administrateur trouvé</td></tr>)}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};

export default UsersMan;
