import React, { useState, useEffect } from "react";
import { 
  Bell,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Check,
  Info
} from "lucide-react";
import { useBIContext } from "../context/BIContext";
import PageHeader from "../../../components/common/PageHeader";
import Card from "../../../components/common/Card";
import "./AlertsPage.css";

const AlertsPage = () => {
  const { usuario, getAlerts, markAlertAsRead } = useBIContext();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todas');

  useEffect(() => {
    loadAlerts();
  }, [usuario.empresaId]);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await getAlerts(usuario.empresaId);
      setAlerts(data);
    } catch (error) {
      console.error('Error al cargar alertas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (alertId) => {
    try {
      await markAlertAsRead(alertId);
      await loadAlerts();
    } catch (error) {
      console.error('Error al marcar alerta como leída:', error);
    }
  };

  const getTypeIcon = (tipo) => {
    switch (tipo) {
      case 'warning':
        return <AlertTriangle size={24} />;
      case 'error':
        return <XCircle size={24} />;
      case 'success':
        return <CheckCircle size={24} />;
      case 'info':
        return <Info size={24} />;
      default:
        return <Bell size={24} />;
    }
  };

  const getTypeClass = (tipo) => {
    switch (tipo) {
      case 'warning':
        return 'alert-warning';
      case 'error':
        return 'alert-error';
      case 'success':
        return 'alert-success';
      case 'info':
        return 'alert-info';
      default:
        return 'alert-info';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'todas') return true;
    if (filter === 'leidas') return alert.leida;
    if (filter === 'no_leidas') return !alert.leida;
    return alert.tipo === filter;
  });

  const statusFilters = [
    { key: 'todas', label: 'Todas' },
    { key: 'no_leidas', label: 'Sin Leer' },
    { key: 'leidas', label: 'Leídas' },
  ];

  const typeFilters = [
    { key: 'error', label: 'Errores' },
    { key: 'warning', label: 'Advertencias' },
    { key: 'success', label: 'Éxito' },
    { key: 'info', label: 'Información' },
  ];

  if (loading) {
    return (
      <div className="alerts-page-loading">
        <div className="spinner"></div>
        <p>Cargando alertas...</p>
      </div>
    );
  }

  const unreadCount = alerts.filter(a => !a.leida).length;

  return (
    <div className="alerts-page">
      <PageHeader
        title="Alertas y Umbrales"
        subtitle="Configura alertas automáticas y umbrales para monitorizar KPIs y eventos clave"
        actions={null}
      />

      <div className="alerts-summary">
        <Card className="summary-card">
          <Bell size={24} className="summary-icon" />
          <div className="summary-info">
            <span className="summary-value">{alerts.length}</span>
            <span className="summary-label">Total Alertas</span>
          </div>
        </Card>
        <Card className="summary-card">
          <AlertTriangle size={24} className="summary-icon warning" />
          <div className="summary-info">
            <span className="summary-value">{unreadCount}</span>
            <span className="summary-label">Sin Leer</span>
          </div>
        </Card>
        <Card className="summary-card">
          <CheckCircle size={24} className="summary-icon success" />
          <div className="summary-info">
            <span className="summary-value">{alerts.length - unreadCount}</span>
            <span className="summary-label">Leídas</span>
          </div>
        </Card>
      </div>

      <Card style={{ marginBottom: '2rem', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          {statusFilters.map((option) => (
            <button
              key={option.key}
              type="button"
              className={`filter-btn${filter === option.key ? ' active' : ''}`}
              onClick={() => setFilter(option.key)}
            >
              {option.label}
            </button>
          ))}
          <div className="filter-divider" />
          {typeFilters.map((option) => (
            <button
              key={option.key}
              type="button"
              className={`filter-btn${filter === option.key ? ' active' : ''}`}
              onClick={() => setFilter(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Card>

      <div className="alerts-list">
        {filteredAlerts.map((alert) => (
          <Card key={alert.id} className={`alert-card ${getTypeClass(alert.tipo)} ${alert.leida ? 'read' : 'unread'}`}>
            <div className="alert-icon">
              {getTypeIcon(alert.tipo)}
            </div>
            <div className="alert-content">
              <div className="alert-header">
                <h3>{alert.titulo}</h3>
                {!alert.leida && <span className="unread-badge">Nueva</span>}
              </div>
              <p className="alert-message">{alert.mensaje}</p>
              <div className="alert-footer">
                <div className="alert-time">
                  <Clock size={14} />
                  <span>{alert.fecha}</span>
                </div>
              </div>
            </div>
            {!alert.leida && (
              <button 
                className="mark-read-btn"
                onClick={() => handleMarkAsRead(alert.id)}
                title="Marcar como leída"
              >
                <Check size={18} />
              </button>
            )}
          </Card>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="empty-state">
          <Bell size={48} />
          <h3>No hay alertas</h3>
          <p>No se encontraron alertas para los filtros seleccionados</p>
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
