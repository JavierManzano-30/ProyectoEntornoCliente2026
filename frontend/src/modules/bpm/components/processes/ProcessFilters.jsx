/**
 * Componente filtros para procesos
 */

import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { PROCESS_STATUS, PROCESS_STATUS_LABELS } from '../../constants/processStatus';
import './ProcessFilters.css';

const ProcessFilters = ({ filters, onFiltersChange, onClear }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some(v => v && v !== '');

  return (
    <div className="process-filters">
      <div className="process-filters-header">
        <div className="process-filters-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar procesos..."
            value={filters.busqueda || ''}
            onChange={(e) => handleInputChange('busqueda', e.target.value)}
          />
        </div>
        
        <button
          className={`process-filters-toggle ${isExpanded ? 'active' : ''}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Filter size={18} />
          {hasActiveFilters && <span className="badge">{Object.values(filters).filter(v => v).length}</span>}
        </button>
      </div>

      {isExpanded && (
        <div className="process-filters-panel">
          <div className="filter-group">
            <label>Estado</label>
            <select
              value={filters.estado || ''}
              onChange={(e) => handleInputChange('estado', e.target.value)}
            >
              <option value="">Todos</option>
              {Object.entries(PROCESS_STATUS).map(([key, value]) => (
                <option key={value} value={value}>
                  {PROCESS_STATUS_LABELS[value]}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Categoría</label>
            <select
              value={filters.categoria || ''}
              onChange={(e) => handleInputChange('categoria', e.target.value)}
            >
              <option value="">Todas</option>
              <option value="financiero">Financiero</option>
              <option value="recursos">Recursos Humanos</option>
              <option value="operativo">Operativo</option>
              <option value="soporte">Soporte</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button className="filter-clear-btn" onClick={() => onClear?.()}>
              <X size={16} />
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProcessFilters;
