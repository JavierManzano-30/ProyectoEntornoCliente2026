import React from "react";
import { useAlerts } from "../hooks/useAlerts";
import AlertCard from "../components/alerts/AlertCard";
import BILayout from "../components/BILayout";

const AlertManager = () => {
  const { alerts, loading, error } = useAlerts();

  if (loading) return <div>Cargando alertas...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <BILayout title="Gestión de Alertas">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {alerts.map((alert) => (
          <AlertCard key={alert.id} {...alert} />
        ))}
      </div>
    </BILayout>
  );
};

export default AlertManager;
