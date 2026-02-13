import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Download, Send } from 'lucide-react';
import { useSales } from '../hooks';
import { formatCurrency, formatDate } from '../utils';
import { INVOICE_STATUS_LABELS, INVOICE_STATUS_COLORS } from '../constants';
import './SalesInvoicing.css';

const STATUS_UI_MAP = {
  issued: 'sent',
  voided: 'cancelled'
};

const normalizeStatus = (status) => STATUS_UI_MAP[status] || status || 'draft';

const toNumber = (value) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const toIsoDate = () => new Date().toISOString().slice(0, 10);

const getInvoiceView = (invoice) => {
  const status = normalizeStatus(invoice.status);
  const total = toNumber(invoice.total);
  const pendingRaw = invoice.pending ?? invoice.pendingAmount;
  const pending = pendingRaw !== undefined
    ? toNumber(pendingRaw)
    : (status === 'paid' || status === 'cancelled' ? 0 : total);

  return {
    id: invoice.id,
    number: invoice.number || invoice.invoiceNumber || '-',
    customerName: invoice.customerName || invoice.clientName || invoice.clientId || 'Sin cliente',
    date: invoice.date || invoice.issueDate,
    dueDate: invoice.dueDate,
    paidDate: invoice.paidDate,
    total,
    pending,
    status
  };
};

const emptyInvoiceForm = () => ({
  clientId: '',
  invoiceNumber: `F-${Date.now()}`,
  issueDate: toIsoDate(),
  dueDate: toIsoDate(),
  subtotal: '0',
  taxAmount: '0'
});

const SalesInvoicing = () => {
  const { invoices, loading, loadInvoices, createInvoice, sendInvoice, recordPayment } = useSales();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState(emptyInvoiceForm());

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const invoiceList = useMemo(() => invoices.map(getInvoiceView), [invoices]);

  const filteredInvoices = invoiceList.filter((invoice) => {
    const matchesSearch = invoice.number?.toLowerCase().includes(searchTerm.toLowerCase())
      || invoice.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const pendingInvoices = invoiceList.filter((invoice) => invoice.pending > 0);
  const overdueInvoices = pendingInvoices.filter((invoice) => {
    const dueDate = toDate(invoice.dueDate);
    return dueDate && dueDate < today;
  });
  const collectedThisMonth = invoiceList
    .filter((invoice) => {
      if (invoice.status !== 'paid') return false;
      const paidDate = toDate(invoice.paidDate);
      return paidDate
        && paidDate.getMonth() === currentMonth
        && paidDate.getFullYear() === currentYear;
    })
    .reduce((sum, invoice) => sum + invoice.total, 0);

  const reload = async () => {
    await loadInvoices();
  };

  const handleCreateInvoice = async (event) => {
    event.preventDefault();
    const subtotal = toNumber(invoiceForm.subtotal);
    const taxAmount = toNumber(invoiceForm.taxAmount);
    const total = subtotal + taxAmount;
    if (!invoiceForm.clientId || !invoiceForm.invoiceNumber) {
      setErrorMessage('ClientId e invoiceNumber son obligatorios.');
      return;
    }

    try {
      setSaving(true);
      setErrorMessage('');
      await createInvoice({
        clientId: invoiceForm.clientId,
        invoiceNumber: invoiceForm.invoiceNumber,
        issueDate: invoiceForm.issueDate || toIsoDate(),
        dueDate: invoiceForm.dueDate || toIsoDate(),
        subtotal,
        taxAmount,
        total,
        status: 'draft'
      });
      setInvoiceForm(emptyInvoiceForm());
      setShowCreateForm(false);
      await reload();
    } catch (error) {
      setErrorMessage('No se pudo crear la factura. Revisa los datos e intenta de nuevo.');
      console.error('Error creando factura ERP:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSendInvoice = async (invoiceId) => {
    try {
      setSaving(true);
      setErrorMessage('');
      await sendInvoice(invoiceId, {});
      await reload();
    } catch (error) {
      setErrorMessage('No se pudo enviar la factura.');
      console.error('Error enviando factura ERP:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleRecordPayment = async (invoiceId) => {
    try {
      setSaving(true);
      setErrorMessage('');
      await recordPayment(invoiceId, { paidDate: toIsoDate() });
      await reload();
    } catch (error) {
      setErrorMessage('No se pudo registrar el pago.');
      console.error('Error registrando pago ERP:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="sales-invoicing">
      <div className="page-header">
        <h1>Facturacion y Ventas</h1>
        <div className="page-actions">
          <button className="btn-primary" onClick={() => setShowCreateForm((prev) => !prev)} disabled={saving}>
            <Plus size={20} />
            {showCreateForm ? 'Cerrar formulario' : 'Nueva Factura'}
          </button>
        </div>
      </div>

      {errorMessage && <p className="form-error">{errorMessage}</p>}
      {showCreateForm && (
        <form className="filters-bar" onSubmit={handleCreateInvoice}>
          <input
            className="filter-select"
            type="text"
            placeholder="clientId"
            value={invoiceForm.clientId}
            onChange={(event) => setInvoiceForm((prev) => ({ ...prev, clientId: event.target.value }))}
          />
          <input
            className="filter-select"
            type="text"
            placeholder="invoiceNumber"
            value={invoiceForm.invoiceNumber}
            onChange={(event) => setInvoiceForm((prev) => ({ ...prev, invoiceNumber: event.target.value }))}
          />
          <input
            className="filter-select"
            type="date"
            value={invoiceForm.issueDate}
            onChange={(event) => setInvoiceForm((prev) => ({ ...prev, issueDate: event.target.value }))}
          />
          <input
            className="filter-select"
            type="date"
            value={invoiceForm.dueDate}
            onChange={(event) => setInvoiceForm((prev) => ({ ...prev, dueDate: event.target.value }))}
          />
          <input
            className="filter-select"
            type="number"
            step="0.01"
            placeholder="Subtotal"
            value={invoiceForm.subtotal}
            onChange={(event) => setInvoiceForm((prev) => ({ ...prev, subtotal: event.target.value }))}
          />
          <input
            className="filter-select"
            type="number"
            step="0.01"
            placeholder="Impuestos"
            value={invoiceForm.taxAmount}
            onChange={(event) => setInvoiceForm((prev) => ({ ...prev, taxAmount: event.target.value }))}
          />
          <button className="btn-primary" type="submit" disabled={saving}>
            Guardar factura
          </button>
        </form>
      )}

      <div className="invoice-stats">
        <div className="stat-card">
          <span className="stat-label">Facturas Pendientes</span>
          <h3 className="stat-value">
            {formatCurrency(pendingInvoices.reduce((sum, invoice) => sum + invoice.pending, 0))}
          </h3>
          <span className="stat-count">{pendingInvoices.length} facturas</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Facturas Vencidas</span>
          <h3 className="stat-value danger">
            {formatCurrency(overdueInvoices.reduce((sum, invoice) => sum + invoice.pending, 0))}
          </h3>
          <span className="stat-count">{overdueInvoices.length} facturas</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Cobrado Este Mes</span>
          <h3 className="stat-value success">{formatCurrency(collectedThisMonth)}</h3>
          <span className="stat-count">
            {invoiceList.filter((invoice) => invoice.status === 'paid').length} facturas pagadas
          </span>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar por numero o cliente..."
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
          <option value="sent">Emitida/Enviada</option>
          <option value="paid">Pagada</option>
          <option value="cancelled">Anulada</option>
        </select>
      </div>

      <div className="invoices-table-container">
        {loading ? (
          <div className="table-loading">
            <div className="spinner" />
            <p>Cargando facturas...</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="table-empty">
            <p>No se encontraron facturas</p>
            <button className="btn-primary" onClick={() => setShowCreateForm(true)} disabled={saving}>
              <Plus size={20} />
              Crear primera factura
            </button>
          </div>
        ) : (
          <table className="invoices-table">
            <thead>
              <tr>
                <th>Numero</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Vencimiento</th>
                <th className="text-right">Total</th>
                <th className="text-right">Pendiente</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="invoice-number">{invoice.number || '-'}</td>
                  <td>{invoice.customerName || 'Sin cliente'}</td>
                  <td>{formatDate(invoice.date)}</td>
                  <td>{formatDate(invoice.dueDate)}</td>
                  <td className="text-right">{formatCurrency(invoice.total || 0)}</td>
                  <td className="text-right">{formatCurrency(invoice.pending || 0)}</td>
                  <td>
                    <span className={`status-badge status-${INVOICE_STATUS_COLORS[invoice.status]}`}>
                      {INVOICE_STATUS_LABELS[invoice.status] || invoice.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" title="Ver factura">Ver</button>
                      {invoice.status === 'draft' && (
                        <button className="btn-icon" title="Enviar" onClick={() => handleSendInvoice(invoice.id)} disabled={saving}>
                          <Send size={14} />
                        </button>
                      )}
                      {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                        <button className="btn-icon" title="Registrar pago" onClick={() => handleRecordPayment(invoice.id)} disabled={saving}>
                          Pagar
                        </button>
                      )}
                      <button
                        className="btn-icon"
                        title="Descargar PDF"
                        disabled
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SalesInvoicing;
