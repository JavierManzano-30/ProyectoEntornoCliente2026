/**
 * Página de Reportes de Soporte
 * Estadísticas avanzadas, gráficos y análisis por empresa/departamento
 */

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  Download,
  Calendar,
  Building2,
  Briefcase,
} from 'lucide-react';
import { useSoporteContext } from '../context/SoporteContext';
import './Reports.css';

const Reports = () => {
  const { usuario, getReports } = useSoporteContext();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState({
    ticketsPorEstado: [],
    ticketsPorPrioridad: [],
    tendenciaMensual: [],
    tiempoMedioResolucion: 0,
    satisfaccionCliente: 0,
  });

  const [filters, setFilters] = useState({
    fechaInicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    fechaFin: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadReports();
  }, [usuario.empresaId]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await getReports(filters);
      setReports(data);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExport = async (format) => {
    try {
      await soporteService.exportReports(filters, format);
      alert(`Reporte exportado en formato ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error al exportar reporte:', error);
    }
  };

  if (loading) {
    return (
      <div className="reports-page">
        <div className="loading-state">
          <BarChart3 className="loading-icon" />
          <p>Generando reportes...</p>
        </div>
      </div>
    );
  }

  const totalTickets = reports.ticketsPorEstado?.reduce((sum, item) => sum + item.cantidad, 0) || 0;
  const ticketsResueltos = reports.ticketsPorEstado?.find(t => t.estado === 'Resuelto')?.cantidad || 0;
  const tasaResolucion = totalTickets > 0 ? Math.round((ticketsResueltos / totalTickets) * 100) : 0;

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div className="header-content">
          <h1>
            <BarChart3 size={28} />
            Reportes y Análisis
          </h1>
          <p>Métricas de {usuario.empresaNombre} - Periodo seleccionado</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => handleExport('pdf')}>
            <Download size={18} />
            Exportar PDF
          </button>
          <button className="btn-secondary" onClick={() => handleExport('excel')}>
            <Download size={18} />
            Exportar Excel
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="reports-filters">
        <div className="filter-group">
          <label>
            <Calendar size={16} />
            Fecha Inicio
          </label>
          <input
            type="date"
            name="fechaInicio"
            value={filters.fechaInicio}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label>
            <Calendar size={16} />
            Fecha Fin
          </label>
          <input
            type="date"
            name="fechaFin"
            value={filters.fechaFin}
            onChange={handleFilterChange}
          />
        </div>

        <button className="btn-primary" onClick={loadReports}>
          <Filter size={16} />
          Aplicar Filtros
        </button>
      </div>

      {/* Resumen General */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon primary">
            <BarChart3 size={24} />
          </div>
          <div className="card-content">
            <span className="card-label">Total de Tickets</span>
            <span className="card-value">{totalTickets}</span>
            <span className="card-change positive">
              Empresa: {usuario.empresaNombre}
            </span>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon success">
            <CheckCircle size={24} />
          </div>
          <div className="card-content">
            <span className="card-label">Resueltos</span>
            <span className="card-value">{ticketsResueltos}</span>
            <span className="card-change positive">
              {tasaResolucion}% tasa de resolución
            </span>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon warning">
            <Clock size={24} />
          </div>
          <div className="card-content">
            <span className="card-label">Tiempo Promedio</span>
            <span className="card-value">{reports.tiempoMedioResolucion || 0}h</span>
            <span className="card-change">
              Tiempo medio de resolución
            </span>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon info">
            <Users size={24} />
          </div>
          <div className="card-content">
            <span className="card-label">Satisfacción</span>
            <span className="card-value">{reports.satisfaccionCliente || 0}/5</span>
            <span className="card-change positive">
              Valoración promedio
            </span>
          </div>
        </div>
      </div>

      {/* Gráficos y tablas */}
      <div className="reports-grid">
        {/* Por Estado */}
        <div className="report-card">
          <div className="report-card-header">
            <h3>Tickets por Estado</h3>
            <Filter size={18} />
          </div>
          <div className="report-chart">
            {reports.ticketsPorEstado && reports.ticketsPorEstado.length > 0 ? (
              <div className="bar-chart">
                {reports.ticketsPorEstado.map((item, index) => (
                  <div key={index} className="bar-item">
                    <div className="bar-label">{item.estado}</div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${totalTickets > 0 ? (item.cantidad / totalTickets) * 100 : 0}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                    <div className="bar-value">{item.cantidad}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No hay datos disponibles</p>
            )}
          </div>
        </div>

        {/* Por Prioridad */}
        <div className="report-card">
          <div className="report-card-header">
            <h3>Tickets por Prioridad</h3>
            <AlertCircle size={18} />
          </div>
          <div className="report-chart">
            {reports.ticketsPorPrioridad && reports.ticketsPorPrioridad.length > 0 ? (
              <div className="bar-chart">
                {reports.ticketsPorPrioridad.map((item, index) => (
                  <div key={index} className="bar-item">
                    <div className="bar-label">{item.prioridad}</div>
                    <div className="bar-track">
                      <div
                        className="bar-fill priority"
                        style={{
                          width: `${totalTickets > 0 ? (item.cantidad / totalTickets) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <div className="bar-value">{item.cantidad}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No hay datos disponibles</p>
            )}
          </div>
        </div>

        {/* Tendencia Mensual */}
        <div className="report-card wide">
          <div className="report-card-header">
            <h3>Tendencia Mensual</h3>
            <TrendingUp size={18} />
          </div>
          <div className="report-chart">
            {reports.tendenciaMensual && reports.tendenciaMensual.length > 0 ? (
              <div className="line-chart">
                {reports.tendenciaMensual.map((item, index) => (
                  <div key={index} className="chart-column">
                    <div className="chart-bars">
                      <div
                        className="chart-bar created"
                        style={{ height: `${(item.creados / 40) * 100}%` }}
                        title={`Creados: ${item.creados}`}
                      />
                      <div
                        className="chart-bar resolved"
                        style={{ height: `${(item.resueltos / 40) * 100}%` }}
                        title={`Resueltos: ${item.resueltos}`}
                      />
                    </div>
                    <div className="chart-label">{item.mes}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No hay datos disponibles</p>
            )}
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-color created"></span>
              <span>Creados</span>
            </div>
            <div className="legend-item">
              <span className="legend-color resolved"></span>
              <span>Resueltos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
