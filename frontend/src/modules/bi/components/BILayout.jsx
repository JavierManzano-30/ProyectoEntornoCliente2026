import React from "react";
import GlobalNavbar from "../../../components/common/GlobalNavbar";
import "./BILayout.css";

const BILayout = ({ children, title }) => {
  return (
    <>
      <GlobalNavbar />
      <div className="bi-layout">
        <aside className="bi-sidebar">
          <div className="sidebar-header">
            <h1 className="sidebar-logo">BI</h1>
            <p className="sidebar-subtitle">Business Intelligence</p>
          </div>
          <nav className="sidebar-nav">
            <a href="/bi/dashboard" className="nav-link">
              Dashboard
            </a>
            <a href="/bi/informes" className="nav-link">
              Informes
            </a>
            <a href="/bi/datasets" className="nav-link">
              Datasets
            </a>
            <a href="/bi/alertas" className="nav-link">
              Alertas
            </a>
          </nav>
        </aside>
        <div className="bi-content">
          <header className="bi-header">
            <h2 className="header-title">{title || "Módulo BI"}</h2>
          </header>
          <main className="bi-body">{children}</main>
        </div>
      </div>
    </>
  );
};

export default BILayout;
