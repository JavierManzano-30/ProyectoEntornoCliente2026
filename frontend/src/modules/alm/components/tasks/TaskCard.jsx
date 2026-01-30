import React from 'react';
import { formatHours, getTaskStatusLabel, getTaskPriorityLabel } from '../../utils/taskHelpers';
import { formatDate } from '../../utils/projectHelpers';
import { Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import './TaskCard.css';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange, compact = false }) => {
  const statusColor = {
    pendiente: '#ef4444',
    en_progreso: '#f59e0b',
    en_revision: '#3b82f6',
    completada: '#10b981',
    cancelada: '#6b7280'
  };

  const priorityColor = {
    baja: '#10b981',
    media: '#f59e0b',
    alta: '#ef4444',
    critica: '#7c3aed'
  };

  const isOverdue = new Date(task.fechaVencimiento) < new Date() && 
                    task.estado !== 'completada' && 
                    task.estado !== 'cancelada';

  return (
    <div className={`task-card ${isOverdue ? 'overdue' : ''} ${compact ? 'compact' : ''}`}>
      <div className="task-header">
        <div className="task-title-section">
          <h4 className="task-title">{task.nombre}</h4>
          <span 
            className="task-status-badge"
            style={{ backgroundColor: statusColor[task.estado] }}
            title={task.estado}
          >
            {task.estado.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <div className="task-actions">
          {task.estado !== 'completada' && task.estado !== 'cancelada' && (
            <button
              className="action-btn check-btn"
              onClick={() => onStatusChange(task.id, 'completada')}
              title="Marcar como completada"
            >
              <CheckCircle2 size={18} />
            </button>
          )}
          {onEdit && (
            <button
              className="action-btn edit-btn"
              onClick={() => onEdit(task.id)}
              title="Editar tarea"
            >
              <Edit2 size={18} />
            </button>
          )}
          {onDelete && (
            <button
              className="action-btn delete-btn"
              onClick={() => onDelete(task.id)}
              title="Eliminar tarea"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {!compact && task.descripcion && (
        <p className="task-description">{task.descripcion}</p>
      )}

      <div className="task-meta">
        <div className="meta-item">
          <span className="meta-label">Prioridad:</span>
          <span 
            className="priority-badge"
            style={{ color: priorityColor[task.prioridad] }}
          >
            {task.prioridad.charAt(0).toUpperCase() + task.prioridad.slice(1)}
          </span>
        </div>
        
        <div className="meta-item">
          <span className="meta-label">Asignada a:</span>
          <span className="meta-value">{task.asignadoA}</span>
        </div>
      </div>

      <div className="task-footer">
        <div className="hours-info">
          <span className="hours-label">Horas:</span>
          <span className="hours-value">
            {formatHours(task.horasTrabajadas)}/{formatHours(task.horasEstimadas)}
          </span>
        </div>
        
        {!compact && (
          <div className="due-date">
            <span className="due-label">Vencimiento:</span>
            <span className={`due-value ${isOverdue ? 'overdue-text' : ''}`}>
              {formatDate(task.fechaVencimiento)}
            </span>
          </div>
        )}

        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${Math.min((task.horasTrabajadas / task.horasEstimadas) * 100, 100)}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
