import React, { useState } from 'react';
import { useSupportDashboard } from '../hooks/useSupportDashboard';
import { useNavigate } from 'react-router-dom';
import { useSoporteContext } from '../context/SoporteContext';
import Card from '../../../components/common/Card';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import KanbanBoard from '../components/kanban/KanbanBoard';
import TicketDetailModal from '../components/kanban/TicketDetailModal';
import { Ticket, Clock, CheckCircle, AlertTriangle, TrendingUp, Plus, LayoutGrid, Layers, Building2, RefreshCw } from 'lucide-react';
import Button from '../../../components/common/Button';
import './SupportDashboard.css';

const SupportDashboard = () => {
  const { dashboardData, stats, loading, error, refetch } = useSupportDashboard();
  const { usuario, empresaConfig, tieneMultiplesTablenes, tablonUnico, coloresTema, cambiarEmpresa } = useSoporteContext();
  const navigate = useNavigate();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' o 'stats'
  const [selectedTablonId, setSelectedTablonId] = useState(null);

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleCloseModal = () => {
    setSelectedTicket(null);
  };

  const handleNewTicket = () => {
    navigate('/soporte/tickets/nuevo');
  };

  const handleChangeEmpresa = (empresaId) => {
    cambiarEmpresa(Number(empresaId));
  };

  if (loading) return <LoadingSpinner fullScreen text="Cargando dashboard..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} fullScreen />;

  const metrics = [
    {
      label: 'Total Tickets',
      value: stats?.totalTickets || 0,
      icon: Ticket,
      color: 'blue',
      trend: '+12%',
    },
    {
      label: 'Tickets Abiertos',
      value: stats?.ticketsAbiertos || 0,
      icon: Clock,
      color: 'yellow',
      trend: '+5%',
    },
    {
      label: 'Resueltos Hoy',
      value: stats?.ticketsResueltosHoy || 0,
      icon: CheckCircle,
      color: 'green',
      trend: '+8%',
    },
    {
      label: 'SLA en Riesgo',
      value: stats?.ticketsSLARiesgo || 0,
      icon: AlertTriangle,
      color: 'red',
      trend: '-3%',
    },
  ];

  const tablones = empresaConfig.tablones || [];
  const selectedTablonData = selectedTablonId 
    ? tablones.find((t) => t.id === selectedTablonId)
    : tablonUnico;

  return (
    <div className="support-dashboard-page">
      <PageHeader
        title="Dashboard de Soporte"
        subtitle={
          <div className="dashboard-subtitle">
            <Building2 size={16} />
            <span>{usuario.empresaNombre}</span>
            {usuario.departamentoNombre && (
              <span className="separator">•</span>
            )}
            {usuario.departamentoNombre && <span>{usuario.departamentoNombre}</span>}
          </div>
        }
        actions={
          <>
            {/* DEMO: Selector de empresa para pruebas */}
            <div className="empresa-selector-demo">
              <Building2 size={16} />
              <select
                value={usuario.empresaId}
                onChange={(e) => handleChangeEmpresa(e.target.value)}
                className="empresa-select"
                title="Cambiar empresa (solo en modo demo)"
              >
                <option value={1}>TechCorp Solutions</option>
                <option value={2}>InnovaDigital S.A.</option>
                <option value={3}>GlobalServices Ltd</option>
              </select>
            </div>
            
            {tieneMultiplesTablenes && (
              <div className="tablon-selector">
                <Layers size={18} />
                <select
                  value={selectedTablonId || ''}
                  onChange={(e) => setSelectedTablonId(e.target.value ? Number(e.target.value) : null)}
                  className="tablon-select"
                >
                  <option value="">Todos los tablones</option>
                  {tablones.map((tablon) => (
                    <option key={tablon.id} value={tablon.id}>
                      {tablon.icono} {tablon.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <Button 
              variant="secondary" 
              icon={LayoutGrid}
              onClick={() => setViewMode(viewMode === 'kanban' ? 'stats' : 'kanban')}
            >
              {viewMode === 'kanban' ? 'Ver Estadísticas' : 'Ver Tablero'}
            </Button>
            <Button variant="primary" icon={Plus} onClick={handleNewTicket}>
              Nuevo Ticket
            </Button>
          </>
        }
      />

      {selectedTablonData && tieneMultiplesTablenes && (
        <div 
          className="tablon-info-banner"
          style={{ borderLeftColor: selectedTablonData.color || coloresTema.primary }}
        >
          <span className="tablon-icon" style={{ color: selectedTablonData.color }}>
            {selectedTablonData.icono}
          </span>
          <div className="tablon-details">
            <strong>{selectedTablonData.nombre}</strong>
            {selectedTablonData.descripcion && (
              <span className="tablon-description">{selectedTablonData.descripcion}</span>
            )}
          </div>
        </div>
      )}

      {viewMode === 'kanban' ? (
        <div className="dashboard-kanban-section">
          <KanbanBoard 
            onTicketClick={handleTicketClick} 
            tablonId={selectedTablonId}
            tablones={tablones}
          />
        </div>
      ) : (
        <>
          <div className="dashboard-metrics">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <Card key={index} padding="medium" className="dashboard-metric-card">
                  <div className="metric-content">
                    <div className={`metric-icon metric-icon-${metric.color}`}>
                      <Icon size={28} />
                    </div>
                    <div className="metric-info">
                      <p className="metric-label">{metric.label}</p>
                      <div className="metric-value-row">
                        <p className="metric-value">{metric.value}</p>
                        <span className={`metric-trend ${metric.trend.startsWith('+') ? 'positive' : 'negative'}`}>
                          <TrendingUp size={14} />
                          {metric.trend}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="dashboard-grid">
            <Card 
              title="Tickets Recientes" 
              padding="none"
              className="dashboard-card"
            >
              <div className="recent-tickets">
                {dashboardData?.ticketsRecientes?.length > 0 ? (
                  dashboardData.ticketsRecientes.map((ticket) => (
                    <div 
                      key={ticket.id} 
                      className="recent-ticket-item"
                      onClick={() => navigate(`/soporte/tickets/${ticket.id}`)}
                    >
                      <div className="recent-ticket-info">
                        <span className="recent-ticket-id">#{ticket.id}</span>
                        <span className="recent-ticket-title">{ticket.titulo}</span>
                      </div>
                      <span className="recent-ticket-status">{ticket.estado}</span>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>No hay tickets recientes</p>
                  </div>
                )}
              </div>
            </Card>

            <Card 
              title="Actividad del Equipo" 
              padding="medium"
              className="dashboard-card"
            >
              <div className="team-activity">
                {dashboardData?.actividadEquipo?.length > 0 ? (
                  dashboardData.actividadEquipo.map((member, index) => (
                    <div key={index} className="team-member-activity">
                      <div className="team-member-info">
                        <span className="team-member-name">{member.nombre}</span>
                        <span className="team-member-role">{member.rol}</span>
                      </div>
                      <span className="team-member-tickets">{member.ticketsAsignados} tickets</span>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>No hay actividad del equipo</p>
                  </div>
                )}
              </div>
            </Card>

            <Card 
              title="SLA Overview" 
              padding="medium"
              className="dashboard-card dashboard-sla"
            >
              <div className="sla-overview">
                <div className="sla-stat">
                  <span className="sla-stat-label">Cumplimiento SLA</span>
                  <span className="sla-stat-value">{stats?.cumplimientoSLA || 0}%</span>
                  <div className="sla-progress-bar">
                    <div 
                      className="sla-progress-fill"
                      style={{ width: `${stats?.cumplimientoSLA || 0}%` }}
                    />
                  </div>
                </div>
                <div className="sla-breakdown">
                  <div className="sla-breakdown-item">
                    <span>✓ En tiempo</span>
                    <span>{stats?.slaEnTiempo || 0}</span>
                  </div>
                  <div className="sla-breakdown-item warning">
                    <span>⚠ En riesgo</span>
                    <span>{stats?.slaEnRiesgo || 0}</span>
                  </div>
                  <div className="sla-breakdown-item danger">
                    <span>✗ Incumplidos</span>
                    <span>{stats?.slaIncumplidos || 0}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}

      {selectedTicket && (
        <TicketDetailModal 
          ticket={selectedTicket} 
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default SupportDashboard;
