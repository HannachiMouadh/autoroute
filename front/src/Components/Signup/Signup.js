import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../JS/userSlice/userSlice';
import { useNavigate } from "react-router-dom";
import { Alert, Button, Form, Row } from 'react-bootstrap';
import './Signup.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Signup = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [register, setRegister] = useState({})
  const dispatch = useDispatch();
  const userRedux = useSelector((state) => state.user.user);
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  

  const handleRegister = async (e) => {
    e.preventDefault();
    dispatch(registerUser(register));
    setRegister({
      name: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      region: ""
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
  useEffect(() => {
    if (userRedux?.isAdmin) {
      setRegister({ region: userRedux.region });
    }
  }, [userRedux]);
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
          onChange={(e) => setRegister({ ...register, name: e.target.value })}
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
          onChange={(e) => setRegister({ ...register, lastName: e.target.value })}
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
          onChange={(e) => setRegister({ ...register, email: e.target.value })}
        />
        <Form.Label className="form-label">District:</Form.Label>
        <Form.Select
          className="form-control"
          required
          id="region"
          name="region"
          value={register.region}
          onChange={(e) => setRegister({ ...register, region: e.target.value })}
        >
          <option value="" disabled>Select Region</option>
          <option value="sfax" disabled={userRedux?.isAdmin && userRedux.region !== 'sfax'}>
            Sfax
          </option>
          <option value="gabes" disabled={userRedux?.isAdmin && userRedux.region !== 'gabes'}>
            Gabes
          </option>
          <option value="sousse" disabled={userRedux?.isAdmin && userRedux.region !== 'sousse'}>
            Sousse
          </option>
          <option value="skhera" disabled={userRedux?.isAdmin && userRedux.region !== 'skhera'}>
            skhera
          </option>
        </Form.Select>
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
          onChange={(e) => setRegister({ ...register, phone: e.target.value })}
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
          onChange={(e) => setRegister({ ...register, password: e.target.value })} />
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