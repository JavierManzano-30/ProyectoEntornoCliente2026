/**
 * Página de bandeja de tareas
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskInbox } from '../hooks/useTaskInbox';
import { TASK_PRIORITY_LABELS } from '../constants/taskPriority';
import { TASK_STATUS_LABELS } from '../constants/taskStatus';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';
import SLAProgressBar from '../components/shared/SLAProgressBar';
import './TaskInbox.css';

const TaskInbox = () => {
  const navigate = useNavigate();
  const { tasks, stats, loading, filters, setFilters } = useTaskInbox();
  const [selectedTab, setSelectedTab] = useState('pending');

  const isTaskOverdue = (task) => {
    if (!task?.fecha_limite) return false;
    return new Date(task.fecha_limite) < new Date() && task.estado !== 'completed';
  };

  const filteredTasks = tasks.filter(task => {
    if (selectedTab === 'pending') {
      return (task.estado === 'assigned' || task.estado === 'pending') && !isTaskOverdue(task);
    }
    if (selectedTab === 'inProgress') {
      return task.estado === 'in_progress' && !isTaskOverdue(task);
    }
    if (selectedTab === 'overdue') {
      return isTaskOverdue(task);
    }
    return true;
  });

  return (
    <div className="task-inbox">
      <div className="inbox-header">
        <div className="inbox-header-content">
          <h1>Mis Tareas</h1>
          <p className="subtitle">Bandeja de tareas y aprobaciones</p>
        </div>
        <button
          className="btn-action btn-create-task"
          onClick={() => navigate('/bpm/tareas/nueva')}
        >
          Nueva Tarea
        </button>
      </div>

      <div className="inbox-stats">
        <div className="stat-item">
          <div className="stat-icon stat-pending">
            <Clock size={20} />
          </div>
          <div>
            <p className="stat-label">Pendientes</p>
            <p className="stat-value">{stats.pending}</p>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon stat-progress">
            <AlertCircle size={20} />
          </div>
          <div>
            <p className="stat-label">En Progreso</p>
            <p className="stat-value">{stats.inProgress}</p>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon stat-overdue">
            <AlertCircle size={20} />
          </div>
          <div>
            <p className="stat-label">Vencidas</p>
            <p className="stat-value">{stats.overdue}</p>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon stat-total">
            <CheckCircle size={20} />
          </div>
          <div>
            <p className="stat-label">Total</p>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>
      </div>

      <div className="inbox-tabs">
        <button
          className={`tab-btn ${selectedTab === 'pending' ? 'active' : ''}`}
          onClick={() => setSelectedTab('pending')}
        >
          Pendientes ({stats.pending})
        </button>
        <button
          className={`tab-btn ${selectedTab === 'inProgress' ? 'active' : ''}`}
          onClick={() => setSelectedTab('inProgress')}
        >
          En Progreso ({stats.inProgress})
        </button>
        <button
          className={`tab-btn ${selectedTab === 'overdue' ? 'active' : ''}`}
          onClick={() => setSelectedTab('overdue')}
        >
          Vencidas ({stats.overdue})
        </button>
      </div>

      <div className="task-list">
        {loading ? (
          <p className="loading">Cargando tareas...</p>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            <CheckCircle size={48} />
            <p>No hay tareas en esta categoría</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className="task-item">
              <div className="task-header">
                <h3 className="task-title">{task.nombre}</h3>
                <span className={`task-priority priority-${task.prioridad}`}>
                  {TASK_PRIORITY_LABELS[task.prioridad]}
                </span>
              </div>

              <p className="task-process">{task.proceso_nombre}</p>

              <div className="task-body">
                <p className="task-description">{task.descripcion}</p>
              </div>

              {task.fecha_limite && (
                <SLAProgressBar
                  item={task}
                  showDetails={false}
                  size="small"
                />
              )}

              <div className="task-footer">
                <span className="task-status">
                  {isTaskOverdue(task) ? 'Vencida' : TASK_STATUS_LABELS[task.estado]}
                </span>
                <button
                  className="btn-action"
                  onClick={() => navigate(`/bpm/tareas/${task.id}`)}
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskInbox;
