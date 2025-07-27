import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaRegEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../JS/userSlice/userSlice";

const ShowDataRow = ({ ShowRowData }) => {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const showData = {
    tache: ShowRowData.tache || "",
    time: ShowRowData.time || "",
    pointKilo: ShowRowData.pointKilo || "",
    nbOuvrier: ShowRowData.nbOuvrier || "",
    materiel: ShowRowData.materiel || "",
    image: ShowRowData.image || "",
    observation: ShowRowData.observation || "",
    ddate: ShowRowData.ddate || "",
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        <FaRegEye />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>تفاصيل الحادث</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <p><strong>Date:</strong> {showData.ddate}</p>
        <p><strong>Nbr d'heure:</strong> {showData.time}</p>
        <p><strong>Tache:</strong> {showData.tache}</p>
        <p><strong>Point Kilo:</strong> {showData.pointKilo}</p>
        <p><strong>Nbr d'ouvrier:</strong> {showData.nbOuvrier}</p>
          <p><strong>Materiel:</strong> {showData.materiel}</p>
          <p><strong>Observation:</strong> {showData.observation}</p>
          {Array.isArray(showData?.image) &&
                  showData.image.map((imgPath, index) => (
                    <img
                      key={index}
                      src={imgPath}
                      alt={`Preview ${index}`}
                      className="avatar"
                      style={{
                        maxWidth: "330px",
                        maxHeight: "500px",
                        margin: "5px",
                        borderRadius: 3,
                      }}
                    />
                  ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ShowDataRow;
