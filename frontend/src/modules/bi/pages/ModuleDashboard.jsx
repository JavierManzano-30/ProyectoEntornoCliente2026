import React from "react";
import { useParams } from "react-router-dom";
import { useDashboard } from "../hooks/useDashboard";
import KPICard from "../components/dashboards/KPICard";
import DashboardGrid from "../components/dashboards/DashboardGrid";
import DashboardFilters from "../components/dashboards/DashboardFilters";
import BILayout from "../components/BILayout";

const ModuleDashboard = () => {
  const { modulo } = useParams();
  const { data, loading, error, filters, updateFilters, refreshDashboard } =
    useDashboard(modulo);

  if (loading) return <div>Cargando dashboard de módulo...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return (
    <BILayout title={`Dashboard ${modulo}`}>
      <DashboardFilters filters={filters} onChange={updateFilters} />
      <button onClick={refreshDashboard}>Refrescar</button>
      <DashboardGrid>
        {data.kpis?.map((kpi) => (
          <KPICard key={kpi.id} {...kpi} />
        ))}
      </DashboardGrid>
      {/* Aquí irían los gráficos y métricas específicas del módulo */}
    </BILayout>
  );
};

export default ModuleDashboard;
