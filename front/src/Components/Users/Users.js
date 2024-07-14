import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { deleteUser, getAllUsers } from '../../JS/userSlice/userSlice';
import './User.css'
import Swal from 'sweetalert2'
import {Link} from 'react-router-dom'

const Users = ({user}) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getAllUsers())
    });
    
     const handleDelete=()=>{
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
          })
          
          swalWithBootstrapButtons.fire({
            title: 'Voulez-vous supprimer cet utilisateur ?',
            // text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui',
            cancelButtonText: 'Annuler',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteUser(user._id))
                
                swalWithBootstrapButtons.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
              )
              window.location.reload();
            };
          })
     }
    return (
        <tr>
            <td>{user.name}</td>
            <td>{user.lastName}</td>
            <td> {user.date_naiss}</td>
            <td>{user.email}</td>
            <td>{user.phone}</td>
            <td>
                <button onClick={handleDelete} className="btn btn-danger">Supprimer</button>
            </td>
        </tr>
    );
}

export default Users;
