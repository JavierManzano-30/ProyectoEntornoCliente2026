import React from 'react';
import { useCRMDashboard } from '../hooks/useCRMDashboard';
import Card from '../../../components/common/Card';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import { Users, UserPlus, TrendingUp, DollarSign, Target, Activity } from 'lucide-react';
import './CRMDashboard.css';

const CRMDashboard = () => {
  const { dashboardData, loading, error, refetch } = useCRMDashboard();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) return <LoadingSpinner fullScreen text="Cargando dashboard..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} fullScreen />;
  if (!dashboardData) return null;

  const { resumen, pipelinePorFase, actividadesRecientes, topOportunidades } = dashboardData;

  return (
    <div className="crm-dashboard">
      <div className="crm-dashboard__header">
        <h1>Dashboard CRM</h1>
        <p>Resumen ejecutivo de ventas y actividad comercial</p>
      </div>

      {/* KPIs principales */}
      <div className="crm-dashboard__kpis">
        <Card className="kpi-card kpi-card--blue">
          <div className="kpi-card__icon">
            <Users size={24} />
          </div>
          <div className="kpi-card__content">
            <p className="kpi-card__label">Total Clientes</p>
            <p className="kpi-card__value">{resumen.totalClientes}</p>
          </div>
        </Card>

        <Card className="kpi-card kpi-card--orange">
          <div className="kpi-card__icon">
            <UserPlus size={24} />
          </div>
          <div className="kpi-card__content">
            <p className="kpi-card__label">Leads Activos</p>
            <p className="kpi-card__value">{resumen.totalLeads}</p>
          </div>
        </Card>

        <Card className="kpi-card kpi-card--purple">
          <div className="kpi-card__icon">
            <Target size={24} />
          </div>
          <div className="kpi-card__content">
            <p className="kpi-card__label">Oportunidades</p>
            <p className="kpi-card__value">{resumen.totalOportunidades}</p>
          </div>
        </Card>

        <Card className="kpi-card kpi-card--green">
          <div className="kpi-card__icon">
            <DollarSign size={24} />
          </div>
          <div className="kpi-card__content">
            <p className="kpi-card__label">Valor Pipeline</p>
            <p className="kpi-card__value">{formatCurrency(resumen.valorPipeline)}</p>
          </div>
        </Card>

        <Card className="kpi-card kpi-card--cyan">
          <div className="kpi-card__icon">
            <TrendingUp size={24} />
          </div>
          <div className="kpi-card__content">
            <p className="kpi-card__label">Tasa Conversión</p>
            <p className="kpi-card__value">{resumen.tasaConversion}%</p>
          </div>
        </Card>
      </div>

      <div className="crm-dashboard__grid">
        {/* Pipeline por fase */}
        <Card className="crm-dashboard__card">
          <h3>Pipeline por Fase</h3>
          <div className="pipeline-chart">
            {pipelinePorFase.map((fase) => {
              const percentage = resumen.valorPipeline > 0 
                ? (fase.valor / resumen.valorPipeline) * 100 
                : 0;
              
              return (
                <div key={fase.fase} className="pipeline-item">
                  <div className="pipeline-item__info">
                    <span className="pipeline-item__fase">{fase.fase}</span>
                    <span className="pipeline-item__cantidad">{fase.cantidad}</span>
                  </div>
                  <div className="pipeline-item__bar">
                    <div 
                      className="pipeline-item__fill" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="pipeline-item__valor">{formatCurrency(fase.valor)}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Top oportunidades */}
        <Card className="crm-dashboard__card">
          <h3>Top Oportunidades</h3>
          <div className="top-opportunities">
            {topOportunidades.map((opp) => (
              <div key={opp.id} className="opportunity-item">
                <div className="opportunity-item__header">
                  <strong>{opp.nombre}</strong>
                  <span className="opportunity-item__value">
                    {formatCurrency(opp.valor)}
                  </span>
                </div>
                <div className="opportunity-item__details">
                  <span>{opp.cliente?.nombre}</span>
                  <span className="opportunity-item__probability">{opp.probabilidad}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Actividades recientes */}
        <Card className="crm-dashboard__card crm-dashboard__card--wide">
          <h3>Actividades Recientes</h3>
          <div className="recent-activities">
            {actividadesRecientes.map((activity) => (
              <div key={activity.id} className="activity-item">
                <Activity size={16} />
                <div className="activity-item__content">
                  <strong>{activity.titulo}</strong>
                  <span className="activity-item__meta">
                    {activity.responsable?.nombre} • {new Date(activity.fechaProgramada).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CRMDashboard;
