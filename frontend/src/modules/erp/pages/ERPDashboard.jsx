import { useCallback, useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, AlertCircle } from 'lucide-react';
import { useReporting } from '../hooks';
import { formatCurrency, formatPercentage } from '../utils';
import './ERPDashboard.css';

/**
 * Dashboard principal del módulo ERP
 * Muestra resumen financiero y KPIs clave
 */
const ERPDashboard = () => {
  const { getKPIs, loading, error } = useReporting();
  const [kpis, setKpis] = useState(null);

  const loadDashboardData = useCallback(async () => {
    try {
      const data = await getKPIs({ period: 'current_month' });
      setKpis(data);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    }
  }, [getKPIs]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (loading && !kpis) {
    return (
      <div className="erp-dashboard">
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Cargando datos financieros...</p>
        </div>
      </div>
    );
  }

  if (error && !kpis) {
    return (
      <div className="erp-dashboard">
        <div className="dashboard-error">
          <AlertCircle size={48} />
          <h3>Error al cargar el dashboard</h3>
          <p>{error}</p>
          <button onClick={loadDashboardData}>Reintentar</button>
        </div>
      </div>
    );
  }

  if (!kpis) {
    return (
      <div className="erp-dashboard">
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Cargando datos financieros...</p>
        </div>
      </div>
    );
  }

  const metrics = kpis;

  return (
    <div className="erp-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard ERP</h1>
        <div className="dashboard-actions">
          <button className="btn-refresh" onClick={loadDashboardData}>
            Actualizar
          </button>
        </div>
      </div>

      {/* KPIs principales */}
      <div className="dashboard-kpis">
        <div className="kpi-card revenue">
          <div className="kpi-icon">
            <DollarSign size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Ingresos</span>
            <h3 className="kpi-value">{formatCurrency(metrics.revenue.current)}</h3>
            <div className={`kpi-change ${metrics.revenue.change >= 0 ? 'positive' : 'negative'}`}>
              {metrics.revenue.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{formatPercentage(Math.abs(metrics.revenue.change))}</span>
            </div>
          </div>
        </div>

        <div className="kpi-card expenses">
          <div className="kpi-icon">
            <ShoppingCart size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Gastos</span>
            <h3 className="kpi-value">{formatCurrency(metrics.expenses.current)}</h3>
            <div className={`kpi-change ${metrics.expenses.change <= 0 ? 'positive' : 'negative'}`}>
              {metrics.expenses.change <= 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
              <span>{formatPercentage(Math.abs(metrics.expenses.change))}</span>
            </div>
          </div>
        </div>

        <div className="kpi-card profit">
          <div className="kpi-icon">
            <TrendingUp size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Beneficio</span>
            <h3 className="kpi-value">{formatCurrency(metrics.profit.current)}</h3>
            <div className={`kpi-change ${metrics.profit.change >= 0 ? 'positive' : 'negative'}`}>
              {metrics.profit.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{formatPercentage(Math.abs(metrics.profit.change))}</span>
            </div>
          </div>
        </div>

        <div className="kpi-card cash">
          <div className="kpi-icon">
            <DollarSign size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Efectivo</span>
            <h3 className="kpi-value">{formatCurrency(metrics.cash.current)}</h3>
            <div className={`kpi-change ${metrics.cash.change >= 0 ? 'positive' : 'negative'}`}>
              {metrics.cash.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{formatPercentage(Math.abs(metrics.cash.change))}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de detalle */}
      <div className="dashboard-details">
        <div className="detail-card">
          <h3>Cuentas por Cobrar</h3>
          <div className="detail-content">
            <div className="detail-item">
              <span>Total pendiente:</span>
              <strong>{formatCurrency(metrics.receivables.current)}</strong>
            </div>
            <div className="detail-item warning">
              <span>Vencido:</span>
              <strong>{formatCurrency(metrics.receivables.overdue)}</strong>
            </div>
          </div>
        </div>

        <div className="detail-card">
          <h3>Cuentas por Pagar</h3>
          <div className="detail-content">
            <div className="detail-item">
              <span>Total pendiente:</span>
              <strong>{formatCurrency(metrics.payables.current)}</strong>
            </div>
            <div className="detail-item warning">
              <span>Vencido:</span>
              <strong>{formatCurrency(metrics.payables.overdue)}</strong>
            </div>
          </div>
        </div>

        <div className="detail-card">
          <h3>Inventario</h3>
          <div className="detail-content">
            <div className="detail-item">
              <span>Valor total:</span>
              <strong>{formatCurrency(metrics.inventory.value)}</strong>
            </div>
            <div className="detail-item">
              <span>Rotación:</span>
              <strong>{metrics.inventory.turnover}x</strong>
            </div>
          </div>
        </div>

        <div className="detail-card">
          <h3>Órdenes</h3>
          <div className="detail-content">
            <div className="detail-item">
              <span>Pendientes:</span>
              <strong>{metrics.orders.pending}</strong>
            </div>
            <div className="detail-item">
              <span>Completadas:</span>
              <strong>{metrics.orders.completed}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas */}
      {(metrics.receivables.overdue > 0 || metrics.payables.overdue > 0) && (
        <div className="dashboard-alerts">
          <h3>
            <AlertCircle size={20} />
            Alertas Financieras
          </h3>
          <ul>
            {metrics.receivables.overdue > 0 && (
              <li className="alert-warning">
                Existen {formatCurrency(metrics.receivables.overdue)} en cuentas por cobrar vencidas
              </li>
            )}
            {metrics.payables.overdue > 0 && (
              <li className="alert-danger">
                Existen {formatCurrency(metrics.payables.overdue)} en cuentas por pagar vencidas
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ERPDashboard;
