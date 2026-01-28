import React from "react";

const KPICard = ({ label, value, trend, unit }) => (
  <div
    style={{
      border: "1px solid #eee",
      borderRadius: 8,
      padding: 16,
      minWidth: 180,
    }}
  >
    <div style={{ fontSize: 14, color: "#888" }}>{label}</div>
    <div style={{ fontSize: 28, fontWeight: 700 }}>
      {value} {unit}
    </div>
    {trend && (
      <div style={{ color: trend > 0 ? "green" : "red" }}>
        {trend > 0 ? "▲" : "▼"} {Math.abs(trend)}%
      </div>
    )}
  </div>
);

export default KPICard;
