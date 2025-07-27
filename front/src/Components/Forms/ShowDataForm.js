import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaRegEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../JS/userSlice/userSlice";

const ShowForm = ({ ShowRowData }) => {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const showData = {
    matriculeA: ShowRowData.matriculeA || "",
    degat: ShowRowData.degat || "",
    sens: ShowRowData.sens || "",
    nk: ShowRowData.nk || "",
    mtr: ShowRowData.mtr || "",
    nbrmort: ShowRowData.nbrmort || "",
    nbrblesse: ShowRowData.nbrblesse || "",
    cause: ShowRowData.cause || "",
    ddate: ShowRowData.ddate || "",
    day: ShowRowData.day || "",
    months: ShowRowData.months || "",
    years: ShowRowData.years || "",
    hours: ShowRowData.hours || "",
    minutes: ShowRowData.minutes || "",
    image: ShowRowData.image || "",
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
        <p><strong>التاريخ:</strong> {showData.ddate}</p>
        <p><strong>الوقت:</strong> {showData.hours}:{showData.minutes}</p>
        <p><strong>اليوم:</strong> {showData.day}</p>
        <p><strong>نقطة كلمترية :</strong> {showData.nk}+{showData.mtr}m</p>
        <p><strong>الاتجاه:</strong> {showData.sens}</p>
          <p><strong>المركبة:</strong> {showData.matriculeA}</p>
          <p><strong>سبب الحادث:</strong> {showData.cause}</p>
          <p><strong>اضرار مادية:</strong> {showData.degat}</p>
          <p><strong>اضرار بدنية:</strong></p> <p>{showData.nbrmort} :موتى</p><p> {showData.nbrblesse}:جرحى</p>
          <p><strong>الشهر:</strong> {showData.months}</p>
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

export default ShowForm;
