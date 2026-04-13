import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { fetchForms, updateForm, uploadPhoto } from "../../JS/formSlice/FormSlice";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMediaQuery } from "react-responsive";
import { FaRegEdit } from "react-icons/fa";
import "./Update.css";
import uploadImg from "../../assets/cloud-upload-regular-240.png";

const Update = ({ rowData, dataId, onUpdate, userDistrict, userAutonum }) => {
  const userRedux = useSelector((state) => state.user.user);

  const [previewImages, setPreviewImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const [selectedNK, setSelectedNK] = useState(rowData.nk ?? 317);
  const [selectedCause, setSelectedCause] = useState(
    rowData.cause ?? "سرعة فائقة"
  );
  const [selectedVoie, setSelectedVoie] = useState(
    rowData.sens ?? ""
  );
  const [selectedHours, setSelectedHours] = useState(rowData.hours ?? 0);
  const [selectedMinutes, setSelectedMinutes] = useState(rowData.minutes ?? 0);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    matriculeA: rowData.matriculeA ?? "",
    degat: rowData.degat ?? "",
    sens: rowData.sens ?? "",
    nk: rowData.nk ?? "",
    mtr: rowData.mtr ?? "",
    nbrmort: rowData.nbrmort ?? "0",
    nbrblesse: rowData.nbrblesse ?? "0",
    cause: rowData.cause ?? "",
    ddate: rowData.ddate ?? "",
    day: rowData.day ?? "",
    months: rowData.months ?? "",
    years: rowData.years ?? "",
    hours: rowData.hours ?? "00",
    minutes: rowData.minutes ?? "00",
    createdBy: rowData.createdBy ?? "",
  });
  const newData = (e) => {
    const { name, value } = e.target;
    setUpdateData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    if (showModal) {
        setUpdateData({
            ...rowData,
            createdBy: userRedux?._id || rowData.createdBy
        });
        setSelectedNK(rowData.nk ?? 317);
        setSelectedCause(rowData.cause ?? "سرعة فائقة");
        setSelectedVoie(rowData.sens ?? "");
        setSelectedHours(rowData.hours ?? 0);
        setSelectedMinutes(rowData.minutes ?? 0);

        // Set existing images as previews
        if (rowData.image && Array.isArray(rowData.image)) {
          setPreviewImages(rowData.image);
        } else {
          setPreviewImages([]);
        }
    }
  }, [showModal, rowData, userRedux]);

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
          degat: "",
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

  const validateForm = () => {
    const newErrors = {};
    if (!updateData.a) newErrors.a = "لوحة منجمية إجبارية";
    if (!updateData.nk) newErrors.nk = "نقطة كلمترية إجبارية";
    if (!updateData.nbrmort) newErrors.nbrmort = "عدد الجرحى إجباري";
    if (!updateData.nbrblesse) newErrors.nbrblesse = "عدد الموتى إجباري";
    return newErrors;
  };

  const generateOptionsNK = (userDistrict, userAutonum, currentValue) => {
    let start, range;
    if (userAutonum === "a1") {
    switch (userDistrict) {
      case "oudhref":
        start = 317;
        range = 81;
        break;
      case "mahres":
        start = 230;
        range = 88;
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
        start = 0;
        range = 0;
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
        start = 0;
        range = 0;
    }
    } else if (userAutonum === "a4" && userDistrict === "bizerte") {
        start = 0;
        range = 50;
  } else {
    start = 0;
    range = 0;
  }

    const options = Array.from({ length: range }, (_, i) => {
      const value = start + i;
      return (
        <option key={value} value={value}>
          {value}
        </option>
      );
    });

    // Ensure currentValue is present
    if (currentValue !== undefined && currentValue !== null && !options.some(opt => opt.key == currentValue)) {
        options.unshift(<option key={currentValue} value={currentValue}>{currentValue}</option>);
    }

    return options;
  };

  const getSenseByDistrict = (userDistrict,userAutonum, currentValue) => {
          let options = [];
          if (userAutonum === "a1") {
    switch (userDistrict) {
      case "oudhref":
        options = [
          { value: "اتجاه قابس", label: "اتجاه قابس" },
          { value: "اتجاه صفاقس", label: "اتجاه صفاقس" },
        ];
        break;
      case "mahres":
        options = [
          { value: "اتجاه قابس", label: "اتجاه قابس" },
          { value: "اتجاه صفاقس", label: "اتجاه صفاقس" },
        ];
        break;
        case "jem":
        options = [
          { value: "اتجاه تونس", label: "اتجاه تونس" },
          { value: "اتجاه صفاقس", label: "اتجاه صفاقس" },
        ];
        break;
        case "hergla":
        options = [
          { value: "اتجاه تونس", label: "اتجاه تونس" },
          { value: "اتجاه صفاقس", label: "اتجاه صفاقس" },
        ];
        break;
        case "turki":
        options = [
          { value: "اتجاه تونس", label: "اتجاه تونس" },
          { value: "اتجاه سوسة", label: "اتجاه سوسة" },
        ];
        break;
    }
    } else if (userAutonum === "a3") {
       switch (userDistrict) {
      case "mdjazbab":
        options = [
          {value: "اتجاه تونس", label: "اتجاه تونس"},
          {value: "اتجاه باجة", label: "اتجاه باجة"},
        ];
        break;
      case "baja":
        options = [
          {value: "اتجاه تونس", label: "اتجاه تونس"},
          {value: "اتجاه باجة", label: "اتجاه باجة"},
        ];
        break;
    }
    } else if (userAutonum === "a4" && userDistrict === "bizerte") {
    options = [
          {value: "اتجاه تونس", label: "اتجاه تونس"},
          {value: "اتجاه باجة", label: "اتجاه باجة"},
        ];
  }
  
  // Ensure currentValue is present
  if (currentValue && !options.some(opt => opt.value === currentValue)) {
      options.unshift({ value: currentValue, label: currentValue });
  }
  
  return options;
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
                value={selectedHours}
                onChange={(e) => setSelectedHours(e.target.value)}
              >
                {generateOptions(24)}
              </Form.Select>
              :
              <Form.Select
                className="form-select"
                value={selectedMinutes}
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
                value={selectedNK}
                onChange={(e) => setSelectedNK(e.target.value)}
              >
                {generateOptionsNK(userRedux?.district, userRedux?.autonum, rowData.nk)}
              </Form.Select>
              +
              <Form.Control
                className="form-control"
                type="number"
                min="0"
                name="mtr"
                value={updateData.mtr}
                onChange={newData}
                required
              />
            </Row>

            {/* Direction */}
            <Row className="form-section">
              <label>الاتجاه</label>
              <Form.Select
                className="form-select"
                value={selectedVoie}
                onChange={(e) => setSelectedVoie(e.target.value)}
              >
                {getSenseByDistrict(userRedux?.district, userRedux?.autonum, rowData.sens).map((option) => (
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
                value={updateData.matriculeA}
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
                value={selectedCause}
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

            {/* Material Damage */}
            <Row className="form-row">
              <div className="form-label">:اضرار مادية</div>
              <Form.Control
                className="form-control"
                type="text"
                name="degat"
                placeholder="اضرار مادية"
                value={updateData.degat}
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
                value={updateData.nbrmort}
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
                value={updateData.nbrblesse}
                onChange={newData}
              />
              {errors.nbrblesse && (
                <p className="form-error">{errors.nbrblesse}</p>
              )}
            </Row>
          </Form.Group>

          {/* Photo Upload */}
          <Form.Group className="mb-3">
            <Form.Label>Images</Form.Label>
            <div className="d-flex align-items-center mb-2">
              <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-block' }}>
                <Button variant="outline-primary" style={{ pointerEvents: 'none' }}>
                  <img src={uploadImg} alt="upload" style={{ width: "24px", marginRight: "8px" }} />
                  Ajouter des photos
                </Button>
                <input
                  type="file"
                  multiple
                  onChange={async (e) => {
                    const files = Array.from(e.target.files);
                    if (!files.length) return;
                    const MAX_SIZE = 10 * 1024 * 1024;
                    const validFiles = files.filter(file => {
                      if (file.size > MAX_SIZE) {
                        toast.error(`Image ${file.name} trop volumineuse (max 10MB)`);
                        return false;
                      }
                      return true;
                    });
                    if (validFiles.length === 0) return;

                    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
                    setPreviewImages(prev => [...prev, ...newPreviews]);

                    setIsUploading(true);
                    const formDataUpload = new FormData();
                    for (let file of validFiles) {
                      formDataUpload.append("files", file);
                    }
                    try {
                      const resultAction = await dispatch(uploadPhoto(formDataUpload));
                      if (uploadPhoto.fulfilled.match(resultAction)) {
                        const uploadedPaths = resultAction.payload;
                        setUpdateData(prev => ({
                          ...prev,
                          image: [...(prev.image || []), ...uploadedPaths],
                        }));
                        toast.success("Images chargées !");
                      } else {
                        toast.error("Échec du chargement.");
                      }
                    } catch (error) {
                      console.error(error);
                      toast.error("Erreur technique.");
                    } finally {
                      setIsUploading(false);
                    }
                  }}
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
                    onClick={() => {
                      setPreviewImages(prev => prev.filter((_, i) => i !== idx));
                      setUpdateData(prev => ({
                        ...prev,
                        image: (prev.image || []).filter((_, i) => i !== idx),
                      }));
                    }}
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            الغاء العملية
          </Button>
          <Button
            variant="primary"
            disabled={isUploading}
            onClick={(e) => {
              handleUpdate(e);
            }}
          >
            {isUploading ? "جاري التحميل..." : "حفظ التغييرات"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Update;
