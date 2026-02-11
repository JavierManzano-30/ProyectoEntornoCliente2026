/**
 * Componente de tarjeta individual de tarea
 */

import React, { useState } from 'react';
import { TASK_STATUS_LABELS, TASK_STATUS_COLORS } from '../../constants/taskStatus';
import { TASK_PRIORITY_LABELS } from '../../constants/taskPriority';
import { MoreVertical, Clock, AlertTriangle } from 'lucide-react';
import './TaskCard.css';

const TaskCard = ({
  task,
  onComplete,
  onTransfer,
  onView,
  showProcess = true
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const isPastDue = task.fecha_limite && new Date(task.fecha_limite) < new Date();
  const statusColor = TASK_STATUS_COLORS[task.estado] || '#9ca3af';
  const priorityClass = `priority-${task.prioridad}`.toLowerCase();

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="task-card">
      <div className="task-card-header">
        <div className="task-card-title-group">
          <h3 className="task-card-title">{task.nombre}</h3>
          <span className={`priority-badge ${priorityClass}`}>
            {TASK_PRIORITY_LABELS[task.prioridad]}
          </span>
        </div>
        <div className="task-card-menu" onClick={handleMenuClick}>
          <button className="menu-btn">
            <MoreVertical size={18} />
          </button>
          {menuOpen && (
            <div className="dropdown-menu">
              <button onClick={() => { onView && onView(task); setMenuOpen(false); }}>
                Ver Detalles
              </button>
              {task.estado !== 'completed' && (
                <>
                  <button onClick={() => { onComplete && onComplete(task); setMenuOpen(false); }}>
                    Completar
                  </button>
                  <button onClick={() => { onTransfer && onTransfer(task); setMenuOpen(false); }}>
                    Transferir
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {showProcess && (
        <p className="task-card-process">{task.proceso_nombre}</p>
      )}

      <div className="task-card-body">
        <p className="task-card-description">{task.descripcion}</p>
      </div>

      <div className="task-card-footer">
        <div className="task-status-group">
          <span
            className="status-badge"
            style={{ backgroundColor: `${statusColor}20`, color: statusColor }}
          >
            {TASK_STATUS_LABELS[task.estado]}
          </span>
        </div>

        {task.fecha_limite && (
          <div className={`task-deadline ${isPastDue ? 'overdue' : ''}`}>
            <Clock size={14} />
            <span>{formatDate(task.fecha_limite)}</span>
            {isPastDue && <AlertTriangle size={14} />}
          </div>
        )}
      </div>

      {task.asignado_a && (
        <div className="task-assignee">
          <div className="avatar">{task.asignado_a.charAt(0)}</div>
          <span>{task.asignado_a}</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
