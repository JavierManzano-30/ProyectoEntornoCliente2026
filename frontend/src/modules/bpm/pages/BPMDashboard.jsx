/**
 * Página principal del dashboard BPM
 */

import React, { useState, useEffect } from 'react';
import { useBPMMetrics } from '../hooks/useBPMMetrics';
import { useProcesses } from '../hooks/useProcesses';
import { useTaskInbox } from '../hooks/useTaskInbox';
import { useInstances } from '../hooks/useInstances';
import { BarChart3, Users, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import './BPMDashboard.css';

const BPMDashboard = () => {
  const { metrics, loading: metricsLoading } = useBPMMetrics();
  const { processes, loading: processesLoading } = useProcesses({ status: 'published' });
  const { tasks, stats: taskStats } = useTaskInbox();
  const { instances, loading: instancesLoading } = useInstances({ status: 'active' });

  const StatCard = ({ icon: Icon, title, value, subtext, color = 'blue' }) => (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-icon">
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <p className="stat-title">{title}</p>
        <p className="stat-value">{value}</p>
        {subtext && <p className="stat-subtext">{subtext}</p>}
      </div>
    </div>
  );

  return (
    <div className="bpm-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard BPM</h1>
        <p className="dashboard-subtitle">Monitoreo de procesos y tareas en tiempo real</p>
      </div>

      <div className="dashboard-grid">
        {/* Primera fila de estadísticas */}
        <StatCard
          icon={BarChart3}
          title="Procesos Activos"
          value={metrics.procesos?.activos || 0}
          subtext={`Total: ${metrics.procesos?.total || 0}`}
          color="blue"
        />
        <StatCard
          icon={Clock}
          title="Instancias Activas"
          value={metrics.instancias?.activas || 0}
          subtext={`Completadas: ${metrics.instancias?.completadas || 0}`}
          color="green"
        />
        <StatCard
          icon={Users}
          title="Tareas Pendientes"
          value={taskStats.pending || 0}
          subtext={`Vencidas: ${taskStats.overdue || 0}`}
          color="orange"
        />
        <StatCard
          icon={CheckCircle}
          title="Cumplimiento SLA"
          value={`${metrics.sla?.cumplimiento || 0}%`}
          subtext="Este mes"
          color="teal"
        />

        {/* Segunda fila con gráficos y detalles */}
        <div className="dashboard-widget wide">
          <h2 className="widget-title">Procesos Publicados</h2>
          {processesLoading ? (
            <p>Cargando...</p>
          ) : (
            <div className="process-quick-list">
              {processes.slice(0, 5).map(p => (
                <div key={p.id} className="quick-item">
                  <span className="quick-item-name">{p.nombre}</span>
                  <span className="quick-item-value">{p.instancias_activas || 0} activas</span>
                </div>
              ))}
              {processes.length === 0 && <p>No hay procesos publicados</p>}
            </div>
          )}
        </div>

        <div className="dashboard-widget">
          <h2 className="widget-title">Alertas</h2>
          <div className="alerts-list">
            {taskStats.overdue > 0 && (
              <div className="alert-item alert-warning">
                <AlertTriangle size={16} />
                <span>{taskStats.overdue} tareas vencidas</span>
              </div>
            )}
            {metrics.sla?.enRiesgo > 0 && (
              <div className="alert-item alert-warning">
                <AlertTriangle size={16} />
                <span>{metrics.sla.enRiesgo} procesos en riesgo</span>
              </div>
            )}
            {instances.filter(i => i.estado === 'error').length > 0 && (
              <div className="alert-item alert-error">
                <AlertTriangle size={16} />
                <span>{instances.filter(i => i.estado === 'error').length} instancias con error</span>
              </div>
            )}
            {taskStats.overdue === 0 && metrics.sla?.enRiesgo === 0 && (
              <p className="no-alerts">✓ Todo en orden</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BPMDashboard;
