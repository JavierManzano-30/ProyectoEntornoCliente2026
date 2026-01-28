import React from "react";

const ReportVisualization = ({ report }) => (
  <div
    style={{
      border: "1px solid #eee",
      borderRadius: 8,
      padding: 16,
      marginTop: 16,
    }}
  >
    {/* Aquí iría la visualización real del informe (gráficos, tablas, etc.) */}
    <pre>{JSON.stringify(report.data, null, 2)}</pre>
  </div>
);

export default ReportVisualization;
