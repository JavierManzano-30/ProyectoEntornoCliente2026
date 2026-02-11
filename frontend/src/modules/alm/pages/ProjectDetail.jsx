import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '../hooks/useProject';
import { calculateProgress, formatDate } from '../utils/projectHelpers';
import { formatHours } from '../utils/taskHelpers';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import TaskCard from '../components/tasks/TaskCard';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { project, tasks, timeEntries, loading, error } = useProject(id);
  const [activeTab, setActiveTab] = useState('general');

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorMessage message={error} fullScreen />;
  if (!project) return <ErrorMessage message="Proyecto no encontrado" fullScreen />;

  const progress = calculateProgress(project.tareasCompletadas, project.tareasTotales);
  const horasTrabajadas = project.horasTrabajadas || 0;
  const horasEstimadas = project.horasEstimadas || 0;
  const totalTimeEntries = timeEntries.length;

  const getStatusColor = (status) => {
    const colors = {
      planificacion: '#3b82f6',
      en_curso: '#10b981',
      pausado: '#f59e0b',
      completado: '#10b981',
      cancelado: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div className="project-detail-page">
      <div className="detail-header">
        <button 
          className="back-btn"
          onClick={() => navigate('/alm/proyectos')}
          title="Volver a proyectos"
        >
          <ArrowLeft size={20} />
          <span>Volver</span>
        </button>
        
        <div className="header-content">
          <PageHeader
            title={project.nombre}
            subtitle={project.descripcion}
          />
          <div className="header-actions">
            <Button
              variant="secondary"
              icon={Edit2}
              onClick={() => navigate(`/alm/proyectos/${id}/editar`)}
              size="small"
            >
              Editar
            </Button>
            <Button
              variant="danger"
              icon={Trash2}
              onClick={() => {
                if (window.confirm('¿Estás seguro de eliminar este proyecto?')) {
                  navigate('/alm/proyectos');
                }
              }}
              size="small"
            >
              Eliminar
            </Button>
          </div>
        </div>
      </div>

      <div className="tabs">
        {['general', 'tareas', 'tiempos'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'general' && 'General'}
            {tab === 'tareas' && `Tareas (${tasks?.length || 0})`}
            {tab === 'tiempos' && `Tiempos (${totalTimeEntries})`}
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <div className="tab-content">
          <div className="detail-grid">
            <Card padding="large" className="info-card">
              <h3 className="card-title">Información General</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Estado</span>
                  <span 
                    className="info-badge"
                    style={{ backgroundColor: getStatusColor(project.estado) }}
                  >
                    {project.estado.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="info-item">
                  <span className="info-label">Responsable</span>
                  <span className="info-value">{project.responsableId}</span>
                </div>

                <div className="info-item">
                  <span className="info-label">Cliente</span>
                  <span className="info-value">{project.clienteId}</span>
                </div>

                <div className="info-item">
                  <span className="info-label">Fecha Inicio</span>
                  <span className="info-value">{formatDate(project.fechaInicio)}</span>
                </div>

                <div className="info-item">
                  <span className="info-label">Fecha Fin</span>
                  <span className="info-value">{formatDate(project.fechaFin)}</span>
                </div>

                <div className="info-item">
                  <span className="info-label">Presupuesto</span>
                  <span className="info-value">${project.presupuesto?.toLocaleString()}</span>
                </div>
              </div>
            </Card>

            <Card padding="large" className="metrics-card">
              <h3 className="card-title">Métricas</h3>
              
              <div className="metric">
                <div className="metric-header">
                  <span className="metric-label">Progreso del Proyecto</span>
                  <span className="metric-value">{progress}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="metric">
                <div className="metric-header">
                  <span className="metric-label">Horas Trabajadas</span>
                  <span className="metric-value">{horasTrabajadas} / {horasEstimadas} h</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill secondary"
                    style={{ width: `${Math.min((horasTrabajadas / horasEstimadas) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="metric-grid">
                <div className="metric-item">
                  <div className="metric-number">{project.tareasCompletadas || 0}</div>
                  <div className="metric-name">Tareas Completadas</div>
                </div>
                <div className="metric-item">
                  <div className="metric-number">{project.tareasTotales || 0}</div>
                  <div className="metric-name">Tareas Totales</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'tareas' && (
        <div className="tab-content">
          <Card padding="large">
            <div className="tasks-header">
              <h3 className="card-title">Tareas del Proyecto</h3>
              <Button variant="primary" size="small">
                Nueva Tarea
              </Button>
            </div>

            {tasks && tasks.length > 0 ? (
              <div className="tasks-list">
                {tasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={() => console.log('Status change')}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No hay tareas en este proyecto</p>
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'tiempos' && (
        <div className="tab-content">
          <Card padding="large">
            <h3 className="card-title">Registro de Tiempos</h3>

            {timeEntries && timeEntries.length > 0 ? (
              <div className="time-entries">
                {timeEntries.map(entry => (
                  <div key={entry.id} className="time-entry">
                    <div className="entry-info">
                      <span className="entry-date">{formatDate(entry.fecha)}</span>
                      <span className="entry-description">{entry.descripcion || 'Sin descripción'}</span>
                    </div>
                    <div className="entry-hours">{formatHours(entry.horas)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No hay registros de tiempo para este proyecto</p>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
