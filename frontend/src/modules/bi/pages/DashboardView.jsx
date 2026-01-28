import React from "react";
import { useDashboard } from "../hooks/useDashboard";
import KPICard from "../components/dashboards/KPICard";
import DashboardGrid from "../components/dashboards/DashboardGrid";
import DashboardFilters from "../components/dashboards/DashboardFilters";
import BILayout from "../components/BILayout";

const DashboardView = () => {
  const { data, loading, error, filters, updateFilters, refreshDashboard } =
    useDashboard("global");

  if (loading) return <div>Cargando dashboard...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return (
    <BILayout title="Dashboard Global">
      <DashboardFilters filters={filters} onChange={updateFilters} />
      <button onClick={refreshDashboard}>Refrescar</button>
      <DashboardGrid>
        {data.kpis?.map((kpi) => (
          <KPICard key={kpi.id} {...kpi} />
        ))}
      </DashboardGrid>
      {/* Aquí irían los gráficos principales y tablas */}
    </BILayout>
  );
};

export default DashboardView;
