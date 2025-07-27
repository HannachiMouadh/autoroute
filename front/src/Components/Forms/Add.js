import React, { useEffect, useRef, useState } from "react";
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
import axios from "axios";
import uploadImg from "../../assets/cloud-upload-regular-240.png";
import { uploadPhoto } from "../../JS/formSlice/FormSlice";
import { getAllUsers } from "../../JS/userSlice/userSlice";

const Add = ({ id }) => {
  const dispatch = useDispatch();
  const [selectedCause, setSelectedCause] = useState("سرعة فائقة");
  const [selectedVoie, setSelectedVoie] = useState("اتجاه قابس");
  const [show, setShow] = useState(false);
  const user = useSelector((state) => state.user.user);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [errors, setErrors] = useState({});
  const currentDate = new Date();
  const wrapperRef = useRef(null);
  const onDragEnter = () => wrapperRef.current.classList.add("dragover");
  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");
  const onDrop = () => wrapperRef.current.classList.remove("dragover");
  const [dateToday, setDateToday] = useState(moment().format("YYYY-MM-DD"));
const userAutonum = user?.autonum;
const userDistrict = user?.district;

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
  const getDefaultNK = (userDistrict) => {
    switch (userDistrict) {
      case "gabes":
        return 317;
      case "sfax":
        return 395;
      default:
        return 317;
    }
  };
  const [formData, setFormData] = useState({
    matriculeA: "",
    degat: "",
    sens: "",
    nk: getDefaultNK(user?.district),
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
    image: "",
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
    setFormData({ ...formData, createdBy: user?._id });
  }, [user]);

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
    if (!formData.matriculeA) newErrors.matriculeA = "لوحة منجمية إجبارية";
    if (!formData.nk) newErrors.nk = "نقطة كلمترية إجبارية";
    if (!formData.nbrmort) newErrors.nbrmort = "عدد الجرحى إجباري";
    if (!formData.nbrblesse) newErrors.nbrblesse = "عدد الموتى إجباري";
    if (!formData.degat) newErrors.degat = "الاضرار المادية اجبارية";
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

    dispatch(addForm(newData))
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
        setShow(false);
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
    dispatch(fetchForms());
  };
  const generateOptions = (range) => {
    return Array.from({ length: range }, (_, i) => (
      <option key={i} value={i}>
        {i < 10 ? `0${i}` : i}
      </option>
    ));
  };
  const generateOptionsNK = (userDistrict) => {
    let start, range;
    if (userAutonum === "a1") {
    switch (userDistrict) {
      case "oudhref":
        start = 317;
        range = 81;
        break;
      case "mahres":
        start = 317;
        range = 103;
        break;
      case "jem":
        start = 140;
        range = 80;
        break;
      case "hergla":
        start = 66;
        range = 64;
        break;
      case "turki":
        start = 0;
        range = 56;
        break;
      default:
        start = 317;
        range = 75;
    }
    } else if (userAutonum === "a3") {
        switch (userDistrict) {
      case "mdjazbab":
        start = 0;
        range = 55;
        break;
      case "baja":
        start = 0;
        range = 50;
        break;
      default:
        return [];
    }
    } else if (userAutonum === "a4" && userDistrict === "bizerte") {
        start = 0;
        range = 50;
  } else {
    return [];
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

  const getSenseByDistrict = (userDistrict,userAutonum) => {
          if (userAutonum === "a1") {
    switch (userDistrict) {
      case "oudhref":
        return [
          { value: "اتجاه قابس", label: "اتجاه قابس" },
          { value: "اتجاه صفاقس", label: "اتجاه صفاقس" },
        ];
      case "mahres":
        return [
          { value: "اتجاه قابس", label: "اتجاه قابس" },
          { value: "اتجاه صفاقس", label: "اتجاه صفاقس" },
        ];
        case "jem":
        return [
          { value: "اتجاه تونس", label: "اتجاه تونس" },
          { value: "اتجاه صفاقس", label: "اتجاه صفاقس" },
        ];
        case "hergla":
        return [
          { value: "اتجاه تونس", label: "اتجاه تونس" },
          { value: "اتجاه صفاقس", label: "اتجاه صفاقس" },
        ];
        case "turki":
        return [
          { value: "اتجاه تونس", label: "اتجاه تونس" },
          { value: "اتجاه سوسة", label: "اتجاه سوسة" },
        ];
      default:
        return [];
    }
    } else if (userAutonum === "a3") {
       switch (userDistrict) {
      case "mdjazbab":
        return [
          {value: "اتجاه تونس", label: "اتجاه تونس"},
          {value: "اتجاه باجة", label: "اتجاه باجة"},
        ];
      case "baja":
        return [
          {value: "اتجاه تونس", label: "اتجاه تونس"},
          {value: "اتجاه باجة", label: "اتجاه باجة"},
        ];
      default:
        return [];
    }
    } else if (userAutonum === "a4" && userDistrict === "baja") {
    return [
          {value: "اتجاه تونس", label: "اتجاه تونس"},
          {value: "اتجاه باجة", label: "اتجاه باجة"},
        ];
  } else {
    return [];
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
  console.log("userDistrict :",userDistrict);
  console.log("userAutonum :",userAutonum);
  
  

  const district = getSenseByDistrict(userDistrict,userAutonum);
  const isMobileView = useMediaQuery({ query: "(max-width: 760px)" });
  const [matriculeParts, setMatriculeParts] = useState(['']); // start with one input

  const placeholders = ['أ', 'ب', 'ج', 'د'];

  const updateFormData = (parts) => {
    const combined = parts.filter(Boolean).join(' |#|\n ');
    setFormData({ ...formData, matriculeA: combined });
  };

  const handleChange = (index, value) => {
    const updated = [...matriculeParts];
    updated[index] = value;
    setMatriculeParts(updated);
    updateFormData(updated);
  };

  const addInput = () => {
    if (matriculeParts.length < 4) {
      const updated = [...matriculeParts, ''];
      setMatriculeParts(updated);
      updateFormData(updated);
    }
  };

  const removeInput = (index) => {
    const updated = matriculeParts.filter((_, i) => i !== index);
    setMatriculeParts(updated);
    updateFormData(updated);
  };

  return (
    <div className="isMobile">
      <Button variant="primary" onClick={() => setShow(true)}>
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
                {generateOptionsNK(user.district)}
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
                {district.map((r) => (
                  <option value={r.value}>{r.label}</option>
                ))}
              </Form.Select>
            </Row>
 <Row className="form-section plate-section align-items-center">
        <label>لوحة المركبة</label>
      <Col xs={12} sm={8}>
        <Row>
          {matriculeParts.map((part, index) => (
            <Col key={index} xs="auto" className="mb-2 d-flex align-items-center">
              <Form.Control
                type="text"
                value={part}
                placeholder={placeholders[index]}
                onChange={(e) => handleChange(index, e.target.value)}
              />
              {index > 0 && (
                <Button
                  variant="danger"
                  size="sm"
                  className="ms-1"
                  onClick={() => removeInput(index)}
                >
                  −
                </Button>
              )}
                      
            </Col>
          ))}
          <Col style={{width:"3px"}}>
          {matriculeParts.length < 4 && (
          <Button variant="success" size="sm" onClick={addInput}>
            +
          </Button>
        )}
        </Col>
        </Row>
      </Col>
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
                name="degat"
                value={formData.degat}
                onChange={handleInputChange}
                required
              />
              {errors.degat && <p className="form-error">{errors.degat}</p>}
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
            <Form.Group controlId="imageUpload" className="mt-4">
              <Form.Label className="rtl-text">:صور الحادث</Form.Label>
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
                      onChange={(e) => uploadMultipleFiles(e.target.files)}
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
                      src={imgPath}
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
