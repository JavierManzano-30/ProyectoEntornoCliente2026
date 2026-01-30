import React from "react";

const reports = [
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
  {
    id: 4,
    name: "Informe de Proyectos",
    date: "15/01/2026",
    status: "Completado",
    type: "PDF",
  },
];

const ReportTable = () => (
  <div
    className="report-table"
    style={{
      background: "#fff",
      borderRadius: "1rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      padding: "1.5rem",
      marginTop: "1rem",
    }}
  >
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ background: "#f3f4f6" }}>
          <th style={{ textAlign: "left", padding: "0.7rem" }}>Nombre</th>
          <th style={{ textAlign: "left", padding: "0.7rem" }}>Fecha</th>
          <th style={{ textAlign: "left", padding: "0.7rem" }}>Estado</th>
          <th style={{ textAlign: "left", padding: "0.7rem" }}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {reports.map((report) => (
          <tr key={report.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
            <td style={{ padding: "0.7rem" }}>{report.name}</td>
            <td style={{ padding: "0.7rem" }}>{report.date}</td>
            <td
              style={{
                padding: "0.7rem",
                color: report.status === "Completado" ? "#10b981" : "#f59e42",
                fontWeight: 500,
              }}
            >
              {report.status}
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
                Exportar {report.type}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ReportTable;
