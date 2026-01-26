import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import Button from '../../../../components/common/Button';
import { TICKET_STATUSES } from '../../constants/ticketStatuses';
import { TICKET_PRIORITIES } from '../../constants/ticketPriorities';
import { TICKET_CATEGORIES } from '../../constants/ticketCategories';
import './TicketFilters.css';

const TicketFilters = ({ filters, onFilterChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  const handleSearchChange = (e) => {
    setLocalSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onFilterChange({ ...filters, search: localSearch });
  };

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleClearFilters = () => {
    setLocalSearch('');
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => filters[key] && key !== 'search');

  return (
    <div className="ticket-filters">
      <div className="filters-main">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-group">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por título, descripción o ID..."
              value={localSearch}
              onChange={handleSearchChange}
            />
            {localSearch && (
              <button
                type="button"
                className="search-clear"
                onClick={() => {
                  setLocalSearch('');
                  onFilterChange({ ...filters, search: '' });
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </form>

        <div className="filters-actions">
          <Button
            variant={showAdvanced ? 'primary' : 'secondary'}
            icon={Filter}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            Filtros
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={handleClearFilters}
            >
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {showAdvanced && (
        <div className="filters-advanced">
          <div className="filter-group">
            <label className="filter-label">Estado</label>
            <select
              className="filter-select"
              value={filters.estado || ''}
              onChange={(e) => handleFilterChange('estado', e.target.value)}
            >
              <option value="">Todos</option>
              {Object.entries(TICKET_STATUSES).map(([key, value]) => (
                <option key={value} value={value}>
                  {key.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Prioridad</label>
            <select
              className="filter-select"
              value={filters.prioridad || ''}
              onChange={(e) => handleFilterChange('prioridad', e.target.value)}
            >
              <option value="">Todas</option>
              {Object.entries(TICKET_PRIORITIES).map(([key, value]) => (
                <option key={value} value={value}>
                  {key}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Categoría</label>
            <select
              className="filter-select"
              value={filters.categoria || ''}
              onChange={(e) => handleFilterChange('categoria', e.target.value)}
            >
              <option value="">Todas</option>
              {Object.entries(TICKET_CATEGORIES).map(([key, value]) => (
                <option key={value} value={value}>
                  {key}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketFilters;
