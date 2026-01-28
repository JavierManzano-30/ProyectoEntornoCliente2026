import React from "react";

const DashboardFilters = ({ filters, onChange }) => (
  <div style={{ marginBottom: 16 }}>
    {/* Ejemplo de filtro por periodo */}
    <label>Periodo: </label>
    <select
      value={filters.period || ""}
      onChange={(e) => onChange({ period: e.target.value })}
    >
      <option value="">Todos</option>
      <option value="this_month">Este mes</option>
      <option value="last_month">Mes anterior</option>
      <option value="this_year">Este año</option>
    </select>
    {/* Otros filtros según necesidades */}
  </div>
);

export default DashboardFilters;
