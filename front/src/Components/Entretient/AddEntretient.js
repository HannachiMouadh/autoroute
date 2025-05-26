import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addEntData,
  fetchEntData,
} from "../../JS/entretientSlice/EntretientSlice";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { Col, Row } from "react-bootstrap";
import { uploadPhoto } from "../../JS/entretientSlice/EntretientSlice";
import uploadImg from "../../assets/cloud-upload-regular-240.png";

const AddEntretient = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [formData, setFormData] = useState({
    ddate: "",
    time: "",
    tache: "",
    pointKilo: "",
    nbOuvrier: "",
    materiel: "",
    image: "",
    observation: "",
    createdBy: "",
  });
  useEffect(() => {
    setFormData({ ...formData, createdBy: user?._id });
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
      console.error("Failed to add:", error);
    }
  };
  const uploadMultipleFiles = async (files) => {
    const formDataUpload = new FormData();
    for (let file of files) {
      formDataUpload.append("files", file);
    }

    try {
      const resultAction = await dispatch(uploadPhoto(formDataUpload));
      if (uploadPhoto.fulfilled.match(resultAction)) {
        const uploadedPaths = resultAction.payload; // array of file paths
        console.error("uploadedPaths", uploadedPaths);
        setFormData((prev) => ({
          ...prev,
          image: [...(prev.image || []), ...uploadedPaths], // ✅ append to existing
        }));
      }
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
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
            <Form.Label>Heure</Form.Label>
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
          <Form.Group controlId="imageUpload" className="mt-4">
            <Form.Label className="rtl-text">:صور </Form.Label>
            <Row>
              <Col md={6}>
                <div className="drop-file-input">
                  <div className="drop-file-input__label text-center">
                    <img
                      src={uploadImg}
                      alt="Upload"
                      style={{ width: 40, height: 40 }}
                    />
                    <p>اختر صور</p>
                  </div>
                  <Form.Control
                    type="file"
                    name="image"
                    accept="image/*"
                    multiple
                    onChange={(e) => uploadMultipleFiles(e.target.files)} // ✅ Corrected
                  />
                </div>
              </Col>

              <Col
                md={6}
                className="d-flex justify-content-center align-items-center"
              >
                {Array.isArray(formData?.image) &&
                  formData.image.map((imgPath, index) => (
                    <img
                      key={index}
                      src={`http://localhost:5000${imgPath}`}
                      alt={`Preview ${index}`}
                      className="avatar"
                      style={{
                        maxWidth: "100px",
                        maxHeight: "100px",
                        margin: "5px",
                        borderRadius: 8,
                      }}
                    />
                  ))}
              </Col>
            </Row>
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
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Annuler
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Ajouter
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEntretient;
