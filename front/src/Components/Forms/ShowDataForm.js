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
    a: ShowRowData.a || "",
    b: ShowRowData.b || "",
    c: ShowRowData.c || "",
    d: ShowRowData.d || "",
    barrier: ShowRowData.barrier || "",
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
          <p><strong>المركبة أ:</strong> {showData.a}</p>
          <p><strong>المركبة ب:</strong> {showData.b}</p>
          <p><strong>المركبة ج:</strong> {showData.c}</p>
          <p><strong>المركبة د:</strong> {showData.d}</p>
          <p><strong>الحواجز المتضررة:</strong> {showData.barrier}</p>
          <p><strong>الاتجاه:</strong> {showData.sens}</p>
          <p><strong>الكم القريب (nk):</strong> {showData.nk}</p>
          <p><strong>المسافة إلى الكم (متر):</strong> {showData.mtr}</p>
          <p><strong>عدد الوفيات:</strong> {showData.nbrmort}</p>
          <p><strong>عدد المصابين:</strong> {showData.nbrblesse}</p>
          <p><strong>سبب الحادث:</strong> {showData.cause}</p>
          <p><strong>التاريخ:</strong> {showData.ddate}</p>
          <p><strong>اليوم:</strong> {showData.day}</p>
          <p><strong>الشهر:</strong> {showData.months}</p>
          <p><strong>السنة:</strong> {showData.years}</p>
          <p><strong>الوقت:</strong> {showData.hours}:{showData.minutes}</p>
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
