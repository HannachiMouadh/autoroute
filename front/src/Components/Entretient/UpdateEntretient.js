import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  fetchEntData,
  updateEntData,
} from "../../JS/entretientSlice/EntretientSlice";
import { Modal, Button, Form } from "react-bootstrap";

const UpdateEntretient = ({ show, handleClose, selectedData }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(selectedData || {});

  useEffect(() => {
    setFormData(selectedData || {});
  }, [selectedData]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = () => {
    dispatch(updateEntData({ id: selectedData._id, entData: formData }));
    dispatch(fetchEntData());
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
          <Form.Group>
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="ddate"
              value={formData.ddate || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Heure</Form.Label>
            <Form.Control
              type="number"
              name="time"
              value={formData.time || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="tache">
            <Form.Label>Tache</Form.Label>
            <Form.Control
              type="text"
              name="tache"
              value={formData.tache || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="pointKilo">
            <Form.Label>Point Kilométrique</Form.Label>
            <Form.Control
              type="number"
              name="pointKilo"
              value={formData.pointKilo || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="metrePK">
            <Form.Label>Metre de PK</Form.Label>
            <Form.Control
              type="number"
              name="metrePK"
              value={formData.metrePK || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="nbOuvrier">
            <Form.Label>Nombre d'ouvrier</Form.Label>
            <Form.Control
              type="number"
              name="nbOuvrier"
              value={formData.nbOuvrier || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="materiel">
            <Form.Label>Matricule</Form.Label>
            <Form.Control
              type="number"
              name="materiel"
              value={formData.matricul || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="observation">
            <Form.Label>Observation</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="observation"
              value={formData.observation || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Annuler
        </Button>
        <Button variant="primary" onClick={handleUpdate}>
          Mettre à jour
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateEntretient;
