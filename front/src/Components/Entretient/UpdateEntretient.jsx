import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  fetchEntData,
  updateEntData,
  uploadPhoto,
} from "../../JS/entretientSlice/EntretientSlice";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import uploadImg from "../../assets/cloud-upload-regular-240.png";

const UpdateEntretient = ({ show, handleClose, selectedData }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(selectedData || {});
  const [previewImages, setPreviewImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (selectedData) {
      setFormData(selectedData);
      // Show existing images as previews
      if (selectedData.image && Array.isArray(selectedData.image)) {
        setPreviewImages(selectedData.image);
      } else {
        setPreviewImages([]);
      }
    }
  }, [selectedData]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const uploadMultipleFiles = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const validFiles = [];

    for (let file of files) {
      if (file.size > MAX_SIZE) {
        toast.error(`Image ${file.name} trop volumineuse (max 10MB)`);
      } else {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) return;

    // Create local previews
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);

    setIsUploading(true);
    const formDataUpload = new FormData();
    for (let file of validFiles) {
      formDataUpload.append("files", file);
    }

    try {
      const resultAction = await dispatch(uploadPhoto(formDataUpload));
      if (uploadPhoto.fulfilled.match(resultAction)) {
        const uploadedPaths = resultAction.payload;
        setFormData((prev) => ({
          ...prev,
          image: [...(prev.image || []), ...uploadedPaths],
        }));
        toast.success("Images chargées !");
      } else {
        toast.error("Échec du chargement image");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur technique image");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      image: (prev.image || []).filter((_, i) => i !== index),
    }));
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
            <Form.Label>Materiel</Form.Label>
            <Form.Control
              type="text"
              name="materiel"
              value={formData.materiel || ""}
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

          {/* Photo Upload */}
          <Form.Group className="mb-3 mt-3">
            <Form.Label>Photos</Form.Label>
            <div className="d-flex align-items-center mb-2">
              <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-block' }}>
                <Button variant="outline-primary" style={{ pointerEvents: 'none' }}>
                  <img src={uploadImg} alt="upload" style={{ width: "24px", marginRight: "8px" }} />
                  Ajouter des photos
                </Button>
                <input
                  type="file"
                  multiple
                  onChange={uploadMultipleFiles}
                  style={{
                    fontSize: '100px',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
              </div>
            </div>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {previewImages.map((src, idx) => (
                <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={src}
                    alt="preview"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "5px",
                      border: "1px solid #ddd"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      background: 'red',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Annuler
        </Button>
        <Button variant="primary" onClick={handleUpdate} disabled={isUploading}>
          {isUploading ? "Chargement..." : "Mettre à jour"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateEntretient;
