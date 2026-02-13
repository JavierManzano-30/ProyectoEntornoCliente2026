import { useEffect, useMemo, useState } from 'react';
import erpService from '../services/erpService';
import { formatCurrency, formatDate } from '../utils';
import './ERPSectionPages.css';

const ProjectCosting = () => {
  const [loading, setLoading] = useState(true);
  const [salesOrders, setSalesOrders] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [salesData, purchaseData] = await Promise.all([
          erpService.getSalesOrders(),
          erpService.getPurchaseOrders()
        ]);
        setSalesOrders(Array.isArray(salesData) ? salesData : []);
        setPurchaseOrders(Array.isArray(purchaseData) ? purchaseData : []);
      } catch (error) {
        console.error('Error cargando costos por proyecto:', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const summary = useMemo(() => {
    const totalSales = salesOrders.reduce((sum, row) => sum + (Number(row.total) || 0), 0);
    const totalPurchases = purchaseOrders.reduce((sum, row) => sum + (Number(row.total) || 0), 0);
    return {
      totalSales,
      totalPurchases,
      margin: totalSales - totalPurchases
    };
  }, [salesOrders, purchaseOrders]);

  const projects = useMemo(() => {
    const costsByOrder = purchaseOrders.reduce((acc, order) => {
      const key = order.orderNumber || order.id;
      acc[key] = (acc[key] || 0) + (Number(order.total) || 0);
      return acc;
    }, {});

    return salesOrders.map((order) => {
      const key = order.orderNumber || order.id;
      const revenue = Number(order.total) || 0;
      const cost = costsByOrder[key] || 0;
      return {
        id: order.id,
        key,
        client: order.clientId || '-',
        status: order.status || '-',
        date: order.orderDate,
        revenue,
        cost,
        margin: revenue - cost
      };
    });
  }, [salesOrders, purchaseOrders]);

  return (
    <div className="erp-section-page">
      <header className="erp-section-header">
        <div>
          <h1>Costos por Proyecto</h1>
          <p>Comparativa entre ingresos de ventas y costos de compras por referencia.</p>
        </div>
      </header>

      <section className="erp-section-grid">
        <article className="erp-section-card">
          <h3>Ingresos ventas</h3>
          <strong>{formatCurrency(summary.totalSales)}</strong>
          <span>ordenes de venta</span>
        </article>
        <article className="erp-section-card">
          <h3>Costos compras</h3>
          <strong>{formatCurrency(summary.totalPurchases)}</strong>
          <span>ordenes de compra</span>
        </article>
        <article className="erp-section-card">
          <h3>Margen estimado</h3>
          <strong>{formatCurrency(summary.margin)}</strong>
          <span>ingresos - costos</span>
        </article>
        <article className="erp-section-card">
          <h3>Referencias analizadas</h3>
          <strong>{projects.length}</strong>
          <span>ordenes de venta</span>
        </article>
      </section>

      <section className="erp-section-panel">
        <h2>Detalle por Referencia</h2>
        {loading ? (
          <div className="erp-section-loading">
            <div className="erp-section-spinner" />
            <p>Cargando costos...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="erp-section-empty">
            <p>No hay datos para costos por proyecto.</p>
          </div>
        ) : (
          <table className="erp-section-table">
            <thead>
              <tr>
                <th>Referencia</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Ingresos</th>
                <th>Costos</th>
                <th>Margen</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.key}</td>
                  <td>{project.client}</td>
                  <td>{formatDate(project.date)}</td>
                  <td>{project.status}</td>
                  <td>{formatCurrency(project.revenue)}</td>
                  <td>{formatCurrency(project.cost)}</td>
                  <td>{formatCurrency(project.margin)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default ProjectCosting;
