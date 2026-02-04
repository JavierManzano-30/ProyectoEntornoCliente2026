import React, { useState, useEffect } from "react";
import { 
  Bell,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  Check,
  Info
} from "lucide-react";
import { useBIContext } from "../context/BIContext";
import PageHeader from "../../../components/common/PageHeader";
import Card from "../../../components/common/Card";
import "./AlertsPage.css";

const AlertsPage = () => {
  const { usuario, cambiarEmpresa, getAlerts, markAlertAsRead } = useBIContext();
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
        actions={
          <>
            <div className="empresa-selector-demo">
              <Building2 size={18} />
              <select 
                value={usuario.empresaId} 
                onChange={(e) => cambiarEmpresa(parseInt(e.target.value))}
                className="empresa-select"
              >
                <option value={1}>TechCorp Solutions</option>
                <option value={2}>InnovaDigital S.A.</option>
                <option value={3}>GlobalServices Ltd</option>
              </select>
            </div>
          </>
        }
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
          <button 
            style={{
              padding: '0.5rem 1rem',
              border: filter === 'todas' ? 'none' : '1px solid #e2e8f0',
              borderRadius: '6px',
              background: filter === 'todas' ? '#3b82f6' : 'white',
              color: filter === 'todas' ? 'white' : '#64748b',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onClick={() => setFilter('todas')}
          >
            Todas
          </button>
          <button 
            style={{
              padding: '0.5rem 1rem',
              border: filter === 'no_leidas' ? 'none' : '1px solid #e2e8f0',
              borderRadius: '6px',
              background: filter === 'no_leidas' ? '#3b82f6' : 'white',
              color: filter === 'no_leidas' ? 'white' : '#64748b',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onClick={() => setFilter('no_leidas')}
          >
            Sin Leer
          </button>
          <button 
            style={{
              padding: '0.5rem 1rem',
              border: filter === 'leidas' ? 'none' : '1px solid #e2e8f0',
              borderRadius: '6px',
              background: filter === 'leidas' ? '#3b82f6' : 'white',
              color: filter === 'leidas' ? 'white' : '#64748b',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onClick={() => setFilter('leidas')}
          >
            Leídas
          </button>
          <div style={{ width: '1px', height: '24px', background: '#e2e8f0', margin: '0 0.25rem' }}></div>
          <button 
            style={{
              padding: '0.5rem 1rem',
              border: filter === 'error' ? 'none' : '1px solid #e2e8f0',
              borderRadius: '6px',
              background: filter === 'error' ? '#3b82f6' : 'white',
              color: filter === 'error' ? 'white' : '#64748b',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onClick={() => setFilter('error')}
          >
            Errores
          </button>
          <button 
            style={{
              padding: '0.5rem 1rem',
              border: filter === 'warning' ? 'none' : '1px solid #e2e8f0',
              borderRadius: '6px',
              background: filter === 'warning' ? '#3b82f6' : 'white',
              color: filter === 'warning' ? 'white' : '#64748b',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onClick={() => setFilter('warning')}
          >
            Advertencias
          </button>
          <button 
            style={{
              padding: '0.5rem 1rem',
              border: filter === 'success' ? 'none' : '1px solid #e2e8f0',
              borderRadius: '6px',
              background: filter === 'success' ? '#3b82f6' : 'white',
              color: filter === 'success' ? 'white' : '#64748b',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onClick={() => setFilter('success')}
          >
            Éxito
          </button>
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
