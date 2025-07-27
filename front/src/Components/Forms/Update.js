import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { fetchForms, updateForm } from "../../JS/formSlice/FormSlice";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit } from "react-icons/fi";
import { months } from "moment";
import DatePicker from "react-datepicker";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMediaQuery } from "react-responsive";
import { FaRegEdit } from "react-icons/fa";
import "./Update.css";

const Update = ({ rowData, dataId, onUpdate }) => {
  const [selectedNK, setSelectedNK] = useState(rowData.nk || 317);
  const [selectedCause, setSelectedCause] = useState(
    rowData.cause || "سرعة فائقة"
  );
  const [selectedVoie, setSelectedVoie] = useState(
    rowData.sens || "اتجاه قابس"
  );
  const [selectedHours, setSelectedHours] = useState(rowData.hours || 0);
  const [selectedMinutes, setSelectedMinutes] = useState(rowData.minutes || 0);
  const userRedux = useSelector((state) => state.user.user);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    matriculeA: rowData.matriculeA || "",
    barrier: rowData.barrier || "",
    sens: rowData.sens || "",
    nk: rowData.nk || "",
    mtr: rowData.mtr || "",
    nbrmort: rowData.nbrmort || "",
    nbrblesse: rowData.nbrblesse || "",
    cause: rowData.cause || "",
    ddate: rowData.ddate || "",
    day: rowData.day || "",
    months: rowData.months || "",
    years: rowData.years || "",
    hours: rowData.hours || "",
    minutes: rowData.minutes || "",
    createdBy: rowData.createdBy || "",
  });
  const newData = (e) => {
    const { name, value } = e.target;
    setUpdateData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    setUpdateData({ ...updateData, createdBy: userRedux?._id });
  }, [userRedux]);

  const handleDateChange = (e) => {
    const date = new Date(e.target.value);
    if (isNaN(date.getTime())) {
      // Handle invalid date input if necessary
      return;
    }
    var formattedmonth = date.getMonth() + 1;
    const years = date.getFullYear();
    var formattedDay = date.getDay();
    console.log(formattedDay);
    const formattedDate = moment(date).format("MM/DD/YYYY");
    console.log(formattedmonth);
    switch (formattedmonth) {
      case 1:
        formattedmonth = "جانفي";
        break;
      case 2:
        formattedmonth = "فيفري";
        break;
      case 3:
        formattedmonth = "مارِس";
        break;
      case 4:
        formattedmonth = "أفريل";
        break;
      case 5:
        formattedmonth = "ماي";
        break;
      case 6:
        formattedmonth = "جُوان";
        break;
      case 7:
        formattedmonth = "جُويلية";
        break;
      case 8:
        formattedmonth = "أوت";
        break;
      case 9:
        formattedmonth = "سبتمبر";
        break;
      case 10:
        formattedmonth = "اكتوبر";
        break;
      case 11:
        formattedmonth = "نوفمبر";
        break;
      case 12:
        formattedmonth = "ديسمبر";
        break;
      default:
        formattedmonth = "";
    }
    switch (formattedDay) {
      case 0:
        formattedDay = "الأحد";
        break;
      case 1:
        formattedDay = "الأثنين";
        break;
      case 2:
        formattedDay = "الثلاثاء";
        break;
      case 3:
        formattedDay = "الأربعاء";
        break;
      case 4:
        formattedDay = "الخميس";
        break;
      case 5:
        formattedDay = "الجمعه";
        break;
      case 6:
        formattedDay = "السبت";
        break;
      default:
        formattedDay = "";
    }
    setUpdateData({
      ...updateData,
      ddate: e.target.value,
      day: formattedDay,
      months: formattedmonth,
      years: years,
    });
  };

  const dispatch = useDispatch();

  const handleUpdate = (e) => {
    e.preventDefault();

    const newData = {
      ...updateData,
      nk: selectedNK,
      cause: selectedCause,
      sens: selectedVoie,
      hours: selectedHours.toString().padStart(2, "0"),
      minutes: selectedMinutes.toString().padStart(2, "0"),
    };

    // Log data to verify it's correct
    console.log("Data to update:", newData);
    console.log("Data ID:", dataId);

    dispatch(updateForm({ id: dataId, data: newData }))
      .then((response) => {
        console.log("Update response:", response);
        if (response.error) {
          throw new Error(response.error.message);
        }
        toast.success("تم تحديث البيانات بنجاح!", {
          position: "top-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setShowModal(false);
        setUpdateData({
          matriculeA: "",
          barrier: "",
          sens: "",
          nk: "",
          mtr: "",
          nbrmort: "",
          nbrblesse: "",
          cause: "",
          ddate: "",
          day: "",
          months: "",
          years: "",
          hours: "",
          minutes: "",
        });
        dispatch(fetchForms());
      })
      .catch((error) => {
        console.error("Update failed:", error);
        toast.error("فشل تحديث البيانات. يرجى المحاولة مرة أخرى.", {
          position: "top-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
  };

  const generateOptions = (range) => {
    return Array.from({ length: range }, (_, i) => (
      <option key={i} value={i}>
        {i < 10 ? `0${i}` : i}
      </option>
    ));
  };
  const generateOptionss = (range) => {
    return Array.from({ length: range }, (_, i) => {
      const value = i + 317;
      return (
        <option key={value} value={value}>
          {value < 10 ? `0${value}` : value}
        </option>
      );
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!updateData.a) newErrors.a = "لوحة منجمية إجبارية";
    if (!updateData.nk) newErrors.nk = "نقطة كلمترية إجبارية";
    if (!updateData.nbrmort) newErrors.nbrmort = "عدد الجرحى إجباري";
    if (!updateData.nbrblesse) newErrors.nbrblesse = "عدد الموتى إجباري";
    return newErrors;
  };

  const generateOptionsNK = (region) => {
    let start, range;
    switch (region) {
      case "gabes":
        start = 317;
        range = 75;
        break;
      case "sfax":
        start = 395;
        range = 75;
        break;
      default:
        start = 317;
        range = 75;
    }

    return Array.from({ length: range }, (_, i) => {
      const value = start + i;
      return (
        <option key={value} value={value}>
          {value}
        </option>
      );
    });
  };

  const getSenseByRegion = (region) => {
    switch (region) {
      case "gabes":
        return [
          { value: "اتجاه قابس", label: "اتجاه قابس" },
          { value: "اتجاه صفاقس", label: "اتجاه صفاقس" },
        ];
      case "sfax":
        return [
          { value: "اتجاه تونس", label: "اتجاه تونس" },
          { value: "اتجاه صخيرة", label: "اتجاه صخيرة" },
        ];
      default:
        return [];
    }
  };

  const isMobileView = useMediaQuery({ query: "(max-width: 1000px)" });
  return (
    <>
      <Button variant="info" onClick={() => setShowModal(true)}>
        <FaRegEdit />
      </Button>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>تحديث البيانات</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="accident">
            <Row className="form-section">
              <label>التاريخ</label>
              <Form.Control
                className="form-control"
                type="date"
                selected={updateData.ddate ? new Date(updateData.ddate) : null}
                value={updateData.ddate}
                onChange={handleDateChange}
              />
            </Row>

            {/* Time */}
            <Row className="form-section date-time-row">
              <label>التوقيت</label>{" "}
              <Form.Select
                className="form-select"
                value={selectedHours || rowData.hours}
                onChange={(e) => setSelectedHours(e.target.value)}
              >
                {generateOptions(24)}
              </Form.Select>
              :
              <Form.Select
                className="form-section km-row"
                value={selectedMinutes || rowData.minutes}
                onChange={(e) => setSelectedMinutes(e.target.value)}
              >
                {generateOptions(60)}
              </Form.Select>
            </Row>

            {/* NK + Meter */}
            <Row className="form-section km-row">
              <label>نقطة كلمترية</label>
              <Form.Select
                className="form-section plate-section"
                name="nk"
                value={updateData.nk || rowData.nk}
                onChange={newData}
              >
                {userRedux && userRedux.region
                  ? generateOptionsNK(userRedux.region)
                  : null}
              </Form.Select>
              +
              <Form.Control
                className="form-control"
                type="number"
                min="0"
                name="mtr"
                value={updateData.mtr || rowData.mtr}
                onChange={newData}
                required
              />
            </Row>

            {/* Direction */}
            <Row className="form-section">
              <label>الاتجاه</label>
              <Form.Select
                className="form-select"
                value={selectedVoie || rowData.sens}
                onChange={(e) => setSelectedVoie(e.target.value)}
              >
                {getSenseByRegion(userRedux?.region).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Row>

            {/* Plate numbers */}
            <Row className="form-section plate-section">
              <label>لوحة المركبة</label>
              <Form.Control
                className="form-control"
                type="text"
                placeholder="أ"
                name="matriculeA"
                value={updateData.matriculeA || rowData.matriculeA}
                onChange={newData}
                required
              />
              {errors.a && <p className="form-error">{errors.a}</p>}
            </Row>

            {/* Cause of Accident */}
            <Row className="form-row">
              <span className="form-label">:السبب</span>
              <Form.Select
                className="form-select"
                value={selectedCause || rowData.cause}
                onChange={(e) => setSelectedCause(e.target.value)}
              >
                <option value="">اختر السبب</option>
                <option value="سرعة فائقة">سرعة فائقة</option>
                <option value="انشطار اطار العجلة">انشطار اطار العجلة</option>
                <option value="نعاس">نعاس</option>
                <option value="مجاوزة فجئية">مجاوزة فجئية</option>
                <option value="سياقة في حالة سكر">سياقة في حالة سكر</option>
                <option value="طريق مبلل">طريق مبلل</option>
                <option value="عدم انتباه">عدم انتباه</option>
                <option value="وجود حفرة وسط الطريق">
                  وجود حفرة وسط الطريق
                </option>
                <option value="انقلاب الشاحنة">انقلاب الشاحنة</option>
                <option value="حيوان على الطريق السيارة">
                  حيوان على الطريق السيارة
                </option>
                <option value="مترجل على الطريق السيارة">
                  مترجل على الطريق السيارة
                </option>
                <option value="الدوران في الإتجاه المعاكس">
                  الدوران في الإتجاه المعاكس
                </option>
                <option value="الخروج من فتحة عشوائية">
                  الخروج من فتحة عشوائية
                </option>
                <option value="اصطدام سيارة باخرى رابظة على طرف الطريق">
                  اصطدام سيارة باخرى رابظة على طرف الطريق
                </option>
                <option value="عطب مكانيكي/ عطب كهربائي">
                  عطب مكانيكي/ عطب كهربائي
                </option>
                <option value="مضايقة من الخلف">مضايقة من الخلف</option>
                <option value="اصطدام السيارة بالدراجة النارية">
                  اصطدام السيارة بالدراجة النارية
                </option>
                <option value="وجود عجلة او بقايا عجلة على الطريق">
                  وجود عجلة او بقايا عجلة على الطريق
                </option>
                <option value="سقوط قرط على الطريق">سقوط قرط على الطريق</option>
                <option value="اصطدام سيارتان او اكثر">
                  اصطدام سيارتان او اكثر
                </option>
                <option value="عدم التحكم في السيارة">
                  عدم التحكم في السيارة
                </option>
                <option value="السياقة تحت تأثير التعب و الإرهاق">
                  السياقة تحت تأثير التعب و الإرهاق
                </option>
              </Form.Select>
            </Row>

            {/* Barrier Damage */}
            <Row className="form-row">
              <div className="form-label">:اضرار مادية</div>
              <Form.Control
                className="form-control"
                type="text"
                name="barrier"
                placeholder="اضرار مادية"
                value={updateData.barrier || rowData.barrier}
                onChange={newData}
              />
            </Row>

            {/* Death Count */}
            <Row className="form-row">
              <div className="form-label">:عدد الموتى</div>
              <Form.Control
                className="form-control"
                type="number"
                name="nbrmort"
                min="0"
                placeholder="nombre de mort"
                value={updateData.nbrmort || rowData.nbrmort}
                onChange={newData}
              />
              {errors.nbrmort && <p className="form-error">{errors.nbrmort}</p>}
            </Row>

            {/* Injured Count */}
            <Row className="form-row">
              <span className="form-label">:عدد الجرحى</span>
              <Form.Control
                className="form-control"
                type="number"
                name="nbrblesse"
                min="0"
                placeholder="nombre des blessé"
                value={updateData.nbrblesse || rowData.nbrblesse}
                onChange={newData}
              />
              {errors.nbrblesse && (
                <p className="form-error">{errors.nbrblesse}</p>
              )}
            </Row>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            الغاء العملية
          </Button>
          <Button
            variant="primary"
            onClick={(e) => {
              handleUpdate(e);
            }}
          >
            حفظ التغييرات
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Update;
