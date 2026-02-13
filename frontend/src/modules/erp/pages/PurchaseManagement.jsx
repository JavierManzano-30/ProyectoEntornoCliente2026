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

const PurchaseManagement = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const load = async () => {
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
        console.error('Error cargando compras ERP:', error);
      } finally {
        setLoading(false);
      }
    };

    load();
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

  return (
    <div className="erp-section-page">
      <header className="erp-section-header">
        <div>
          <h1>Gestion de Compras</h1>
          <p>Ordenes, proveedores y facturas de compra desde las tablas ERP.</p>
        </div>
      </header>

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
