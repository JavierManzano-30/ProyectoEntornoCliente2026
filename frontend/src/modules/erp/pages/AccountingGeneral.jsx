import { useEffect, useState } from 'react';
import { Plus, Search, Download } from 'lucide-react';
import { useAccounting } from '../hooks';
import { formatCurrency, formatDate } from '../utils';
import { ACCOUNTING_ENTRY_STATUS_LABELS, ACCOUNTING_ENTRY_STATUS_COLORS } from '../constants';
import './AccountingGeneral.css';

const normalizeEntry = (entry) => ({
  id: entry.id,
  number: entry.number || entry.entryNumber || entry.entry_number || '-',
  date: entry.date || entry.entryDate || entry.entry_date,
  description: entry.description || entry.entry_description || '-',
  type: entry.type || entry.entryType || entry.entry_type || 'Estandar',
  totalDebit: entry.totalDebit || entry.total_debit || 0,
  totalCredit: entry.totalCredit || entry.total_credit || 0,
  status: entry.status || entry.entry_status || 'draft'
});

/**
 * Pagina de Contabilidad General
 * Gestion de plan contable y asientos contables
 */
const AccountingGeneral = () => {
  const { journalEntries, loading, loadJournalEntries } = useAccounting();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [view, setView] = useState('entries');

  useEffect(() => {
    loadJournalEntries();
  }, [loadJournalEntries]);

  const normalizedEntries = journalEntries.map(normalizeEntry);

  const filteredEntries = normalizedEntries.filter((entry) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = entry.description.toLowerCase().includes(search) || entry.number.toLowerCase().includes(search);
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="accounting-general">
      <div className="page-header">
        <h1>Contabilidad General</h1>
        <div className="page-actions">
          <button className="btn-primary">
            <Plus size={20} />
            Nuevo Asiento
          </button>
          <button className="btn-secondary">
            <Download size={20} />
            Exportar
          </button>
        </div>
      </div>

      <div className="view-tabs">
        <button className={view === 'entries' ? 'active' : ''} onClick={() => setView('entries')}>
          Asientos Contables
        </button>
        <button className={view === 'accounts' ? 'active' : ''} onClick={() => setView('accounts')}>
          Plan Contable
        </button>
      </div>

      {view === 'entries' && (
        <>
          <div className="filters-bar">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Buscar por numero o descripcion..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="filter-select">
              <option value="all">Todos los estados</option>
              <option value="draft">Borrador</option>
              <option value="posted">Contabilizado</option>
              <option value="approved">Aprobado</option>
              <option value="closed">Cerrado</option>
            </select>
          </div>

          <div className="entries-table-container">
            {loading ? (
              <div className="table-loading">
                <div className="spinner" />
                <p>Cargando asientos...</p>
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="table-empty">
                <p>No se encontraron asientos contables</p>
              </div>
            ) : (
              <table className="entries-table">
                <thead>
                  <tr>
                    <th>Numero</th>
                    <th>Fecha</th>
                    <th>Descripcion</th>
                    <th>Tipo</th>
                    <th className="text-right">Debe</th>
                    <th className="text-right">Haber</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry) => (
                    <tr key={entry.id}>
                      <td className="entry-number">{entry.number}</td>
                      <td>{formatDate(entry.date)}</td>
                      <td className="entry-description">{entry.description}</td>
                      <td>
                        <span className="entry-type">{entry.type}</span>
                      </td>
                      <td className="text-right">{formatCurrency(entry.totalDebit)}</td>
                      <td className="text-right">{formatCurrency(entry.totalCredit)}</td>
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
            <p>Aqui se muestra el plan contable cargado desde ERP.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountingGeneral;
