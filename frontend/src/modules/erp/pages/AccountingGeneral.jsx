import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Download } from 'lucide-react';
import { useAccounting } from '../hooks';
import erpService from '../services/erpService';
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

const toNumber = (value) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toIsoDate = () => new Date().toISOString().slice(0, 10);
const emptyEntryForm = () => ({
  description: '',
  totalDebit: '0',
  totalCredit: '0',
  entryDate: toIsoDate()
});

const AccountingGeneral = () => {
  const { journalEntries, chartOfAccounts, loading, loadJournalEntries, loadChartOfAccounts, createEntry, postEntry } = useAccounting();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [view, setView] = useState('entries');
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [entryForm, setEntryForm] = useState(emptyEntryForm());

  useEffect(() => {
    loadJournalEntries();
    loadChartOfAccounts();
  }, [loadJournalEntries, loadChartOfAccounts]);

  const normalizedEntries = useMemo(() => journalEntries.map(normalizeEntry), [journalEntries]);

  const filteredEntries = normalizedEntries.filter((entry) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = entry.description.toLowerCase().includes(search) || entry.number.toLowerCase().includes(search);
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateEntry = async (event) => {
    event.preventDefault();
    if (!entryForm.description) {
      setErrorMessage('La descripcion es obligatoria.');
      return;
    }

    try {
      setSaving(true);
      setErrorMessage('');
      await createEntry({
        entryNumber: `AS-${Date.now()}`,
        entryDate: entryForm.entryDate || toIsoDate(),
        description: entryForm.description,
        entryType: 'standard',
        totalDebit: toNumber(entryForm.totalDebit),
        totalCredit: toNumber(entryForm.totalCredit),
        status: 'draft'
      });
      setEntryForm(emptyEntryForm());
      setShowEntryForm(false);
      await loadJournalEntries();
    } catch (error) {
      setErrorMessage('No se pudo crear el asiento.');
      console.error('Error creando asiento ERP:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePostEntry = async (entryId) => {
    try {
      setSaving(true);
      setErrorMessage('');
      await postEntry(entryId);
      await loadJournalEntries();
    } catch (error) {
      setErrorMessage('No se pudo contabilizar el asiento.');
      console.error('Error contabilizando asiento ERP:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleReverseEntry = async (entryId) => {
    try {
      setSaving(true);
      setErrorMessage('');
      await erpService.reverseJournalEntry(entryId, { reason: 'Reversion manual desde frontend ERP' });
      await loadJournalEntries();
    } catch (error) {
      setErrorMessage('No se pudo revertir el asiento.');
      console.error('Error revirtiendo asiento ERP:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="accounting-general">
      <div className="page-header">
        <h1>Contabilidad General</h1>
        <div className="page-actions">
          <button className="btn-primary" onClick={() => setShowEntryForm((prev) => !prev)} disabled={saving}>
            <Plus size={20} />
            {showEntryForm ? 'Cerrar formulario' : 'Nuevo Asiento'}
          </button>
          <button className="btn-secondary" disabled>
            <Download size={20} />
            Exportar
          </button>
        </div>
      </div>

      {errorMessage && <p className="form-error">{errorMessage}</p>}
      {showEntryForm && (
        <form className="filters-bar" onSubmit={handleCreateEntry}>
          <input
            className="filter-select"
            type="date"
            value={entryForm.entryDate}
            onChange={(event) => setEntryForm((prev) => ({ ...prev, entryDate: event.target.value }))}
          />
          <input
            className="filter-select"
            type="text"
            placeholder="Descripcion"
            value={entryForm.description}
            onChange={(event) => setEntryForm((prev) => ({ ...prev, description: event.target.value }))}
          />
          <input
            className="filter-select"
            type="number"
            step="0.01"
            placeholder="Debe"
            value={entryForm.totalDebit}
            onChange={(event) => setEntryForm((prev) => ({ ...prev, totalDebit: event.target.value }))}
          />
          <input
            className="filter-select"
            type="number"
            step="0.01"
            placeholder="Haber"
            value={entryForm.totalCredit}
            onChange={(event) => setEntryForm((prev) => ({ ...prev, totalCredit: event.target.value }))}
          />
          <button className="btn-primary" type="submit" disabled={saving}>
            Guardar asiento
          </button>
        </form>
      )}

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
              <option value="reversed">Revertido</option>
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
                        {entry.status === 'draft' && (
                          <button className="btn-icon" title="Contabilizar" onClick={() => handlePostEntry(entry.id)} disabled={saving}>
                            Contabilizar
                          </button>
                        )}
                        {entry.status === 'posted' && (
                          <button className="btn-icon" title="Revertir" onClick={() => handleReverseEntry(entry.id)} disabled={saving}>
                            Revertir
                          </button>
                        )}
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
          <div className="entries-table-container">
            {loading ? (
              <div className="table-loading">
                <div className="spinner" />
                <p>Cargando plan contable...</p>
              </div>
            ) : chartOfAccounts.length === 0 ? (
              <div className="table-empty">
                <p>No hay cuentas contables.</p>
              </div>
            ) : (
              <table className="entries-table">
                <thead>
                  <tr>
                    <th>Codigo</th>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {chartOfAccounts.map((account) => (
                    <tr key={account.id}>
                      <td>{account.code || '-'}</td>
                      <td>{account.name || '-'}</td>
                      <td>{account.accountType || account.account_type || '-'}</td>
                      <td>{account.status || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountingGeneral;
