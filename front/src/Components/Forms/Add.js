import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addForm, fetchForms } from "../../JS/formSlice/FormSlice";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import "./Add.css";
import { FaRegPlusSquare } from "react-icons/fa";
import moment from "moment";
import DatePicker from "react-datepicker";
import { Col, Row } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMediaQuery } from "react-responsive";
import { MdOutlineNoteAdd } from "react-icons/md";

const Add = ({ id, userRegion }) => {
  const dispatch = useDispatch();
  const [selectedCause, setSelectedCause] = useState("سرعة فائقة");
  const [selectedVoie, setSelectedVoie] = useState("اتجاه قابس");
  const [show, setShow] = useState(false);
  const userRedux = useSelector((state) => state.user.user);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [errors, setErrors] = useState({});
  const currentDate = new Date();
  const [dateToday, setDateToday] = useState(moment().format("YYYY-MM-DD"));
  const getFormattedDay = (day) => {
    switch (day) {
      case 0:
        return "الأحد";
      case 1:
        return "الأثنين";
      case 2:
        return "الثلاثاء";
      case 3:
        return "الأربعاء";
      case 4:
        return "الخميس";
      case 5:
        return "الجمعه";
      case 6:
        return "السبت";
      default:
        return "";
    }
  };

  const getFormattedMonth = (month) => {
    switch (month) {
      case 1:
        return "جانفي";
      case 2:
        return "فيفري";
      case 3:
        return "مارِس";
      case 4:
        return "أفريل";
      case 5:
        return "ماي";
      case 6:
        return "جُوان";
      case 7:
        return "جُويلية";
      case 8:
        return "أوت";
      case 9:
        return "سبتمبر";
      case 10:
        return "اكتوبر";
      case 11:
        return "نوفمبر";
      case 12:
        return "ديسمبر";
      default:
        return "";
    }
  };
  const getDefaultNK = (region) => {
    switch (region) {
      case "gabes":
        return 317;
      case "sfax":
        return 395;
      default:
        return 317;
    }
  };
  const [formData, setFormData] = useState({
    a: "",
    b: "",
    c: "",
    d: "",
    barrier: "",
    sens: "",
    nk: getDefaultNK(userRedux?.region),
    mtr: "0",
    nbrmort: "0",
    nbrblesse: "0",
    cause: "",
    ddate: moment(currentDate).format("YYYY-MM-DD"),
    day: getFormattedDay(currentDate.getDay()),
    months: getFormattedMonth(currentDate.getMonth() + 1),
    years: currentDate.getFullYear(),
    hours: "00",
    minutes: "00",
    createdBy: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    setFormData({ ...formData, createdBy: userRedux?._id });
  }, [userRedux]);

  const handleDateChange = (event) => {
    const date =
      event && event.target && event.target.value
        ? new Date(event.target.value)
        : new Date();
    console.log(date);
    var formattedmonth = date.getMonth() + 1;
    //console.log(formattedmonth);
    const years = date.getFullYear();
    var formattedDay = date.getDay();
    console.log(years);
    const formattedDate = moment(date).format("YYYY-MM-DD");
    console.log(formattedDate);
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
    setFormData({
      ...formData,
      ddate: formattedDate,
      day: formattedDay,
      months: formattedmonth,
      years: years,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.a) newErrors.a = "لوحة منجمية إجبارية";
    if (!formData.nk) newErrors.nk = "نقطة كلمترية إجبارية";
    if (!formData.nbrmort) newErrors.nbrmort = "عدد الجرحى إجباري";
    if (!formData.nbrblesse) newErrors.nbrblesse = "عدد الموتى إجباري";
    if (!formData.barrier) newErrors.barrier = "الاضرار المادية اجبارية";
    return newErrors;
  };

  const handleAddForm = (e) => {
    e.preventDefault();
    if (!formData.createdBy) {
      console.error("createdBy field is empty. Cannot submit form.");
      return;
    }
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("الرجاء ملئ كل الفراغات", {
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    setErrors({});
    const newData = {
      ...formData,
      cause: selectedCause,
      sens: selectedVoie,
      hours: formData.hours.toString().padStart(2, "0"),
      minutes: formData.minutes.toString().padStart(2, "0"),
    };

    dispatch(addForm(newData));
    dispatch(fetchForms());
    toast.success("تم تحديث البيانات بنجاح!", {
      position: "top-right",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    setShow(false);
  };
  const generateOptions = (range) => {
    return Array.from({ length: range }, (_, i) => (
      <option key={i} value={i}>
        {i < 10 ? `0${i}` : i}
      </option>
    ));
  };
  const generateOptionsNK = (region) => {
    let start, range;
    switch (region) {
      case "gabes":
        start = 317;
        range = 81;
        break;
      case "sfax":
        start = 387;
        range = 81;
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

  const region = getSenseByRegion(userRedux?.region);
  const isMobileView = useMediaQuery({ query: "(max-width: 760px)" });

  return (
    <div className="isMobile">
      <Button
        variant="primary"
        onClick={() => setShow(true)}
       
      >
        <MdOutlineNoteAdd />
      </Button>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>اضافة بيانات</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="accident">
            <Row className="form-section">
              <label>التاريخ</label>
              <Form.Control
                type="date"
                defaultValue={dateToday}
                max={dateToday}
                onChange={handleDateChange}
              />
            </Row>

            <Row className="form-section date-time-row">
              <label>التوقيت</label>
              <Form.Select
                value={formData.hours}
                onChange={(e) =>
                  setFormData({ ...formData, hours: e.target.value })
                }
              >
                {generateOptions(24)}
              </Form.Select>
              <Form.Select
                value={formData.minutes}
                onChange={(e) =>
                  setFormData({ ...formData, minutes: e.target.value })
                }
              >
                {generateOptions(60)}
              </Form.Select>
            </Row>

            <Row className="form-section km-row">
              <label>نقطة كلمترية</label>
              <Form.Select
                name="nk"
                value={formData.nk}
                onChange={handleInputChange}
              >
                {generateOptionsNK(userRedux.region)}
              </Form.Select>
              +
              <Form.Control
                type="number"
                min="0"
                name="mtr"
                value={formData.mtr}
                onChange={handleInputChange}
              />
            </Row>

            <Row className="form-section">
              <label>الاتجاه</label>
              <Form.Select
                className="direction-select"
                value={selectedVoie || ""}
                onChange={(e) => setSelectedVoie(e.target.value)}
              >
                {region.map((r) => (
                  <option value={r.value}>{r.label}</option>
                ))}
              </Form.Select>
            </Row>

            <Row className="form-section plate-section">
              <label>لوحة المركبة</label>
              <Form.Control
                type="text"
                name="a"
                placeholder="أ"
                value={formData.a}
                onChange={handleInputChange}
              />
              <Form.Control
                type="text"
                name="b"
                placeholder="ب"
                value={formData.b}
                onChange={handleInputChange}
              />
              <Form.Control
                type="text"
                name="c"
                placeholder="ج"
                value={formData.c}
                onChange={handleInputChange}
              />
              <Form.Control
                type="text"
                name="d"
                placeholder="د"
                value={formData.d}
                onChange={handleInputChange}
              />
            </Row>

            <Row className="form-row">
            <div className="form-label">:السبب</div>
              <Form.Select
                className="form-select"
                aria-label="سبب الحادث"
                value={selectedCause || ""}
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

            <Row className="form-row">
            <div className="form-label">:اضرار مادية</div>
              <Form.Control
                className="form-control"
                placeholder="اضرار مادية"
                type="text"
                name="barrier"
                value={formData.barrier}
                onChange={handleInputChange}
                required
              />
              {errors.barrier && <p className="form-error">{errors.barrier}</p>}
            </Row>

            <Row className="form-row">
            <div className="form-label">:عدد الموتى</div>
              <Form.Control
                className="form-control"
                type="number"
                min="0"
                value={formData.nbrmort}
                onChange={(e) =>
                  setFormData({ ...formData, nbrmort: e.target.value })
                }
                required
              />
              {errors.nbrmort && <p className="form-error">{errors.nbrmort}</p>}

            </Row>

            <Row className="form-row">
            <div className="form-label">:عدد الجرحى</div>
              <Form.Control
                className="form-control"
                type="number"
                min="0"
                value={formData.nbrblesse}
                onChange={(e) =>
                  setFormData({ ...formData, nbrblesse: e.target.value })
                }
                required
              />
              {errors.nbrblesse && (
                <p className="form-error">{errors.nbrblesse}</p>
              )}
              
            </Row>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            اغلاق
          </Button>
          <Button variant="primary" onClick={(e) => handleAddForm(e)}>
            حفظ التغييرات
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Add;
