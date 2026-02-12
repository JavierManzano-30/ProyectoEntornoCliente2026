import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Plus, X } from 'lucide-react';
import { bpmService } from '../services/bpmService';
import './TaskCreateForm.css';

const INITIAL_FORM = (defaultAssignee) => ({
  processId: '',
  activityId: '',
  status: 'pending',
  dueDate: '',
  assignedTo: defaultAssignee || ''
});

const TaskCreateForm = () => {
  const navigate = useNavigate();
  const defaultUserId = useMemo(() => localStorage.getItem('userId') || '', []);

  const [form, setForm] = useState(() => INITIAL_FORM(defaultUserId));
  const [processes, setProcesses] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const loadProcesses = async () => {
      try {
        const data = await bpmService.getAllProcesses();
        if (!mounted) return;
        setProcesses(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!mounted) return;
        setError('No se pudieron cargar los procesos.');
      }
    };
    loadProcesses();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadActivities = async () => {
      if (!form.processId) {
        setActivities([]);
        setForm((prev) => ({ ...prev, activityId: '' }));
        return;
      }

      setLoadingActivities(true);
      try {
        const data = await bpmService.getProcessActivities(form.processId);
        if (!mounted) return;
        const list = Array.isArray(data) ? data : [];
        setActivities(list);
        if (list.length === 0) {
          setForm((prev) => ({ ...prev, activityId: '' }));
        } else if (!list.some((activity) => activity.id === form.activityId)) {
          setForm((prev) => ({ ...prev, activityId: list[0].id }));
        }
      } catch (err) {
        if (!mounted) return;
        setActivities([]);
        setForm((prev) => ({ ...prev, activityId: '' }));
        setError('No se pudieron cargar las actividades del proceso.');
      } finally {
        if (mounted) {
          setLoadingActivities(false);
        }
      }
    };
    loadActivities();
    return () => {
      mounted = false;
    };
  }, [form.processId, form.activityId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.processId) {
      setError('Selecciona un proceso.');
      return;
    }
    if (!form.activityId) {
      setError('Selecciona una actividad.');
      return;
    }

    setLoading(true);
    try {
      await bpmService.createTask({
        processId: form.processId,
        activityId: form.activityId,
        status: form.status,
        assignedTo: form.assignedTo || null,
        startedBy: defaultUserId || null,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null
      });
      navigate('/bpm/tareas');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la tarea.');
      console.error('Error creating BPM task:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-create-page">
      <div className="task-create-header">
        <h1>Nueva Tarea BPM</h1>
        <p>Crea una tarea manual y asociala a un proceso y actividad</p>
      </div>

      {error && (
        <div className="task-create-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form className="task-create-card" onSubmit={handleSubmit}>
        <div className="task-create-grid">
          <label className="task-create-field">
            <span>Proceso *</span>
            <select name="processId" value={form.processId} onChange={handleChange} required>
              <option value="">Selecciona un proceso</option>
              {processes.map((process) => (
                <option key={process.id} value={process.id}>
                  {process.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="task-create-field">
            <span>Actividad *</span>
            <select
              name="activityId"
              value={form.activityId}
              onChange={handleChange}
              required
              disabled={!form.processId || loadingActivities}
            >
              <option value="">{loadingActivities ? 'Cargando...' : 'Selecciona una actividad'}</option>
              {activities.map((activity) => (
                <option key={activity.id} value={activity.id}>
                  {activity.name}
                </option>
              ))}
            </select>
          </label>

          <label className="task-create-field">
            <span>Estado</span>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="pending">Pendiente</option>
              <option value="in_progress">En progreso</option>
            </select>
          </label>

          <label className="task-create-field">
            <span>Fecha limite</span>
            <input
              type="datetime-local"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
            />
          </label>

          <label className="task-create-field">
            <span>Asignar a (User ID)</span>
            <input
              type="text"
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
              placeholder="userId"
            />
          </label>
        </div>

        <div className="task-create-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/bpm/tareas')}
            disabled={loading}
          >
            <X size={16} />
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            <Plus size={16} />
            {loading ? 'Creando...' : 'Crear Tarea'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskCreateForm;
