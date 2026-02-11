import React from 'react';
import './Landing.css';
// Logo se referencia directamente en el src

const Landing = () => {
  return (
    <div className="landing-bg">
      <div className="landing-logo-bar">
        <img src="/images/synera-logo.png" alt="SYNERA Logo" className="landing-logo" />
        <span className="landing-brand">SYNERA</span>
      </div>
      <div className="landing-center-box">
        <h1>Bienvenido a SYNERA</h1>
        <hr className="landing-divider" />
        <p>Gestión integral para tu empresa, todo en un solo lugar.</p>
        <a href="/login" className="landing-btn">Iniciar Sesión</a>
        <hr className="landing-divider" />
        <div className="landing-links">
          <span>¿Olvidaste tu contraseña? <button className="landing-link-btn" type="button">Haz clic aquí</button></span>
          <span>¿No tienes cuenta? <button className="landing-link-btn" type="button">Regístrate aquí</button></span>
        </div>
      </div>
    </div>
  );
};

export default Landing;
