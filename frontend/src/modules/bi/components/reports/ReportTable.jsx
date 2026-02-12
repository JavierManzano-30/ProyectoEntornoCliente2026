import React from "react";

const ReportTable = ({ reports = [], onView, onExport }) => (
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
        {reports.map((report) => {
          const id = report.id || report.reportId;
          const name = report.nombre || report.name || "Informe";
          const date = report.ultimaEjecucion || report.date || "Sin ejecuciones";
          const status = report.estado || report.status || "pendiente";
          const type = report.formato || report.type || "CSV";

          return (
          <tr key={id} style={{ borderBottom: "1px solid #f3f4f6" }}>
            <td style={{ padding: "0.7rem" }}>{name}</td>
            <td style={{ padding: "0.7rem" }}>{date}</td>
            <td
              style={{
                padding: "0.7rem",
                color: status === "completado" || status === "Completado" ? "#10b981" : "#f59e42",
                fontWeight: 500,
              }}
            >
              {status}
            </td>
            <td style={{ padding: "0.7rem" }}>
              <button
                onClick={() => onView && onView(report)}
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
                onClick={() => onExport && onExport(id, type)}
                style={{
                  background: "#f3f4f6",
                  color: "#2563eb",
                  border: "none",
                  borderRadius: 6,
                  padding: "0.3rem 0.8rem",
                  cursor: "pointer",
                }}
              >
                Exportar {type}
              </button>
            </td>
          </tr>
          );
        })}
      </tbody>
    </table>
    {reports.length === 0 && (
      <div style={{ marginTop: "1rem", color: "#64748b" }}>
        No hay informes para mostrar.
      </div>
    )}
  </div>
);

export default ReportTable;
