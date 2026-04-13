import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updatePatData, fetchPatrouilles } from "../../JS/patrouilleSlice/PatrouilleSlice";
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { fetchMatricule, updateMatriculeData } from '../../JS/matriculePatrouilleSlice/MatriculePatrouilleSlice';


const UpdateMatricule = ({ show, handleClose, selectedData }) => {
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
          const resultAction = await dispatch(updateMatriculeData({ id: selectedData._id, matriculeData: formData }));
          if (updateMatriculeData.fulfilled.match(resultAction)) {
            dispatch(fetchPatrouilles());
            handleClose(); // Close modal only if add is successful
            dispatch(fetchMatricule());
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
          {['matricule', 'endKilometrage'].map(field => (
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
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Annuler</Button>
        <Button variant="primary" onClick={handleUpdate}>Mettre à jour</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateMatricule;
