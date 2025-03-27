import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchEntData, updateEntData } from '../../JS/entretientSlice/EntretientSlice';
import { Modal, Button, Form } from 'react-bootstrap';


const UpdateEntretient = ({ show, handleClose, selectedData }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(selectedData || {});

  useEffect(() => {
    setFormData(selectedData || {});
  }, [selectedData]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = () => {
    dispatch(updateEntData({ id: selectedData._id, entData: formData }));
    handleClose();
    dispatch(fetchEntData());
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modifier Entretien</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {['matricul', 'kilometrage', 'pointKilo', 'obstacle'].map(field => (
            <Form.Group key={field}>
              <Form.Label>{field}</Form.Label>
              <Form.Control
                name={field}
                value={formData[field] || ''}
                onChange={handleChange}
              />
            </Form.Group>
          ))}
          <Form.Group>
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" name="ddate" value={formData.ddate || ''} onChange={handleChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Heure</Form.Label>
            <Form.Control type="time" name="time" value={formData.time || ''} onChange={handleChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Annuler</Button>
        <Button variant="primary" onClick={handleUpdate}>Mettre à jour</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateEntretient;
