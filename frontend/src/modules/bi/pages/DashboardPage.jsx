/**
 * Dashboard Principal de BI
 * KPIs, gráficos y métricas clave del negocio
 */

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Target,
  BarChart3,
  PieChart,
  Building2,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';
import { useBIContext } from '../context/BIContext';
import PageHeader from '../../../components/common/PageHeader';
import Card from '../../../components/common/Card';
import './DashboardPage.css';

const DashboardPage = () => {
  const { usuario, cambiarEmpresa, getKPIs, getDashboardData } = useBIContext();
  const [loading, setLoading] = useState(true);
  const [kpis, setKPIs] = useState({});
  const [dashboardData, setDashboardData] = useState({});
  const [periodo, setPeriodo] = useState('mes');

  useEffect(() => {
    loadDashboardData();
  }, [usuario.empresaId, periodo]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [kpisData, chartData] = await Promise.all([
        getKPIs({ periodo }),
        getDashboardData({ periodo })
      ]);
      setKPIs(kpisData);
      setDashboardData(chartData);
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('es-ES').format(value);
  };

  if (loading) {
    return (
      <div className="bi-dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="bi-dashboard-page">
      <PageHeader
        title="Business Intelligence"
        subtitle={`Dashboard ejecutivo - ${usuario.empresaNombre}`}
        actions={
          <>
            {/* Selector de empresa (DEMO) */}
            <div className="empresa-selector-demo">
              <Building2 size={16} />
              <select
                value={usuario.empresaId}
                onChange={(e) => cambiarEmpresa(Number(e.target.value))}
                className="empresa-select"
              >
                <option value={1}>TechCorp Solutions</option>
                <option value={2}>InnovaDigital S.A.</option>
                <option value={3}>GlobalServices Ltd</option>
              </select>
            </div>

            <div className="periodo-selector">
              <Calendar size={16} />
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="periodo-select"
              >
                <option value="dia">Hoy</option>
                <option value="semana">Esta Semana</option>
                <option value="mes">Este Mes</option>
                <option value="trimestre">Trimestre</option>
                <option value="ano">Año</option>
              </select>
            </div>

            <button className="btn-secondary" onClick={loadDashboardData}>
              <RefreshCw size={18} />
              Actualizar
            </button>

            <button className="btn-secondary">
              <Download size={18} />
              Exportar
            </button>
          </>
        }
      />

      {/* KPIs Principales */}
      <div className="kpis-grid">
        <Card className="kpi-card">
          <div className="kpi-icon primary">
            <DollarSign size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Ingresos Totales</span>
            <span className="kpi-value">{formatCurrency(kpis.ingresosTotales?.value || 0)}</span>
            <span className={`kpi-change ${kpis.ingresosTotales?.trend}`}>
              {kpis.ingresosTotales?.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {kpis.ingresosTotales?.change > 0 ? '+' : ''}{kpis.ingresosTotales?.change}%
            </span>
          </div>
        </Card>

        <Card className="kpi-card">
          <div className="kpi-icon warning">
            <ShoppingCart size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Costes Operativos</span>
            <span className="kpi-value">{formatCurrency(kpis.costesOperativos?.value || 0)}</span>
            <span className={`kpi-change ${kpis.costesOperativos?.trend}`}>
              {kpis.costesOperativos?.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {kpis.costesOperativos?.change > 0 ? '+' : ''}{kpis.costesOperativos?.change}%
            </span>
          </div>
        </Card>

        <Card className="kpi-card">
          <div className="kpi-icon success">
            <TrendingUp size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Beneficio Neto</span>
            <span className="kpi-value">{formatCurrency(kpis.beneficioNeto?.value || 0)}</span>
            <span className={`kpi-change ${kpis.beneficioNeto?.trend}`}>
              {kpis.beneficioNeto?.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {kpis.beneficioNeto?.change > 0 ? '+' : ''}{kpis.beneficioNeto?.change}%
            </span>
          </div>
        </Card>

        <Card className="kpi-card">
          <div className="kpi-icon info">
            <Users size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Clientes Activos</span>
            <span className="kpi-value">{formatNumber(kpis.clientesActivos?.value || 0)}</span>
            <span className={`kpi-change ${kpis.clientesActivos?.trend}`}>
              {kpis.clientesActivos?.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {kpis.clientesActivos?.change > 0 ? '+' : ''}{kpis.clientesActivos?.change}%
            </span>
          </div>
        </Card>

        <Card className="kpi-card">
          <div className="kpi-icon accent">
            <Target size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Tasa de Conversión</span>
            <span className="kpi-value">{kpis.tasaConversion?.value || 0}%</span>
            <span className={`kpi-change ${kpis.tasaConversion?.trend}`}>
              {kpis.tasaConversion?.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {kpis.tasaConversion?.change > 0 ? '+' : ''}{kpis.tasaConversion?.change}pp
            </span>
          </div>
        </Card>

        <Card className="kpi-card">
          <div className="kpi-icon secondary">
            <BarChart3 size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Ticket Medio</span>
            <span className="kpi-value">{formatCurrency(kpis.ticketMedio?.value || 0)}</span>
            <span className={`kpi-change ${kpis.ticketMedio?.trend}`}>
              {kpis.ticketMedio?.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {kpis.ticketMedio?.change > 0 ? '+' : ''}{kpis.ticketMedio?.change}%
            </span>
          </div>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="charts-grid">
        {/* Ingresos por Mes */}
        <Card className="chart-card">
          <div className="chart-header">
            <h3>
              <BarChart3 size={20} />
              Ingresos y Costes Mensuales
            </h3>
          </div>
          <div className="chart-content">
            <div className="bar-chart-wrapper">
              {dashboardData.ingresosPorMes?.map((item, index) => (
                <div key={index} className="bar-group">
                  <div className="bars">
                    <div 
                      className="bar ingresos"
                      style={{ height: `${(item.ingresos / 250000) * 100}%` }}
                      title={`Ingresos: ${formatCurrency(item.ingresos)}`}
                    />
                    <div 
                      className="bar costes"
                      style={{ height: `${(item.costes / 250000) * 100}%` }}
                      title={`Costes: ${formatCurrency(item.costes)}`}
                    />
                  </div>
                  <span className="bar-label">{item.mes}</span>
                </div>
              ))}
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color ingresos"></span>
                <span>Ingresos</span>
              </div>
              <div className="legend-item">
                <span className="legend-color costes"></span>
                <span>Costes</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Ventas por Categoría */}
        <Card className="chart-card">
          <div className="chart-header">
            <h3>
              <PieChart size={20} />
              Ventas por Categoría
            </h3>
          </div>
          <div className="chart-content">
            <div className="donut-chart">
              {dashboardData.ventasPorCategoria?.map((item, index) => (
                <div key={index} className="donut-segment" style={{ '--percentage': item.porcentaje }}>
                  <div className="segment-bar" style={{ width: `${item.porcentaje}%` }}></div>
                </div>
              ))}
            </div>
            <div className="category-list">
              {dashboardData.ventasPorCategoria?.map((item, index) => (
                <div key={index} className="category-item">
                  <div className="category-info">
                    <span className="category-name">{item.categoria}</span>
                    <span className="category-percentage">{item.porcentaje}%</span>
                  </div>
                  <span className="category-value">{formatCurrency(item.valor)}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Clientes por Región */}
        <Card className="chart-card">
          <div className="chart-header">
            <h3>
              <Users size={20} />
              Clientes por Región
            </h3>
          </div>
          <div className="chart-content">
            <div className="region-list">
              {dashboardData.clientesPorRegion?.map((item, index) => {
                const maxValor = Math.max(...(dashboardData.clientesPorRegion?.map(r => r.valor) || [1]));
                return (
                  <div key={index} className="region-item">
                    <div className="region-info">
                      <span className="region-name">{item.region}</span>
                      <span className="region-count">{item.clientes} clientes</span>
                    </div>
                    <div className="region-bar-wrapper">
                      <div 
                        className="region-bar"
                        style={{ width: `${(item.valor / maxValor) * 100}%` }}
                      />
                    </div>
                    <span className="region-value">{formatCurrency(item.valor)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Top Productos */}
        <Card className="chart-card">
          <div className="chart-header">
            <h3>
              <Target size={20} />
              Top Productos / Servicios
            </h3>
          </div>
          <div className="chart-content">
            <div className="products-table">
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Ventas</th>
                    <th>Ingresos</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.topProductos?.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="product-cell">
                          <span className="product-rank">#{index + 1}</span>
                          <span className="product-name">{item.producto}</span>
                        </div>
                      </td>
                      <td>
                        <span className="product-sales">{item.ventas}</span>
                      </td>
                      <td>
                        <span className="product-revenue">{formatCurrency(item.ingresos)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
