import React from "react";

const DashboardGrid = ({ children }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>{children}</div>
);

export default DashboardGrid;
