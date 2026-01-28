import React from "react";
import { useParams } from "react-router-dom";
import { useReport } from "../hooks/useReport";
import ReportVisualization from "../components/reports/ReportVisualization";
import BILayout from "../components/BILayout";

const ReportViewer = () => {
  const { id } = useParams();
  const { report, loading, error } = useReport(id);

  if (loading) return <div>Cargando informe...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!report) return null;

  return (
    <BILayout title={report.nombre}>
      <p>{report.descripcion}</p>
      <ReportVisualization report={report} />
      {/* Acciones: exportar, programar, compartir, etc. */}
    </BILayout>
  );
};

export default ReportViewer;
