import { useEffect, useMemo, useState } from 'react';
import erpService from '../services/erpService';
import { formatCurrency, formatDate } from '../utils';
import './ERPSectionPages.css';

const openStatuses = new Set(['draft', 'confirmed', 'partially_received']);

const statusClass = (status) => {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'received') return 'status-ok';
  if (normalized === 'canceled') return 'status-danger';
  return 'status-warn';
};

const toNumber = (value) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toIsoDate = () => new Date().toISOString().slice(0, 10);
const emptyOrderForm = () => ({
  supplierId: '',
  orderNumber: `PO-${Date.now()}`,
  orderDate: toIsoDate(),
  total: '0',
  currency: 'EUR'
});

const PurchaseManagement = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderForm, setOrderForm] = useState(emptyOrderForm());

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersData, suppliersData, invoicesData] = await Promise.all([
        erpService.getPurchaseOrders(),
        erpService.getVendors(),
        erpService.getPurchaseInvoices()
      ]);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setSuppliers(Array.isArray(suppliersData) ? suppliersData : []);
      setInvoices(Array.isArray(invoicesData) ? invoicesData : []);
    } catch (error) {
      setErrorMessage('No se pudo cargar compras.');
      console.error('Error cargando compras ERP:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const metrics = useMemo(() => {
    const openOrders = orders.filter((order) => openStatuses.has(String(order.status || '').toLowerCase()));
    const overdueInvoices = invoices.filter((invoice) => {
      const status = String(invoice.status || '').toLowerCase();
      if (status === 'paid' || status === 'voided') return false;
      const dueDate = invoice.dueDate ? new Date(invoice.dueDate) : null;
      return dueDate && !Number.isNaN(dueDate.getTime()) && dueDate < new Date();
    });

    return {
      totalOrders: orders.length,
      openOrders: openOrders.length,
      totalSuppliers: suppliers.length,
      totalAmount: orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0),
      overdueAmount: overdueInvoices.reduce((sum, invoice) => sum + (Number(invoice.total) || 0), 0)
    };
  }, [orders, suppliers, invoices]);

  const handleCreateOrder = async (event) => {
    event.preventDefault();
    const total = toNumber(orderForm.total);
    if (!orderForm.supplierId || !orderForm.orderNumber) {
      setErrorMessage('supplierId y orderNumber son obligatorios.');
      return;
    }

    try {
      setSaving(true);
      setErrorMessage('');
      await erpService.createPurchaseOrder({
        supplierId: orderForm.supplierId,
        orderNumber: orderForm.orderNumber,
        orderDate: orderForm.orderDate || toIsoDate(),
        total,
        status: 'draft',
        currency: orderForm.currency || 'EUR'
      });
      setOrderForm(emptyOrderForm());
      setShowOrderForm(false);
      await loadData();
    } catch (error) {
      setErrorMessage('No se pudo crear la orden de compra.');
      console.error('Error creando orden ERP:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      setSaving(true);
      setErrorMessage('');
      await erpService.confirmPurchaseOrder(orderId);
      await loadData();
    } catch (error) {
      setErrorMessage('No se pudo confirmar la orden.');
      console.error('Error confirmando orden ERP:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="erp-section-page">
      <header className="erp-section-header">
        <div>
          <h1>Gestion de Compras</h1>
          <p>Ordenes, proveedores y facturas de compra desde las tablas ERP.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowOrderForm((prev) => !prev)} disabled={saving}>
          {showOrderForm ? 'Cerrar formulario' : 'Nueva Orden'}
        </button>
      </header>

      {errorMessage && <p className="form-error">{errorMessage}</p>}
      {showOrderForm && (
        <form className="filters-bar" onSubmit={handleCreateOrder}>
          <select
            className="filter-select"
            value={orderForm.supplierId}
            onChange={(event) => setOrderForm((prev) => ({ ...prev, supplierId: event.target.value }))}
          >
            <option value="">Selecciona proveedor</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.legalName || supplier.id}
              </option>
            ))}
          </select>
          <input
            className="filter-select"
            type="text"
            placeholder="Numero de orden"
            value={orderForm.orderNumber}
            onChange={(event) => setOrderForm((prev) => ({ ...prev, orderNumber: event.target.value }))}
          />
          <input
            className="filter-select"
            type="date"
            value={orderForm.orderDate}
            onChange={(event) => setOrderForm((prev) => ({ ...prev, orderDate: event.target.value }))}
          />
          <input
            className="filter-select"
            type="number"
            step="0.01"
            placeholder="Total"
            value={orderForm.total}
            onChange={(event) => setOrderForm((prev) => ({ ...prev, total: event.target.value }))}
          />
          <button className="btn-primary" type="submit" disabled={saving}>
            Guardar orden
          </button>
        </form>
      )}

      <section className="erp-section-grid">
        <article className="erp-section-card">
          <h3>Ordenes de compra</h3>
          <strong>{metrics.totalOrders}</strong>
          <span>{metrics.openOrders} abiertas</span>
        </article>
        <article className="erp-section-card">
          <h3>Proveedores</h3>
          <strong>{metrics.totalSuppliers}</strong>
          <span>registrados en la empresa</span>
        </article>
        <article className="erp-section-card">
          <h3>Total comprometido</h3>
          <strong>{formatCurrency(metrics.totalAmount)}</strong>
          <span>suma de ordenes</span>
        </article>
        <article className="erp-section-card">
          <h3>Facturas vencidas</h3>
          <strong>{formatCurrency(metrics.overdueAmount)}</strong>
          <span>pendiente de pago</span>
        </article>
      </section>

      <section className="erp-section-panel">
        <h2>Ordenes de Compra</h2>
        {loading ? (
          <div className="erp-section-loading">
            <div className="erp-section-spinner" />
            <p>Cargando compras...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="erp-section-empty">
            <p>No hay ordenes de compra para esta empresa.</p>
          </div>
        ) : (
          <table className="erp-section-table">
            <thead>
              <tr>
                <th>Numero</th>
                <th>Proveedor</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const supplier = suppliers.find((item) => item.id === order.supplierId);
                return (
                  <tr key={order.id}>
                    <td>{order.orderNumber || '-'}</td>
                    <td>{supplier?.legalName || order.supplierId || '-'}</td>
                    <td>{formatDate(order.orderDate)}</td>
                    <td>{formatCurrency(Number(order.total) || 0)}</td>
                    <td>
                      <span className={`erp-section-status ${statusClass(order.status)}`}>
                        {order.status || '-'}
                      </span>
                    </td>
                    <td>
                      {String(order.status || '').toLowerCase() === 'draft' ? (
                        <button className="btn-icon" onClick={() => handleConfirmOrder(order.id)} disabled={saving}>
                          Confirmar
                        </button>
                      ) : (
                        <span className="erp-section-muted">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default PurchaseManagement;
