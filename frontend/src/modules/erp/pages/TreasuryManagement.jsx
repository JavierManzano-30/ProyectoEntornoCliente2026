import { useEffect, useMemo, useState } from 'react';
import erpService from '../services/erpService';
import { formatCurrency, formatDate } from '../utils';
import './ERPSectionPages.css';

const isPendingStatus = (status) => !['paid', 'voided'].includes(String(status || '').toLowerCase());
const toIsoDate = () => new Date().toISOString().slice(0, 10);

const isOverdue = (row, dateField = 'dueDate') => {
  const dateValue = row?.[dateField] || row?.due_date;
  if (!dateValue) return false;
  const dueDate = new Date(dateValue);
  if (Number.isNaN(dueDate.getTime())) return false;
  return dueDate < new Date();
};

const TreasuryManagement = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [salesInvoices, setSalesInvoices] = useState([]);
  const [purchaseInvoices, setPurchaseInvoices] = useState([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [salesData, purchaseData] = await Promise.all([
        erpService.getSalesInvoices(),
        erpService.getPurchaseInvoices()
      ]);
      setSalesInvoices(Array.isArray(salesData) ? salesData : []);
      setPurchaseInvoices(Array.isArray(purchaseData) ? purchaseData : []);
    } catch (error) {
      setErrorMessage('No se pudo cargar tesoreria.');
      console.error('Error cargando tesoreria ERP:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const metrics = useMemo(() => {
    const receivables = salesInvoices.filter((row) => isPendingStatus(row.status));
    const payables = purchaseInvoices.filter((row) => isPendingStatus(row.status));
    const paidInSales = salesInvoices
      .filter((row) => String(row.status || '').toLowerCase() === 'paid')
      .reduce((sum, row) => sum + (Number(row.total) || 0), 0);
    const paidInPurchases = purchaseInvoices
      .filter((row) => String(row.status || '').toLowerCase() === 'paid')
      .reduce((sum, row) => sum + (Number(row.total) || 0), 0);

    return {
      receivableAmount: receivables.reduce((sum, row) => sum + (Number(row.total) || 0), 0),
      payableAmount: payables.reduce((sum, row) => sum + (Number(row.total) || 0), 0),
      overdueReceivables: receivables.filter((row) => isOverdue(row)).reduce((sum, row) => sum + (Number(row.total) || 0), 0),
      overduePayables: payables.filter((row) => isOverdue(row)).reduce((sum, row) => sum + (Number(row.total) || 0), 0),
      cashPosition: paidInSales - paidInPurchases
    };
  }, [salesInvoices, purchaseInvoices]);

  const pendingReceivables = salesInvoices.filter((row) => isPendingStatus(row.status)).slice(0, 8);
  const pendingPayables = purchaseInvoices.filter((row) => isPendingStatus(row.status)).slice(0, 8);

  const handlePayReceivable = async (invoiceId) => {
    try {
      setSaving(true);
      setErrorMessage('');
      await erpService.recordInvoicePayment(invoiceId, { paidDate: toIsoDate() });
      await loadData();
    } catch (error) {
      setErrorMessage('No se pudo marcar la factura de venta como pagada.');
      console.error('Error actualizando cobro ERP:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePayPayable = async (invoiceId) => {
    try {
      setSaving(true);
      setErrorMessage('');
      await erpService.updatePurchaseInvoice(invoiceId, { status: 'paid', paidDate: toIsoDate() });
      await loadData();
    } catch (error) {
      setErrorMessage('No se pudo marcar la factura de compra como pagada.');
      console.error('Error actualizando pago ERP:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="erp-section-page">
      <header className="erp-section-header">
        <div>
          <h1>Gestion de Tesoreria</h1>
          <p>Posicion de caja, cuentas por cobrar y cuentas por pagar.</p>
        </div>
      </header>

      {errorMessage && <p className="form-error">{errorMessage}</p>}

      <section className="erp-section-grid">
        <article className="erp-section-card">
          <h3>Cuentas por cobrar</h3>
          <strong>{formatCurrency(metrics.receivableAmount)}</strong>
          <span>facturas de venta pendientes</span>
        </article>
        <article className="erp-section-card">
          <h3>Cuentas por pagar</h3>
          <strong>{formatCurrency(metrics.payableAmount)}</strong>
          <span>facturas de compra pendientes</span>
        </article>
        <article className="erp-section-card">
          <h3>Vencido por cobrar</h3>
          <strong>{formatCurrency(metrics.overdueReceivables)}</strong>
          <span>cartera vencida</span>
        </article>
        <article className="erp-section-card">
          <h3>Posicion de caja</h3>
          <strong>{formatCurrency(metrics.cashPosition)}</strong>
          <span>cobrado - pagado</span>
        </article>
      </section>

      {loading ? (
        <section className="erp-section-panel">
          <div className="erp-section-loading">
            <div className="erp-section-spinner" />
            <p>Cargando tesoreria...</p>
          </div>
        </section>
      ) : (
        <section className="erp-section-columns">
          <article className="erp-section-panel">
            <h2>Facturas por Cobrar</h2>
            {pendingReceivables.length === 0 ? (
              <div className="erp-section-empty">
                <p>No hay facturas pendientes.</p>
              </div>
            ) : (
              <ul className="erp-section-list">
                {pendingReceivables.map((row) => (
                  <li key={row.id}>
                    <span>{row.invoiceNumber || '-'} - vence {formatDate(row.dueDate)}</span>
                    <span className="value">{formatCurrency(Number(row.total) || 0)}</span>
                    <button className="btn-icon" onClick={() => handlePayReceivable(row.id)} disabled={saving}>
                      Cobrar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </article>

          <article className="erp-section-panel">
            <h2>Facturas por Pagar</h2>
            {pendingPayables.length === 0 ? (
              <div className="erp-section-empty">
                <p>No hay facturas de compra pendientes.</p>
              </div>
            ) : (
              <ul className="erp-section-list">
                {pendingPayables.map((row) => (
                  <li key={row.id}>
                    <span>{row.invoiceNumber || '-'} - vence {formatDate(row.dueDate)}</span>
                    <span className="value">{formatCurrency(Number(row.total) || 0)}</span>
                    <button className="btn-icon" onClick={() => handlePayPayable(row.id)} disabled={saving}>
                      Pagar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </section>
      )}
    </div>
  );
};

export default TreasuryManagement;
