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
    <section className="auth-shell">
      <div className="auth-orb auth-orb-a" aria-hidden="true" />
      <div className="auth-orb auth-orb-b" aria-hidden="true" />

      <div className="auth-panel">
        <aside className="auth-brand">
          <img src={logo} alt="Logo Tunisie Autoroute" className="auth-logo" />
          <p className="auth-kicker">Plateforme Securite</p>
          <h1 className="auth-title">Tunisie Autoroute</h1>
          <p className="auth-description">
            Tableau de bord premium pour le suivi des accidents, entretiens et patrouilles.
          </p>
        </aside>

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="auth-headline-wrap">
            <h2 className="auth-headline">Bienvenue</h2>
            <p className="auth-subtitle">تسجيل الدخول</p>
          </div>

          {error && <div className="auth-alert">{error}</div>}

          <div className="auth-field">
            <label className="auth-label" htmlFor="matricule">Matricule</label>
            <input
              type="text"
              id="matricule"
              className="auth-input"
              placeholder="Votre matricule"
              required
              name="matricule"
              autoFocus
              onChange={(e) => setLogin({ ...login, matricule: e.target.value })}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              className="auth-input"
              placeholder="••••••••"
              required
              name="password"
              autoComplete="current-password"
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
            />
          </div>

          <button type="submit" className="auth-button">
            Se connecter
          </button>
        </form>
      </div>
    </section>
  );
};

export default Signin;
