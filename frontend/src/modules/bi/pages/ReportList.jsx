import React from "react";
import { useReports } from "../hooks/useReports";
import ReportCard from "../components/reports/ReportCard";
import BILayout from "../components/BILayout";

const ReportList = () => {
  const { reports, loading, error } = useReports();

  if (loading) return <div>Cargando informes...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <BILayout title="Catálogo de Informes">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {reports.map((report) => (
          <ReportCard key={report.id} {...report} />
        ))}
      </div>
    </BILayout>
  );
};

export default ReportList;
