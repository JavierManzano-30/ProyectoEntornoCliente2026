/**
 * Página para listar procesos
 */

import React, { useState } from 'react';
import { useProcesses } from '../hooks/useProcesses';
import ProcessCard from '../components/processes/ProcessCard';
import ProcessTable from '../components/processes/ProcessTable';
import ProcessFilters from '../components/processes/ProcessFilters';
import { Plus, Grid3X3, List } from 'lucide-react';
import './ProcessList.css';

const ProcessList = () => {
  const { processes, loading, filters, setFilters } = useProcesses();
  const [viewType, setViewType] = useState('grid'); // grid o table

  return (
    <div className="process-list">
      <div className="process-list-header">
        <div>
          <h1>Procesos BPM</h1>
          <p className="subtitle">Gestiona tus procesos de negocio</p>
        </div>
        <button className="btn-primary">
          <Plus size={20} />
          Nuevo Proceso
        </button>
      </div>

      <ProcessFilters 
        filters={filters}
        onFiltersChange={setFilters}
        onClear={() => setFilters({})}
      />

      <div className="process-list-controls">
        <span className="result-count">{processes.length} procesos</span>
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewType === 'grid' ? 'active' : ''}`}
            onClick={() => setViewType('grid')}
            title="Vista de grid"
          >
            <Grid3X3 size={18} />
          </button>
          <button
            className={`toggle-btn ${viewType === 'table' ? 'active' : ''}`}
            onClick={() => setViewType('table')}
            title="Vista de tabla"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Cargando procesos...</div>
      ) : viewType === 'grid' ? (
        <div className="process-grid">
          {processes.map(process => (
            <ProcessCard
              key={process.id}
              process={process}
              onEdit={(p) => console.log('Editar', p)}
              onSelect={(p) => console.log('Seleccionar', p)}
            />
          ))}
        </div>
      ) : (
        <ProcessTable
          processes={processes}
          loading={loading}
        />
      )}
    </div>
  );
};

export default ProcessList;
