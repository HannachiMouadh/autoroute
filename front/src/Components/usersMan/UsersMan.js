import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllUsers, deleteUser } from "../../JS/userSlice/userSlice";
import Table from "react-bootstrap/Table";
import Swal from "sweetalert2";
import "./usersMan.css";
import { UpdateUser } from "../UpdateUser/UpdateUser";

const UsersMan = () => {
  const dispatch = useDispatch();
  const { users, status } = useSelector((state) => state.user);

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

  const regularUsers = Array.isArray(users) ? users.filter(user => !user.isAdmin) : [];
  const adminUsers = Array.isArray(users) ? users.filter(user => user.isAdmin) : [];

  return (
    <div className="users-container">
      <h2>Utilisateurs</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
          <th>Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {regularUsers.length > 0 ? regularUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td><UpdateUser dataId={user._id} rowData={user} />
                <button 
                  className="btn btn-danger" 
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No regular users found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <h2>Admininistrateur</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {adminUsers.length > 0 ? adminUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td><UpdateUser dataId={user._id} rowData={user} /></td>
            </tr>
          )) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No admin users found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default UsersMan;
