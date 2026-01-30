import React from "react";
import ReportTable from "../components/reports/ReportTable";

const recentReports = [
  {
    id: 1,
    name: "Informe de Ventas Mensual",
    date: "28/01/2026",
    status: "Completado",
    type: "PDF",
  },
  {
    id: 2,
    name: "Análisis de Costes",
    date: "25/01/2026",
    status: "Completado",
    type: "Excel",
  },
  {
    id: 3,
    name: "Informe de Clientes",
    date: "20/01/2026",
    status: "Pendiente",
    type: "CSV",
  },
];

const cardStyle = {
  background: "#fff",
  borderRadius: "1rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  padding: "1.2rem 1.5rem",
  minWidth: 0,
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  marginBottom: "1rem",
};

const ReportsPage = () => (
  <div style={{ padding: "2rem" }}>
    <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
      Informes
    </h1>
    <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
      Consulta, ejecuta y exporta informes predefinidos o personalizados.
    </p>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "1.5rem",
        marginBottom: "2.5rem",
      }}
    >
      {recentReports.map((report) => (
        <div key={report.id} style={cardStyle}>
          <span
            style={{ color: "#6b7280", fontSize: "0.95rem", marginBottom: 4 }}
          >
            {report.name}
          </span>
          <span style={{ fontWeight: 500, fontSize: "1.1rem" }}>
            {report.date}
          </span>
          <span
            style={{
              color: report.status === "Completado" ? "#10b981" : "#f59e42",
              fontWeight: 500,
              fontSize: "0.95rem",
              margin: "6px 0",
            }}
          >
            {report.status}
          </span>
          <div style={{ marginTop: 8 }}>
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
              Exportar {report.type}
            </button>
          </div>
        </div>
      ))}
    </div>
    <ReportTable />
  </div>
);

export default ReportsPage;
