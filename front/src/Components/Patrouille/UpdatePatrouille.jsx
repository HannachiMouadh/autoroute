import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updatePatData, fetchPatrouilles } from "../../JS/patrouilleSlice/PatrouilleSlice";
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';


const UpdatePatrouille = ({ show, handleClose, selectedData }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(selectedData || {});

  useEffect(() => {
    setFormData(selectedData || {});
  }, [selectedData]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
        try {
          const resultAction = await dispatch(updatePatData({ id: selectedData._id, patData: formData }));
          if (updatePatData.fulfilled.match(resultAction)) {
            dispatch(fetchPatrouilles());
            handleClose(); // Close modal only if add is successful
            dispatch(fetchPatrouilles());
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
        <Modal.Title>Modifier patrouille voiture</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {['matricule', 'startKilometrage','endKilometrage', 'pointKilo', 'tache','observation'].map(field => (
            <Form.Group key={field}>
              <Form.Label>{field}</Form.Label>
              <Form.Control
                name={field}
                value={formData[field] || ''}
                onChange={handleChange}
                disabled={!formData[field]}
              />
            </Form.Group>
          ))}
          <Form.Group>
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" name="ddate" disabled={!formData.ddate} value={formData.ddate || ''} onChange={handleChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Heure</Form.Label>
            <Form.Control type="time" name="time" disabled={!formData.time} value={formData.time || ''} onChange={handleChange} />
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

export default UpdatePatrouille;
