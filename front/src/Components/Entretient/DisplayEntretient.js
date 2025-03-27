import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEntData, deleteEntData } from '../../JS/entretientSlice/EntretientSlice';
import AddEntretient from './AddEntretient';
import UpdateEntretient from './UpdateEntretient';
import { Button, Table } from 'react-bootstrap';
import Swal from "sweetalert2";
import './DisplayEntretient.css'
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";


const DisplayEntretient = () => {
  const dispatch = useDispatch();
  const entDatass = useSelector((state) => state.entData.entDatas);
  const [showAdd, setShowAdd] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [selected, setSelected] = useState(null);
console.log(entDatass);

  

  useEffect(() => {
    dispatch(fetchEntData());
  }, [dispatch]);

    const handleDelete = (id) => {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      });
  
      swalWithBootstrapButtons.fire({
        title: 'Voulez-vous supprimer cette donnée ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Annuler',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          console.log(`Deleting data with id: ${id}`);
          dispatch(deleteEntData(id)).then(() => {
            swalWithBootstrapButtons.fire(
              'Deleted!',
              'Votre donnée est suprimé.',
              'succès'
            );
            dispatch(fetchEntData());
          }).catch((error) => {
            console.error("Error deleting data:", error);
            swalWithBootstrapButtons.fire(
              'Error!',
              'Il y a un problem lors de la supression.',
              'error'
            );
          });
        }
      });
    };

  return (
    <div className="container mt-4 entretien-container">
  <div className="entretien-header">
    <h2>Liste des entretiens</h2>
    <Button variant="success" onClick={() => setShowAdd(true)}>
      Ajouter
    </Button>
  </div>

  <div className="entretien-table">
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Matricule</th>
          <th>Kilométrage</th>
          <th>Point KM</th>
          <th>Obstacle</th>
          <th>Date</th>
          <th>Heure</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {entDatass && entDatass.map((item) => (
          <tr key={item._id}>
            <td>{item.matricul}</td>
            <td>{item.kilometrage}</td>
            <td>{item.pointKilo}</td>
            <td>{item.obstacle}</td>
            <td>{item.ddate}</td>
            <td>{item.time}</td>
            <td className="entretien-actions">
              <Button
                variant="warning"
                className="me-2"
                onClick={() => {
                  setSelected(item);
                  setShowUpdate(true);
                }}
              >
                <FaRegEdit/>
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(item._id)}
              >
                <MdDeleteOutline/>
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>

  <AddEntretient show={showAdd} handleClose={() => setShowAdd(false)} />
  <UpdateEntretient show={showUpdate} handleClose={() => setShowUpdate(false)} selectedData={selected} />
</div>
  );
};

export default DisplayEntretient;
