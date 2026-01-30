import React from "react";

const inputStyle = {
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "0.75rem",
  padding: "0.65rem 1.1rem",
  fontSize: "1rem",
  color: "#111827",
  outline: "none",
  transition: "border 0.2s, box-shadow 0.2s",
  boxShadow: "0 1px 2px rgba(16,30,54,0.04)",
};

const inputFocusStyle = {
  border: "1.5px solid #2563eb",
  boxShadow: "0 0 0 2px #2563eb22",
};

const selectStyle = {
  ...inputStyle,
  minWidth: 140,
};

const filterContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "1.2rem",
  marginBottom: "1.7rem",
  background: "#fff",
  borderRadius: "1rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  padding: "1.1rem 1.5rem",
  flexWrap: "wrap",
};

const DashboardFilters = () => {
  const [focus, setFocus] = React.useState({
    desde: false,
    hasta: false,
    modulo: false,
  });
  return (
    <div style={filterContainerStyle}>
      <input
        type="date"
        style={focus.desde ? { ...inputStyle, ...inputFocusStyle } : inputStyle}
        placeholder="Desde"
        onFocus={() => setFocus((f) => ({ ...f, desde: true }))}
        onBlur={() => setFocus((f) => ({ ...f, desde: false }))}
      />
      <input
        type="date"
        style={focus.hasta ? { ...inputStyle, ...inputFocusStyle } : inputStyle}
        placeholder="Hasta"
        onFocus={() => setFocus((f) => ({ ...f, hasta: true }))}
        onBlur={() => setFocus((f) => ({ ...f, hasta: false }))}
      />
      <select
        style={
          focus.modulo ? { ...selectStyle, ...inputFocusStyle } : selectStyle
        }
        onFocus={() => setFocus((f) => ({ ...f, modulo: true }))}
        onBlur={() => setFocus((f) => ({ ...f, modulo: false }))}
      >
        <option>Módulo</option>
        <option>CRM</option>
        <option>RRHH</option>
        <option>Soporte</option>
        <option>ERP</option>
      </select>
    </div>
  );
};

export default DashboardFilters;
