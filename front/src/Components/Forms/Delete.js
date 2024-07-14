// delete.js
import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { deleteForm } from '../../JS/formSlice/FormSlice';
import { RxCross1 } from "react-icons/rx";
import toast, { Toaster } from 'react-hot-toast';

const Delete = ({ dataIdd, onDelete }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);


  const handleDelete = async () => {
    dispatch(deleteForm(dataIdd));
    console.log(dataIdd);
    setShowModal(false)
    
    setTimeout(function () {
      window.location.reload();
     }, 600); 
     setTimeout(function () {
      toast.success('Successfully toasted!')
     }, 1500); 
     
  };
  

  return (
    <>
      <Button variant="danger" onClick={() => setShowModal(true)} style={{ width: "40px" }}>
      <RxCross1 />
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this data?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Delete;
