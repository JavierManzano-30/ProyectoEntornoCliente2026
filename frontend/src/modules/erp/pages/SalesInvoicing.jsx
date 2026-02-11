import { useEffect, useState } from 'react';
import { Plus, Search, Download, Send } from 'lucide-react';
import { useSales } from '../hooks';
import { formatCurrency, formatDate } from '../utils';
import { INVOICE_STATUS_LABELS, INVOICE_STATUS_COLORS } from '../constants';
import './SalesInvoicing.css';

/**
 * Página de Facturación y Ventas
 * Gestión de facturas de venta y cuentas por cobrar
 */
const SalesInvoicing = () => {
  const { invoices, loading, loadInvoices } = useSales();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
          <h3 className="stat-value">{formatCurrency(125000)}</h3>
          <span className="stat-count">15 facturas</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Facturas Vencidas</span>
          <h3 className="stat-value danger">{formatCurrency(15000)}</h3>
          <span className="stat-count">3 facturas</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Cobrado Este Mes</span>
          <h3 className="stat-value success">{formatCurrency(250000)}</h3>
          <span className="stat-count">42 facturas</span>
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
          <option value="sent">Enviada</option>
          <option value="paid">Pagada</option>
          <option value="overdue">Vencida</option>
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
