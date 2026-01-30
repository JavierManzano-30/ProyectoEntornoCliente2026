import React from "react";
import TrendIndicator from "./TrendIndicator";

const KPICard = () => (
  <div className="kpi-card">
    <h2>KPI</h2>
    <span>Valor</span>
    <TrendIndicator />
  </div>
);

export default KPICard;
