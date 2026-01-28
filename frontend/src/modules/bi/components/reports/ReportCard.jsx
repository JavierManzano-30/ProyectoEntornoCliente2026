import React from "react";

const ReportCard = ({ nombre, descripcion, categoria, ultimaEjecucion }) => (
  <div
    style={{
      border: "1px solid #eee",
      borderRadius: 8,
      padding: 16,
      minWidth: 220,
    }}
  >
    <div style={{ fontWeight: 700 }}>{nombre}</div>
    <div style={{ color: "#888", fontSize: 13 }}>{descripcion}</div>
    <div style={{ fontSize: 12, marginTop: 8 }}>Categoría: {categoria}</div>
    <div style={{ fontSize: 12 }}>Última ejecución: {ultimaEjecucion}</div>
    <button style={{ marginTop: 8 }}>Ver</button>
  </div>
);

export default ReportCard;
