import React from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/soporte", label: "Soporte" },
  { to: "/bi/dashboard", label: "BI" },
  // Puedes añadir más módulos aquí
];

const GlobalNavbar = () => {
  const location = useLocation();
  return (
    <nav
      style={{
        display: "flex",
        gap: 32,
        alignItems: "center",
        background: "#f5f7fa",
        borderBottom: "1px solid #e0e0e0",
        padding: "12px 32px",
        marginBottom: 0,
        zIndex: 100,
      }}
    >
      <span
        style={{
          fontWeight: 700,
          fontSize: 22,
          color: "#2a3b5d",
          marginRight: 40,
        }}
      >
        ERP Plataforma
      </span>
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          style={{
            color: location.pathname.startsWith(item.to)
              ? "#1976d2"
              : "#2a3b5d",
            textDecoration: "none",
            fontWeight: location.pathname.startsWith(item.to) ? 700 : 400,
            borderBottom: location.pathname.startsWith(item.to)
              ? "2px solid #1976d2"
              : "2px solid transparent",
            paddingBottom: 4,
          }}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default GlobalNavbar;
