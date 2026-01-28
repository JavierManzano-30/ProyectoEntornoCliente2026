import React from "react";

const AlertCard = ({ nombre, prioridad, activa }) => (
  <div
    style={{
      border: "1px solid #eee",
      borderRadius: 8,
      padding: 16,
      minWidth: 220,
    }}
  >
    <div style={{ fontWeight: 700 }}>{nombre}</div>
    <div style={{ color: "#888", fontSize: 13 }}>Prioridad: {prioridad}</div>
    <div style={{ fontSize: 12, marginTop: 8 }}>
      Estado: {activa ? "Activa" : "Inactiva"}
    </div>
    <button style={{ marginTop: 8 }}>{activa ? "Pausar" : "Activar"}</button>
  </div>
);

export default AlertCard;
