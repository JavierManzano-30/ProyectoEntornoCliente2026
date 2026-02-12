import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Clock, User, Workflow } from 'lucide-react';
import { useTask } from '../hooks/useTask';
import { TASK_PRIORITY_LABELS } from '../constants/taskPriority';
import { TASK_STATUS_LABELS } from '../constants/taskStatus';
import './TaskDetail.css';

const formatDate = (value) => {
  if (!value) return 'No definida';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('es-ES');
};

const toDateTimeLocal = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

const TaskDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { task, loading, error, updateTask } = useTask(id);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState('');
  const [dueDateInput, setDueDateInput] = useState('');

  const isOverdue = useMemo(() => {
    if (!task?.fecha_limite) return false;
    return new Date(task.fecha_limite) < new Date() && task.estado !== 'completed';
  }, [task]);

  useEffect(() => {
    setDueDateInput(toDateTimeLocal(task?.fecha_limite));
  }, [task?.fecha_limite]);

  const executeUpdate = async (patch) => {
    setSaving(true);
    setActionError('');
    try {
      await updateTask(patch);
    } catch (err) {
      setActionError(err?.response?.data?.message || 'No se pudo actualizar la tarea.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDueDate = async () => {
    await executeUpdate({
      dueDate: dueDateInput ? new Date(dueDateInput).toISOString() : null
    });
  };

  const handleMarkOverdue = async () => {
    const overdueIso = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const patch = {
      dueDate: overdueIso
    };

    if (task?.estado === 'completed') {
      patch.status = 'pending';
    }

    await executeUpdate(patch);
  };

  if (loading) {
    return (
      <div className="task-detail-page">
        <p className="task-detail-loading">Cargando tarea...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-detail-page">
        <div className="task-detail-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="task-detail-page">
        <div className="task-detail-error">
          <AlertCircle size={20} />
          <span>No se encontro la tarea</span>
        </div>
      </div>
    );
  }

  return (
    <div className="task-detail-page">
      <div className="task-detail-header">
        <button className="btn-secondary" onClick={() => navigate('/bpm/tareas')}>
          <ArrowLeft size={16} />
          Volver a tareas
        </button>
      </div>

      <div className="task-detail-card">
        <div className="task-detail-title-row">
          <h1>{task.nombre}</h1>
          <span className={`task-priority-chip priority-${task.prioridad}`}>
            {TASK_PRIORITY_LABELS[task.prioridad] || task.prioridad}
          </span>
        </div>

        <p className="task-detail-description">
          {task.descripcion || 'Sin descripcion'}
        </p>

        <div className="task-actions-panel">
          <div className="task-status-actions">
            <button
              type="button"
              className="btn-action-secondary"
              onClick={() => executeUpdate({ status: 'pending' })}
              disabled={saving || task.estado === 'pending'}
            >
              Poner Pendiente
            </button>
            <button
              type="button"
              className="btn-action-secondary"
              onClick={() => executeUpdate({ status: 'in_progress' })}
              disabled={saving || task.estado === 'in_progress'}
            >
              Pasar a En Progreso
            </button>
            <button
              type="button"
              className="btn-action-primary"
              onClick={() => executeUpdate({ status: 'completed' })}
              disabled={saving || task.estado === 'completed'}
            >
              Marcar Completada
            </button>
          </div>

          <div className="task-due-controls">
            <input
              type="datetime-local"
              value={dueDateInput}
              onChange={(event) => setDueDateInput(event.target.value)}
              disabled={saving}
            />
            <button
              type="button"
              className="btn-action-secondary"
              onClick={handleSaveDueDate}
              disabled={saving}
            >
              Guardar fecha limite
            </button>
            <button
              type="button"
              className="btn-action-danger"
              onClick={handleMarkOverdue}
              disabled={saving}
            >
              Marcar Vencida
            </button>
          </div>

          {actionError && (
            <div className="task-detail-error task-detail-error-inline">
              <AlertCircle size={16} />
              <span>{actionError}</span>
            </div>
          )}

          <p className="task-action-help">
            Una tarea aparece como vencida cuando su fecha limite ya paso y no esta completada.
          </p>
        </div>

        <div className="task-detail-grid">
          <div className="task-detail-item">
            <Workflow size={16} />
            <div>
              <span className="label">Proceso</span>
              <span className="value">{task.proceso_nombre || 'No disponible'}</span>
            </div>
          </div>

          <div className="task-detail-item">
            <Clock size={16} />
            <div>
              <span className="label">Vencimiento</span>
              <span className="value">{formatDate(task.fecha_limite)}</span>
            </div>
          </div>

          <div className="task-detail-item">
            <User size={16} />
            <div>
              <span className="label">Asignada a</span>
              <span className="value">{task.asignado_a || 'Sin asignar'}</span>
            </div>
          </div>

          <div className="task-detail-item">
            <AlertCircle size={16} />
            <div>
              <span className="label">Estado</span>
              <span className={`value ${isOverdue ? 'value-overdue' : ''}`}>
                {isOverdue ? 'Vencida' : TASK_STATUS_LABELS[task.estado] || task.estado}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
