import React from "react";

const DatasetCard = ({ nombre, estado, ultimaActualizacion }) => (
  <div
    style={{
      border: "1px solid #eee",
      borderRadius: 8,
      padding: 16,
      minWidth: 220,
    }}
  >
    <div style={{ fontWeight: 700 }}>{nombre}</div>
    <div style={{ color: "#888", fontSize: 13 }}>Estado: {estado}</div>
    <div style={{ fontSize: 12, marginTop: 8 }}>
      Última actualización: {ultimaActualizacion}
    </div>
    <button style={{ marginTop: 8 }}>Ver</button>
  </div>
);

export default DatasetCard;
