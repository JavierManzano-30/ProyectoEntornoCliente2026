import { useEffect, useState } from 'react';
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

/**
 * Página de Facturación y Ventas
 * Gestión de facturas de venta y cuentas por cobrar
 */
const SalesInvoicing = () => {
  const { invoices, loading, loadInvoices } = useSales();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const invoiceList = invoices.map(getInvoiceView);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const filteredInvoices = invoiceList.filter(invoice => {
    const matchesSearch = invoice.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
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

  const handleCreateInvoice = () => {
    console.log('Crear nueva factura');
  };

  return (
    <div className="sales-invoicing">
      <div className="page-header">
        <h1>Facturación y Ventas</h1>
        <div className="page-actions">
          <button className="btn-primary" onClick={handleCreateInvoice}>
            <Plus size={20} />
            Nueva Factura
          </button>
        </div>
      </div>

      {/* Stats Cards */}
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

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar por número o cliente..."
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

      {/* Invoices Table */}
      <div className="invoices-table-container">
        {loading ? (
          <div className="table-loading">
            <div className="spinner"></div>
            <p>Cargando facturas...</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="table-empty">
            <p>No se encontraron facturas</p>
            <button className="btn-primary" onClick={handleCreateInvoice}>
              <Plus size={20} />
              Crear primera factura
            </button>
          </div>
        ) : (
          <table className="invoices-table">
            <thead>
              <tr>
                <th>Número</th>
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
              {filteredInvoices.map(invoice => (
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
                      <button className="btn-icon" title="Ver factura">
                        Ver
                      </button>
                      {invoice.status === 'draft' && (
                        <button className="btn-icon" title="Enviar">
                          <Send size={14} />
                        </button>
                      )}
                      <button className="btn-icon" title="Descargar PDF">
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
