import { useEffect, useState } from 'react';
import { Plus, Search, Filter, Download } from 'lucide-react';
import { useAccounting } from '../hooks';
import { formatCurrency, formatDate } from '../utils';
import { ACCOUNTING_ENTRY_STATUS_LABELS, ACCOUNTING_ENTRY_STATUS_COLORS } from '../constants';
import './AccountingGeneral.css';

/**
 * Página de Contabilidad General
 * Gestión de plan contable y asientos contables
 */
const AccountingGeneral = () => {
  const { journalEntries, loading, loadJournalEntries } = useAccounting();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [view, setView] = useState('entries'); // 'entries' | 'accounts'

  useEffect(() => {
    loadJournalEntries();
  }, [loadJournalEntries]);

  const filteredEntries = journalEntries.filter(entry => {
    const matchesSearch = entry.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateEntry = () => {
    console.log('Crear nuevo asiento');
  };

  const handleExport = () => {
    console.log('Exportar asientos');
  };

  return (
    <div className="accounting-general">
      <div className="page-header">
        <h1>Contabilidad General</h1>
        <div className="page-actions">
          <button className="btn-primary" onClick={handleCreateEntry}>
            <Plus size={20} />
            Nuevo Asiento
          </button>
          <button className="btn-secondary" onClick={handleExport}>
            <Download size={20} />
            Exportar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="view-tabs">
        <button 
          className={view === 'entries' ? 'active' : ''}
          onClick={() => setView('entries')}
        >
          Asientos Contables
        </button>
        <button 
          className={view === 'accounts' ? 'active' : ''}
          onClick={() => setView('accounts')}
        >
          Plan Contable
        </button>
      </div>

      {view === 'entries' && (
        <>
          {/* Filtros */}
          <div className="filters-bar">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Buscar por número o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Todos los estados</option>
              <option value="draft">Borrador</option>
              <option value="posted">Contabilizado</option>
              <option value="approved">Aprobado</option>
              <option value="closed">Cerrado</option>
            </select>
          </div>

          {/* Tabla de asientos */}
          <div className="entries-table-container">
            {loading ? (
              <div className="table-loading">
                <div className="spinner"></div>
                <p>Cargando asientos...</p>
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="table-empty">
                <p>No se encontraron asientos contables</p>
                <button className="btn-primary" onClick={handleCreateEntry}>
                  <Plus size={20} />
                  Crear primer asiento
                </button>
              </div>
            ) : (
              <table className="entries-table">
                <thead>
                  <tr>
                    <th>Número</th>
                    <th>Fecha</th>
                    <th>Descripción</th>
                    <th>Tipo</th>
                    <th className="text-right">Debe</th>
                    <th className="text-right">Haber</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map(entry => (
                    <tr key={entry.id}>
                      <td className="entry-number">{entry.number || '-'}</td>
                      <td>{formatDate(entry.date)}</td>
                      <td className="entry-description">{entry.description}</td>
                      <td>
                        <span className="entry-type">{entry.type || 'Estándar'}</span>
                      </td>
                      <td className="text-right">{formatCurrency(entry.totalDebit || 0)}</td>
                      <td className="text-right">{formatCurrency(entry.totalCredit || 0)}</td>
                      <td>
                        <span className={`status-badge status-${ACCOUNTING_ENTRY_STATUS_COLORS[entry.status]}`}>
                          {ACCOUNTING_ENTRY_STATUS_LABELS[entry.status] || entry.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn-icon" title="Ver detalle">
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {view === 'accounts' && (
        <div className="accounts-view">
          <div className="accounts-placeholder">
            <h3>Plan Contable</h3>
            <p>Aquí se mostrará el plan contable de la empresa</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountingGeneral;
