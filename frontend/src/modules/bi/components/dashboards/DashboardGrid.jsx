import React from "react";
import KPICard from "./KPICard";
import WidgetContainer from "./WidgetContainer";

const DashboardGrid = () => (
  <div className="dashboard-grid">
    <KPICard />
    <WidgetContainer />
    {/* Otros widgets y KPIs */}
  </div>
);

export default DashboardGrid;
