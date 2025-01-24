import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addForm } from '../../JS/formSlice/FormSlice';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import './Add.css';
import { FaRegPlusSquare } from "react-icons/fa";
import moment from "moment";
import DatePicker from 'react-datepicker';
import { Col, Row } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Add = ({ id,userRegion }) => {
  const dispatch = useDispatch();
  const [selectedCause, setSelectedCause] = useState("سرعة فائقة");
  const [selectedVoie, setSelectedVoie] = useState("اتجاه قابس");
  const [show, setShow] = useState(false);
  const userRedux = useSelector((state) => state.user.user);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [errors, setErrors] = useState({});
  const currentDate = new Date();
  const [dateToday, setDateToday] = useState(moment().format("YYYY-MM-DD"))
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
      case 'gabes':
        return 317;
      case 'sfax':
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
    barrier: "0",
    sens: "",
    nk: getDefaultNK(userRedux?.region),
    mtr: "0",
    nbrmort: "",
    nbrblesse: "",
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
    setFormData({ ...formData, createdBy: userRedux?._id })
  }, [userRedux]);



  const handleDateChange = (event) => {
    const date = event && event.target && event.target.value ? new Date(event.target.value) : new Date();
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
      years: years
    });
  };


  // const [mata, setA] = useState('');
  // const [matb, setB] = useState('');
  // const [matc, setC] = useState('');
  // const [matd, setD] = useState('');
  // const [pkilo, setPk] = useState('317');
  // const [metre, setMtr] = useState('0');


  const validateForm = () => {
    const newErrors = {};
    if (!formData.a) newErrors.a = 'لوحة منجمية إجبارية';
    if (!formData.nk) newErrors.nk = 'نقطة كلمترية إجبارية';
    if (!formData.nbrmort) newErrors.nbrmort = 'عدد الجرحى إجباري';
    if (!formData.nbrblesse) newErrors.nbrblesse = 'عدد الموتى إجباري';
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
      toast.error('Please fill all required fields', {
        position: 'top-right',
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    setErrors({});
    const newData = {
      ...formData, cause: selectedCause, sens: selectedVoie, hours: formData.hours.toString().padStart(2, '0'),
      minutes: formData.minutes.toString().padStart(2, '0')
    };

    dispatch(addForm(newData));
    toast.success('تم تحديث البيانات بنجاح!', {
      position: 'top-right',
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    setShow(false);
    setTimeout(function () {
      window.location.reload();
    }, 800);

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
      case 'gabes':
        start = 317;
        range = 81;
        break;
      case 'sfax':
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
      case 'gabes':
        return [
          { value: 'اتجاه قابس', label: 'اتجاه قابس' },
          { value: 'اتجاه صفاقس', label: 'اتجاه صفاقس' },
        ];
      case 'sfax':
        return [
          { value: 'اتجاه تونس', label: 'اتجاه تونس' },
          { value: 'اتجاه صخيرة', label: 'اتجاه صخيرة' },
        ];
      default:
        return [];
    }
  };

  const region = getSenseByRegion(userRedux?.region);

  return (
    <div>
      <Button variant="primary" onClick={() => setShow(true)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-plus" viewBox="0 0 16 16">
  <path d="M8 6.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 .5-.5"/>
  <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z"/>
</svg></Button>
      {/* Modal */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>اضافة بيانات</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="accident">
            <Row>
              <Col>
                <Form.Control
                  style={{ width: '150px' }}
                  type="text"
                  placeholder='أ'
                  name="a"
                  value={formData.a}
                  onChange={handleInputChange}
                  required
                />
                {errors.a && <p style={{ color: 'red' }}>{errors.a}</p>}
                <Form.Control
                  style={{ width: '150px' }}
                  type="text"
                  placeholder='ب'
                  name="b"
                  value={formData.b}
                  onChange={handleInputChange}
                  required
                />
              </Col>
              <Col>
                <Form.Control
                  style={{ width: '150px' }}
                  type="text"
                  placeholder='ج'
                  name="c"
                  value={formData.c}
                  onChange={handleInputChange}
                  required
                />
                <Form.Control
                  style={{ width: '150px' }}
                  type="text"
                  placeholder='د'
                  name="d"
                  value={formData.d}
                  onChange={handleInputChange}
                  required
                />
              </Col>
              :لوحة منجمية
            </Row>
            <Row>
              <Form.Control
                style={{ width: '350px' }}
                type="number"
                min="0"
                name="barrier"
                value={formData.barrier}
                onChange={handleInputChange}
                required
              />
              :زلاقات
            </Row>
            <Row>
              <Form.Control
                style={{ width: '194px', height: "30px" }}
                type="number"
                min="0"
                name="mtr"
                value={formData.mtr}
                onChange={handleInputChange}
                required
              />
              :البعد بالمتر
              <Form.Select
                style={{ width: '80px' }}
                name="nk"
                value={formData.nk}
                onChange={handleInputChange}
              >
                {userRedux && userRedux.region ? generateOptionsNK(userRedux.region) : null}
              </Form.Select>
              :نقطة كلمترية
            </Row>
            <Row>
              <Form.Select style={{ width: '350px' }} aria-label="Default select example"
                value={selectedVoie || ''}
                onChange={(e) => setSelectedVoie(e.target.value)}
              >
                {Array.isArray(region) && region.length > 0 ? (region.map((option) => (
                  <option value={option.value}>
                    {option.label}
                  </option>
                  ))
                ) : (
                  <option disabled>لا توجد خيارات متاحة</option>
                )}
              </Form.Select>
              :الاتجاه
            </Row>
            <Row>
              <Form.Control
                style={{ width: '350px' }}
                type="number"
                min="0"
                value={formData.nbrmort}
                onChange={(e) => setFormData({ ...formData, nbrmort: e.target.value })}
                required
              />
              {errors.nbrmort && <p style={{ color: 'red' }}>{errors.nbrmort}</p>}
              :عدد الجرحى
            </Row>
            <Row>
              <Form.Control
                style={{ width: '350px' }}
                type="number"
                min="0"
                value={formData.nbrblesse}
                onChange={(e) => setFormData({ ...formData, nbrblesse: e.target.value })}
                required
              />
              {errors.nbrblesse && <p style={{ color: 'red' }}>{errors.nbrblesse}</p>}
              :عدد الموتى
            </Row>
            <Row>
              <Form.Select
                style={{ width: '350px' }}
                aria-label="Default select example"
                value={selectedCause || ''}
                onChange={(e) => setSelectedCause(e.target.value)}
              >
                <option value="سرعة فائقة">سرعة فائقة</option>
                <option value="انشطار اطار العجلة">انشطار اطار العجلة</option>
                <option value="نعاس">نعاس</option>
                <option value="مجاوزة فجئية">مجاوزة فجئية</option>
                <option value="سياقة في حالة سكر">سياقة في حالة سكر</option>
                <option value="طريق مبلل">طريق مبلل</option>
                <option value="عدم انتباه">عدم انتباه</option>
                <option value="وجود حفرة وسط الطريق">وجود حفرة وسط الطريق</option>
                <option value="انقلاب الشاحنة">انقلاب الشاحنة</option>
                <option value="حيوان على الطريق السيارة">حيوان على الطريق السيارة</option>
                <option value="مترجل على الطريق السيارة">مترجل على الطريق السيارة</option>
                <option value="الدوران في الإتجاه المعاكس">الدوران في الإتجاه المعاكس</option>
                <option value="الخروج من فتحة عشوائية">الخروج من فتحة عشوائية</option>
                <option value="اصطدام سيارة باخرى رابظة على طرف الطريق">اصطدام سيارة باخرى رابظة على طرف الطريق</option>
                <option value="عطب مكانيكي/ عطب كهربائي">عطب مكانيكي/ عطب كهربائي</option>
                <option value="مضايقة من الخلف">مضايقة من الخلف</option>
                <option value="اصطدام السيارة بالدراجة النارية">اصطدام السيارة بالدراجة النارية</option>
                <option value="وجود عجلة او بقايا عجلة على الطريق">وجود عجلة او بقايا عجلة على الطريق</option>
                <option value="سقوط قرط على الطريق">سقوط قرط على الطريق</option>
                <option value="اصطدام سيارتان او اكثر">اصطدام سيارتان او اكثر</option>
                <option value="عدم التحكم في السيارة">عدم التحكم في السيارة</option>
                <option value="السياقة تحت تأثير التعب و الإرهاق">السياقة تحت تأثير التعب و الإرهاق</option>
              </Form.Select>
              :السبب
            </Row>
            <Row>
              <Form.Control
                type='date'
                style={{ width: '350px' }}
                defaultValue={dateToday}
                max={dateToday}
                onChange={handleDateChange}
                format="YYYY-MM-DD"
              />
              :التاريخ
            </Row>
            <Row>
              <Form.Select
                style={{ width: '80px' }}
                aria-label="Select hours"
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              >
                {generateOptions(24)}
              </Form.Select>:
              <Form.Select
                style={{ width: '80px' }}
                aria-label="Select minutes"
                value={formData.minutes}
                onChange={(e) => setFormData({ ...formData, minutes: e.target.value })}
              >
                {generateOptions(60)}
              </Form.Select>
              :التوقيت
            </Row>
            {/* Other input fields... */}
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
    </div >
  );
};

export default Add;

