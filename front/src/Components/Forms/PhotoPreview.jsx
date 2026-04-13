// components/PhotoPreviewModal.js
import React from "react";
import { Modal, Button } from "react-bootstrap";

const PhotoPreview = ({ show, handleClose, imageUrl }) => {
  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>معاينة الصورة</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ textAlign: "center" }}>
        <img
          src={imageUrl}
          alt="Preview"
          style={{
            maxWidth: "100%",
            maxHeight: "70vh",
            borderRadius: 8,
            objectFit: "contain",
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          إغلاق
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PhotoPreview;
