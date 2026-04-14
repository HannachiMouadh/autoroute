import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../JS/userSlice/userSlice";
import { useLocation, useNavigate } from "react-router-dom";
import "./Signin.css";
import logo from "../../assets/logo.png";

const Signin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [login, setLogin] = useState({
    matricule: "",
    password: "",
  });

  const [error, setError] = useState(location.state?.message || "");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!login.matricule || !login.password) {
      setError("Le matricule et le mot de passe sont obligatoires.");
      return;
    }

    try {
      const resultAction = await dispatch(loginUser(login));
      if (loginUser.fulfilled.match(resultAction)) {
        navigate("/");
        window.location.reload();
      } else {
        setError(resultAction.payload?.msg || "المعرف أو كلمة المرور غير صحيحة.");
      }
    } catch (error) {
      setError("المعرف أو كلمة المرور غير صحيحة.");
    }
  };

  return (
    <section className="vh-100 d-flex justify-content-center align-items-center login-section">
      <div className="login-container">
        <div className="header-container">
          <h1 className="title">Tunisie Autoroute</h1>
          <h2 className="subtitle">تسجيل الدخول</h2>
          <img src={logo} alt="Logo" className="logo" style={{ width: "120px", height: "auto" }} />
        </div>

        <form className="login-form">
          {error && <div className="alert alert-danger">{error}</div>}
          
          <div className="form-outline">
            <label className="form-label" htmlFor="matricule">Matricule</label>
            <input
              type="text"
              id="matricule"
              className="form-control"
              placeholder="votre matricule"
              required
              name="matricule"
              autoFocus
              onChange={(e) => setLogin({ ...login, matricule: e.target.value })}
            />
          </div>

          <div className="form-outline">
            <label className="form-label" htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="••••••••"
              required
              name="password"
              autoComplete="current-password"
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
            />
          </div>

          <div className="text-center mt-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleLogin}
            >
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Signin;
