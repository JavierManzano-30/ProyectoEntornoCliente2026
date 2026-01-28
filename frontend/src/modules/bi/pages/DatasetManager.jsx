import React from "react";
import { useDatasets } from "../hooks/useDatasets";
import DatasetCard from "../components/datasets/DatasetCard";
import BILayout from "../components/BILayout";

const DatasetManager = () => {
  const { datasets, loading, error } = useDatasets();

  if (loading) return <div>Cargando datasets...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <BILayout title="Gestión de Datasets">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {datasets.map((ds) => (
          <DatasetCard key={ds.id} {...ds} />
        ))}
      </div>
    </BILayout>
  );
};

export default DatasetManager;
