import React from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/bi/dashboard", label: "Dashboard Global" },
  { to: "/bi/informes", label: "Informes" },
  { to: "/bi/datasets", label: "Datasets" },
  { to: "/bi/alertas", label: "Alertas" },
];

const BINavbar = () => {
  const location = useLocation();
  return (
    <nav
      style={{
        display: "flex",
        gap: 24,
        alignItems: "center",
        background: "#f5f7fa",
        borderBottom: "1px solid #e0e0e0",
        padding: "12px 32px",
        marginBottom: 24,
      }}
    >
      <span
        style={{
          fontWeight: 700,
          fontSize: 20,
          color: "#2a3b5d",
          marginRight: 32,
        }}
      >
        BI
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

export default BINavbar;
