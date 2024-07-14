import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../JS/userSlice/userSlice';
import { useNavigate } from "react-router-dom";
import { Alert, Button, Form, Row } from 'react-bootstrap';
import './Signup.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Signup = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [register, setregister] = useState({})
  const dispatch = useDispatch();

  const handleRegister = async (e) => {
    e.preventDefault();
    dispatch(registerUser(register));
    setregister({
      name: "",
      lastName: "",
      email: "",
      password: "",
      phone: ""
    });
    toast.success('تم تحديث البيانات بنجاح!', {
      position: 'top-right',
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    setTimeout(function () {
      window.location.reload();
     }, 1000); 
  }
  return (
    <div className="signup-container">
      <p>
        انشاء حساب جديد
      </p>
      <form className="signup-form"><Form.Label className="form-label">الاسم:</Form.Label>
        <Form.Control
          className="form-control"
          autoComplete="fname"
          name="name"
          variant="outlined"
          required
          fullWidth
          id="firstName"
          label="Nom de la famille"
          autoFocus
          onChange={(e) => setregister({ ...register, name: e.target.value })}
        />
        <Form.Label className="form-label">اللقب:</Form.Label>
        <Form.Control
          className="form-control"
          variant="outlined"
          required
          fullWidth
          id="lastName"
          label="Prenom"
          name="lastName"
          autoComplete="lname"
          onChange={(e) => setregister({ ...register, lastName: e.target.value })}
        />
        <Form.Label className="form-label">بريد إلكتروني:</Form.Label>
        <Form.Control
          className="form-control"
          variant="outlined"
          required
          fullWidth
          id="email"
          label="Addresse email"
          name="email"
          autoComplete="email"
          onChange={(e) => setregister({ ...register, email: e.target.value })}
        />
        <Form.Label className="form-label">الهاتف:</Form.Label>
        <Form.Control
          className="form-control"
          variant="outlined"
          required
          fullWidth
          id="phone"
          label="Numero de telephone"
          name="phone"
          autoComplete="phone"
          onChange={(e) => setregister({ ...register, phone: e.target.value })}
        />
        <Form.Label className="form-label">كلمة السر:</Form.Label>
        <Form.Control
          className="form-control"
          variant="outlined"
          required
          fullWidth
          name="password"
          label="Mot de passe"
          type="password"
          id="password"
          autoComplete="current-password"
          onChange={(e) => setregister({ ...register, password: e.target.value })} />
        <Button
          fullWidth
          variant="primary"
          onClick={handleRegister}>
          تسجيل
        </Button>
      </form>
    </div>
  );
}
export default Signup;