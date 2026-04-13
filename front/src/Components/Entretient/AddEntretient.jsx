import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addEntData, fetchEntData, uploadPhoto } from "../../JS/entretientSlice/EntretientSlice";
import { getAllUsers } from "../../JS/userSlice/userSlice"; 
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form"; 
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import uploadImg from "../../assets/cloud-upload-regular-240.png";

const AddEntretient = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  
  const [formData, setFormData] = useState({
    ddate: "",
    time: "",
    tache: "nettoyage",
    pointKilo: "",
    nbOuvrier: "",
    materiel: "",
    observation: "",
    image: [],
    createdBy: "",
  });

  const [previewImages, setPreviewImages] = useState([]);

  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

    // Previews
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);

    setIsUploading(true);
    const formDataUpload = new FormData();
    for (let file of validFiles) {
      formDataUpload.append("files", file);
    }

    try {
      const resultAction = await dispatch(uploadPhoto(formDataUpload));
      console.log("Upload result:", resultAction);
      if (uploadPhoto.fulfilled.match(resultAction)) {
        const uploadedPaths = resultAction.payload; 
        console.log("Uploaded paths:", uploadedPaths);
        setFormData((prev) => ({
          ...prev,
          image: [...(prev.image || []), ...uploadedPaths],
        }));
        toast.success("Images chargées");
      } else {
        console.error("Upload rejected:", resultAction);
        toast.error("Échec du chargement image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Erreur technique image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user._id) {
         toast.error("Utilisateur non connecté");
         return;
    }

    try {
      // Prepare payload matching Schema
      const payload = {
          ...formData,
          createdBy: user._id, // Use ObjectId
      };

      const resultAction = await dispatch(addEntData(payload));
      if (addEntData.fulfilled.match(resultAction)) {
        dispatch(fetchEntData());
        handleClose();
        toast.success("Entretien ajouté !");
        
        // Reset
        setFormData({
            ddate: "",
            time: "",
            tache: "nettoyage",
            pointKilo: "",
            nbOuvrier: "",
            materiel: "",
            observation: "",
            image: [],
            createdBy: "",
        });
        setPreviewImages([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'ajout");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} style={{ marginTop: "50px" }}>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter Entretien</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="ddate">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="ddate"
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="time">
            <Form.Label>Nombre d'heure</Form.Label>
            <Form.Control
              type="number"
              max="20"
              name="time"
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="tache">
            <Form.Label>Tache</Form.Label>
            <Form.Control
              type="text"
              name="tache"
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="pointKilo">
            <Form.Label>PK</Form.Label>
            <Form.Control
              type="text"
              name="pointKilo"
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="nbOuvrier">
            <Form.Label>Nombre d'ouvrier</Form.Label>
            <Form.Control
              type="number"
              name="nbOuvrier"
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="materiel">
            <Form.Label>Matriel</Form.Label>
            <Form.Control
              type="text"
              name="materiel"
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
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3 mt-3">
              <Form.Label>Photos</Form.Label>
              <div className="d-flex align-items-center mb-2">
                 <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-block' }}>
                    <Button variant="outline-primary" style={{ pointerEvents: 'none' }}>
                        <img src={uploadImg} alt="upload" style={{ width: "24px", marginRight: "8px" }} />
                        {isUploading ? "Chargement..." : "Ajouter des photos"}
                    </Button>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={uploadMultipleFiles}
                        disabled={isUploading}
                        style={{
                             fontSize: '100px',
                             position: 'absolute',
                             left: 0,
                             top: 0,
                             opacity: 0,
                             cursor: 'pointer',
                             width: '100%',
                             height: '100%'
                        }}
                    />
                 </div>
              </div>
              <div className="d-flex flex-wrap gap-2 mt-2">
                 {previewImages.map((src, idx) => (
                  <img
                    key={idx}
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
                ))}
              </div>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleClose} className="me-2">
                Annuler
              </Button>
              <Button variant="primary" onClick={handleSubmit} disabled={isUploading}>
                {isUploading ? "Chargement..." : "Enregistrer"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
  );
};

export default AddEntretient;
