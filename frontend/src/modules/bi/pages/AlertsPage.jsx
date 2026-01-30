import React from "react";

const alerts = [
  {
    id: 1,
    name: "Alerta de Ingresos",
    type: "KPI",
    status: "Activa",
    lastTrigger: "28/01/2026",
    level: "Crítica",
  },
  {
    id: 2,
    name: "Umbral de Costes",
    type: "Umbral",
    status: "Inactiva",
    lastTrigger: "15/01/2026",
    level: "Media",
  },
  {
    id: 3,
    name: "Alerta de Clientes",
    type: "KPI",
    status: "Activa",
    lastTrigger: "27/01/2026",
    level: "Alta",
  },
];

const AlertsPage = () => (
  <div style={{ padding: "2rem" }}>
    <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
      Alertas y Umbrales
    </h1>
    <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
      Configura alertas automáticas y umbrales para monitorizar KPIs y eventos
      clave.
    </p>
    <div
      style={{
        background: "#fff",
        borderRadius: "1rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        padding: "1.5rem",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f3f4f6" }}>
            <th style={{ textAlign: "left", padding: "0.7rem" }}>Nombre</th>
            <th style={{ textAlign: "left", padding: "0.7rem" }}>Tipo</th>
            <th style={{ textAlign: "left", padding: "0.7rem" }}>Estado</th>
            <th style={{ textAlign: "left", padding: "0.7rem" }}>
              Última activación
            </th>
            <th style={{ textAlign: "left", padding: "0.7rem" }}>Nivel</th>
            <th style={{ textAlign: "left", padding: "0.7rem" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => (
            <tr key={alert.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ padding: "0.7rem" }}>{alert.name}</td>
              <td style={{ padding: "0.7rem" }}>{alert.type}</td>
              <td
                style={{
                  padding: "0.7rem",
                  color: alert.status === "Activa" ? "#10b981" : "#ef4444",
                  fontWeight: 500,
                }}
              >
                {alert.status}
              </td>
              <td style={{ padding: "0.7rem" }}>{alert.lastTrigger}</td>
              <td
                style={{
                  padding: "0.7rem",
                  color:
                    alert.level === "Crítica"
                      ? "#ef4444"
                      : alert.level === "Alta"
                        ? "#f59e42"
                        : "#2563eb",
                  fontWeight: 500,
                }}
              >
                {alert.level}
              </td>
              <td style={{ padding: "0.7rem" }}>
                <button
                  style={{
                    marginRight: 8,
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "0.3rem 0.8rem",
                    cursor: "pointer",
                  }}
                >
                  Ver
                </button>
                <button
                  style={{
                    background: "#f3f4f6",
                    color: "#2563eb",
                    border: "none",
                    borderRadius: 6,
                    padding: "0.3rem 0.8rem",
                    cursor: "pointer",
                  }}
                >
                  Configurar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AlertsPage;
