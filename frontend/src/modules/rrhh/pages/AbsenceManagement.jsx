import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAbsences } from '../hooks/useAbsences';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import { Plus, Calendar, Filter, CheckCircle, XCircle, Clock } from 'lucide-react';
import { ABSENCE_TYPE_LABELS, ABSENCE_STATUS_LABELS, ABSENCE_STATUS_COLORS } from '../constants/absenceTypes';
import { calculateWorkDays } from '../utils/absenceCalculations';
import './AbsenceManagement.css';

const AbsenceManagement = () => {
  const navigate = useNavigate();
  const {
    absences,
    loading,
    error,
    filters,
    setFilters,
    stats,
    handleApprove,
    handleReject,
    refetch,
  } = useAbsences();

  const [showFilters, setShowFilters] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleNewAbsence = () => {
    navigate('/rrhh/ausencias/nueva');
  };

  const onApprove = async (id) => {
    try {
      setProcessingId(id);
      await handleApprove(id);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const onReject = async (id) => {
    const reason = prompt('Motivo del rechazo:');
    if (!reason) return;

    try {
      setProcessingId(id);
      await handleReject(id, reason);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Cargando ausencias..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} fullScreen />;

  const metrics = [
    {
      label: 'Total Ausencias',
      value: stats?.total || 0,
      icon: Calendar,
      color: 'blue',
    },
    {
      label: 'Pendientes',
      value: stats?.pending || 0,
      icon: Clock,
      color: 'warning',
    },
    {
      label: 'Aprobadas',
      value: stats?.approved || 0,
      icon: CheckCircle,
      color: 'success',
    },
    {
      label: 'Rechazadas',
      value: stats?.rejected || 0,
      icon: XCircle,
      color: 'error',
    },
  ];

  return (
    <div className="absence-management-page">
      <PageHeader
        title="Gestión de Ausencias"
        subtitle="Administra las ausencias y vacaciones de los empleados"
        actions={
          <Button variant="primary" icon={Plus} onClick={handleNewAbsence}>
            Nueva Ausencia
          </Button>
        }
      />

      {/* Métricas */}
      <div className="absence-metrics">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} padding="medium" className="absence-metric-card">
              <div className="metric-content">
                <div className={`metric-icon metric-icon-${metric.color}`}>
                  <Icon size={24} />
                </div>
                <div className="metric-info">
                  <p className="metric-label">{metric.label}</p>
                  <p className="metric-value">{metric.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filtros */}
      <Card padding="medium" className="absence-filters-card">
        <div className="filters-header">
          <h3>Filtros</h3>
          <Button
            variant="secondary"
            icon={Filter}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Ocultar' : 'Mostrar'}
          </Button>
        </div>

        {showFilters && (
          <div className="filters-grid">
            <div className="filter-item">
              <label>Tipo</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="">Todos</option>
                <option value="vacation">Vacaciones</option>
                <option value="sick_leave">Baja por Enfermedad</option>
                <option value="personal">Asunto Personal</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <div className="filter-item">
              <label>Estado</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">Todos</option>
                <option value="pending">Pendiente</option>
                <option value="approved">Aprobada</option>
                <option value="rejected">Rechazada</option>
              </select>
            </div>
            <div className="filter-item">
              <label>Desde</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>
            <div className="filter-item">
              <label>Hasta</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Lista de ausencias */}
      <Card padding="none" className="absence-list-card">
        <div className="table-container">
          <table className="absence-table">
            <thead>
              <tr>
                <th>Empleado</th>
                <th>Tipo</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Días</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {absences.length > 0 ? (
                absences.map((absence) => (
                  <tr key={absence.id} className="absence-row">
                    <td>
                      <div className="employee-info">
                        <span className="employee-name">{absence.employeeName || '-'}</span>
                      </div>
                    </td>
                    <td>{ABSENCE_TYPE_LABELS[absence.type] || absence.type}</td>
                    <td>{new Date(absence.startDate).toLocaleDateString('es-ES')}</td>
                    <td>{new Date(absence.endDate).toLocaleDateString('es-ES')}</td>
                    <td>{calculateWorkDays(absence.startDate, absence.endDate)} días</td>
                    <td>
                      <Badge variant={ABSENCE_STATUS_COLORS[absence.status]}>
                        {ABSENCE_STATUS_LABELS[absence.status]}
                      </Badge>
                    </td>
                    <td>
                      {absence.status === 'pending' && (
                        <div className="action-buttons">
                          <Button
                            variant="success"
                            size="small"
                            icon={CheckCircle}
                            onClick={() => onApprove(absence.id)}
                            disabled={processingId === absence.id}
                          >
                            Aprobar
                          </Button>
                          <Button
                            variant="error"
                            size="small"
                            icon={XCircle}
                            onClick={() => onReject(absence.id)}
                            disabled={processingId === absence.id}
                          >
                            Rechazar
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state">
                    <p>No se encontraron ausencias</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AbsenceManagement;
