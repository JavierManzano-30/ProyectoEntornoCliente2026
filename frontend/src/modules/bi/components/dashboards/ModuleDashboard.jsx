import React from "react";
import DashboardFilters from "./DashboardFilters";

const cardStyle = {
  background: "#fff",
  borderRadius: "1rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  padding: "1.5rem",
  minWidth: 0,
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
};

const kpiGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "1.5rem",
  marginBottom: "2.5rem",
};

const widgetGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
  gap: "2rem",
};

const ModuleDashboard = ({ kpis = [], widgets = [] }) => (
  <div style={{ padding: "2rem" }}>
    <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
      Business Intelligence - Dashboard
    </h1>
    <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
      Visualiza los KPIs, métricas y reportes clave de la empresa en tiempo
      real.
    </p>
    <div style={{ marginBottom: "1.5rem" }}>
      <DashboardFilters />
    </div>
    {/* KPIs */}
    <div style={kpiGridStyle}>
      {kpis.map((kpi) => (
        <div
          key={kpi.id || kpi.label}
          style={{ ...cardStyle, borderTop: `4px solid ${kpi.color || "#2563eb"}` }}
        >
          <span
            style={{ color: "#6b7280", fontSize: "0.95rem", marginBottom: 4 }}
          >
            {kpi.label}
          </span>
          <span style={{ fontSize: "1.7rem", fontWeight: 600 }}>
            {kpi.value}
          </span>
          {kpi.trend && (
          <span
            style={{
              color: String(kpi.trend).startsWith("+") ? "#10b981" : "#ef4444",
              fontWeight: 500,
              fontSize: "1rem",
              marginTop: 6,
            }}
          >
            {kpi.trend}
          </span>
          )}
        </div>
      ))}
      {kpis.length === 0 && (
        <div style={cardStyle}>
          <span style={{ color: "#6b7280" }}>No hay KPIs disponibles.</span>
        </div>
      )}
    </div>
    {/* Widgets */}
    <div style={widgetGridStyle}>
      {widgets.map((widget) => (
        <div key={widget.title} style={cardStyle}>
          <span
            style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: 8 }}
          >
            {widget.title}
          </span>
          {/* Renderizado básico del gráfico */}
          {widget.type === "bar" ? (
            <div style={{ width: "100%", marginTop: 12 }}>
              {(widget.data || []).map((d) => (
                <div key={d.region} style={{ marginBottom: 8 }}>
                  <span style={{ display: "inline-block", width: 80 }}>
                    {d.region}
                  </span>
                  <div
                    style={{
                      display: "inline-block",
                      background: "#2563eb22",
                      borderRadius: 4,
                      height: 12,
                      width: d.value / 4000,
                    }}
                  />
                  <span
                    style={{ marginLeft: 8, color: "#2563eb", fontWeight: 500 }}
                  >
                    {d.value.toLocaleString("es-ES")} €
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "1rem auto",
              }}
            >
              <span style={{ fontSize: 22, color: "#6366f1" }}>Pie</span>
            </div>
          )}
        </div>
      ))}
      {widgets.length === 0 && (
        <div style={cardStyle}>
          <span style={{ color: "#6b7280" }}>No hay widgets disponibles.</span>
        </div>
      )}
    </div>
  </div>
);

export default ModuleDashboard;
