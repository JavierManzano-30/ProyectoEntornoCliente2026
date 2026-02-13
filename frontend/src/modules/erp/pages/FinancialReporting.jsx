import { useEffect, useMemo, useState } from 'react';
import erpService from '../services/erpService';
import { formatCurrency, formatPercentage } from '../utils';
import './ERPSectionPages.css';

const monthKey = (value) => {
  if (!value) return 'Sin fecha';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sin fecha';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const FinancialReporting = () => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState(null);
  const [salesInvoices, setSalesInvoices] = useState([]);
  const [purchaseInvoices, setPurchaseInvoices] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [kpisData, salesData, purchaseData] = await Promise.all([
          erpService.getFinancialKPIs(),
          erpService.getSalesInvoices(),
          erpService.getPurchaseInvoices()
        ]);
        setKpis(kpisData || null);
        setSalesInvoices(Array.isArray(salesData) ? salesData : []);
        setPurchaseInvoices(Array.isArray(purchaseData) ? purchaseData : []);
      } catch (error) {
        console.error('Error cargando reportes ERP:', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const monthly = useMemo(() => {
    const bucket = {};

    salesInvoices.forEach((row) => {
      const key = monthKey(row.issueDate);
      if (!bucket[key]) bucket[key] = { revenue: 0, expense: 0 };
      bucket[key].revenue += Number(row.total) || 0;
    });

    purchaseInvoices.forEach((row) => {
      const key = monthKey(row.receivedDate);
      if (!bucket[key]) bucket[key] = { revenue: 0, expense: 0 };
      bucket[key].expense += Number(row.total) || 0;
    });

    return Object.entries(bucket)
      .map(([month, values]) => ({
        month,
        revenue: values.revenue,
        expense: values.expense,
        margin: values.revenue - values.expense
      }))
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 8);
  }, [salesInvoices, purchaseInvoices]);

  return (
    <div className="erp-section-page">
      <header className="erp-section-header">
        <div>
          <h1>Reportes Financieros</h1>
          <p>Resumen financiero consolidado desde facturas de venta y compra.</p>
        </div>
      </header>

      <section className="erp-section-grid">
        <article className="erp-section-card">
          <h3>Ingresos</h3>
          <strong>{formatCurrency(kpis?.revenue?.current || 0)}</strong>
          <span>{formatPercentage(Math.abs(kpis?.revenue?.change || 0))} variacion</span>
        </article>
        <article className="erp-section-card">
          <h3>Gastos</h3>
          <strong>{formatCurrency(kpis?.expenses?.current || 0)}</strong>
          <span>{formatPercentage(Math.abs(kpis?.expenses?.change || 0))} variacion</span>
        </article>
        <article className="erp-section-card">
          <h3>Beneficio</h3>
          <strong>{formatCurrency(kpis?.profit?.current || 0)}</strong>
          <span>{formatPercentage(Math.abs(kpis?.profit?.change || 0))} variacion</span>
        </article>
        <article className="erp-section-card">
          <h3>Efectivo</h3>
          <strong>{formatCurrency(kpis?.cash?.current || 0)}</strong>
          <span>{formatPercentage(Math.abs(kpis?.cash?.change || 0))} variacion</span>
        </article>
      </section>

      <section className="erp-section-panel">
        <h2>Evolucion Mensual</h2>
        {loading ? (
          <div className="erp-section-loading">
            <div className="erp-section-spinner" />
            <p>Cargando reportes...</p>
          </div>
        ) : monthly.length === 0 ? (
          <div className="erp-section-empty">
            <p>No hay movimientos para generar el reporte.</p>
          </div>
        ) : (
          <table className="erp-section-table">
            <thead>
              <tr>
                <th>Mes</th>
                <th>Ingresos</th>
                <th>Gastos</th>
                <th>Margen</th>
              </tr>
            </thead>
            <tbody>
              {monthly.map((row) => (
                <tr key={row.month}>
                  <td>{row.month}</td>
                  <td>{formatCurrency(row.revenue)}</td>
                  <td>{formatCurrency(row.expense)}</td>
                  <td>{formatCurrency(row.margin)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default FinancialReporting;
