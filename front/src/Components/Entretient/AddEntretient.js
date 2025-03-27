import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addEntData, fetchEntData } from '../../JS/entretientSlice/EntretientSlice';
import { Modal, Button, Form } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";

const AddEntretient = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    matricul: '',
    kilometrage: '',
    pointKilo: '',
    obstacle: '',
    ddate: '',
    time: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(addEntData(formData));
      if (addEntData.fulfilled.match(resultAction)) {
        dispatch(fetchEntData());
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
        <Modal.Title>Ajouter Entretien</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="matricul">
            <Form.Label>Matricule</Form.Label>
            <Form.Control type="text" name="matricul" onChange={handleChange} required />
          </Form.Group>
          <Form.Group controlId="kilometrage">
            <Form.Label>Kilométrage</Form.Label>
            <Form.Control type="text" name="kilometrage" onChange={handleChange} required />
          </Form.Group>
          <Form.Group controlId="pointKilo">
            <Form.Label>Point Kilométrique</Form.Label>
            <Form.Control type="text" name="pointKilo" onChange={handleChange} required />
          </Form.Group>
          <Form.Group controlId="obstacle">
            <Form.Label>Obstacle</Form.Label>
            <Form.Control type="text" name="obstacle" onChange={handleChange} required />
          </Form.Group>
          <Form.Group controlId="ddate">
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" name="ddate" onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="time">
            <Form.Label>Heure</Form.Label>
            <Form.Control type="time" name="time" onChange={handleChange} />
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

export default AddEntretient;
