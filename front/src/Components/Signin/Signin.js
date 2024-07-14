import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../JS/userSlice/userSlice";
import { useNavigate } from "react-router-dom";
import "./Signin.css";

const Signin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!login.email || !login.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      const resultAction = await dispatch(loginUser(login));
      if (loginUser.fulfilled.match(resultAction)) {
        navigate("/");
        window.location.reload();
      } else {
        setError("البريد الإلكتروني وكلمة المرور لا يتطابقان.");
      }
    } catch (error) {
      setError("البريد الإلكتروني وكلمة المرور لا يتطابقان.");
    }
  };

  return (
    <section className="vh-100 d-flex justify-content-center align-items-center login-section">
      <div className="login-container text-center">
        <form className="login-form text-center">
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="form-outline mb-4">
            <label className="form-label" htmlFor="form3Example3">Adresse email:</label>
            <input
              type="email"
              id="form3Example3"
              className="form-control"
              placeholder="Tapez votre email"
              required
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => setLogin({ ...login, email: e.target.value })}
            />
          </div>

          <div className="form-outline mb-4">
            <label className="form-label" htmlFor="form3Example4">Mot de passe:</label>
            <input
              type="password"
              id="form3Example4"
              className="form-control"
              placeholder="Tapez mot de pass"
              required
              name="password"
              autoComplete="current-password"
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
            />
          </div>

          <div className="text-center">
            <button
              type="button"
              className="btn btn-primary"
              style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Signin;
