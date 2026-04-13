import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPatData } from '../../JS/patrouilleSlice/PatrouilleSlice';
import { Modal, Button, Form } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from 'react';
import { addMatriculeData, fetchMatricule } from '../../JS/matriculePatrouilleSlice/MatriculePatrouilleSlice';

const AddMatricule = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    matricule: '',
    endKilometrage: '',
    createdBy: ''
  });
    const user = useSelector((state) => state.user.user);
    useEffect(() => {
      setFormData({ ...formData, createdBy: user?._id });
    }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(addMatriculeData(formData));
      if (addMatriculeData.fulfilled.match(resultAction)) {
        dispatch(fetchMatricule());
        handleClose(); // Close modal only if add is successful
            toast.success("تم تحديث البيانات بنجاح!", {
              position: "top-right",
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
      }
    } catch (error) {
      console.error('Failed to add:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter Voiture patrouille</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="matricul">
            <Form.Label>Matricule</Form.Label>
            <Form.Control type="text" name="matricule" onChange={handleChange} required />
          </Form.Group>
          <Form.Group controlId="kilometrage">
            <Form.Label>Kilométrage actuelle</Form.Label>
            <Form.Control type="text" name="endKilometrage" onChange={handleChange} required />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Annuler</Button>
        <Button variant="primary" onClick={handleSubmit}>Ajouter</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddMatricule;
