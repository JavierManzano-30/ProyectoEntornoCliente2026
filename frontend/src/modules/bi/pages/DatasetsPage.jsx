import React from "react";

const datasets = [
  {
    id: 1,
    name: "Ventas 2025",
    status: "Activo",
    lastUpdate: "28/01/2026",
    source: "ERP",
    refresh: "Diario",
  },
  {
    id: 2,
    name: "Clientes",
    status: "Activo",
    lastUpdate: "27/01/2026",
    source: "CRM",
    refresh: "Semanal",
  },
  {
    id: 3,
    name: "Proyectos",
    status: "Inactivo",
    lastUpdate: "15/01/2026",
    source: "Proyectos",
    refresh: "Manual",
  },
];

const DatasetsPage = () => (
  <div style={{ padding: "2rem" }}>
    <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
      Datasets
    </h1>
    <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
      Gestiona las fuentes de datos, refrescos y calidad de los datasets
      utilizados en BI.
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
            <th style={{ textAlign: "left", padding: "0.7rem" }}>Estado</th>
            <th style={{ textAlign: "left", padding: "0.7rem" }}>
              Última actualización
            </th>
            <th style={{ textAlign: "left", padding: "0.7rem" }}>Fuente</th>
            <th style={{ textAlign: "left", padding: "0.7rem" }}>Refresco</th>
            <th style={{ textAlign: "left", padding: "0.7rem" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datasets.map((ds) => (
            <tr key={ds.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ padding: "0.7rem" }}>{ds.name}</td>
              <td
                style={{
                  padding: "0.7rem",
                  color: ds.status === "Activo" ? "#10b981" : "#ef4444",
                  fontWeight: 500,
                }}
              >
                {ds.status}
              </td>
              <td style={{ padding: "0.7rem" }}>{ds.lastUpdate}</td>
              <td style={{ padding: "0.7rem" }}>{ds.source}</td>
              <td style={{ padding: "0.7rem" }}>{ds.refresh}</td>
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
                  Refrescar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default DatasetsPage;
