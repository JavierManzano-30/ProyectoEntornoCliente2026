import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import { createTask, getProjects, getTask, updateTask } from '../services/almService';
import './TaskForm.css';

const INITIAL_FORM = {
  proyectoId: '',
  nombre: '',
  descripcion: '',
  estado: 'pendiente',
  prioridad: 'media',
  asignadoA: '',
  fechaVencimiento: '',
  horasEstimadas: '',
};

const ALLOWED_STATUS = ['pendiente', 'en_progreso', 'completada'];
const ALLOWED_PRIORITY = ['baja', 'media', 'alta'];

const toInputDate = (value) => {
  if (!value) return '';
  const raw = String(value);
  return raw.includes('T') ? raw.split('T')[0] : raw;
};

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedProjectId = searchParams.get('proyectoId') || '';
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const pageTitle = useMemo(
    () => (isEditMode ? 'Editar Tarea' : 'Nueva Tarea'),
    [isEditMode]
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setLoadError('');

        const requests = [getProjects()];
        if (isEditMode) {
          requests.push(getTask(id));
        }

        const [projectsResponse, taskResponse] = await Promise.all(requests);
        const projectRows = projectsResponse.data || [];
        setProjects(projectRows);

        if (taskResponse?.data) {
          const task = taskResponse.data;
          setFormData({
            proyectoId: task.proyectoId || '',
            nombre: task.nombre || '',
            descripcion: task.descripcion || '',
            estado: ALLOWED_STATUS.includes(task.estado) ? task.estado : 'pendiente',
            prioridad: ALLOWED_PRIORITY.includes(task.prioridad) ? task.prioridad : 'media',
            asignadoA: task.asignadoA && task.asignadoA !== '-' ? task.asignadoA : '',
            fechaVencimiento: toInputDate(task.fechaVencimiento),
            horasEstimadas: task.horasEstimadas ? String(task.horasEstimadas) : '',
          });
          return;
        }

        const fallbackProject = projectRows[0]?.id || '';
        setFormData((prev) => ({
          ...prev,
          proyectoId: preselectedProjectId || fallbackProject,
        }));
      } catch (error) {
        setLoadError(error.response?.data?.error?.message || error.message || 'Error al cargar el formulario');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isEditMode, preselectedProjectId]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: '' }));
    setSubmitError('');
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.proyectoId) nextErrors.proyectoId = 'Selecciona un proyecto';
    if (!formData.nombre.trim()) nextErrors.nombre = 'El nombre es obligatorio';
    if (!ALLOWED_STATUS.includes(formData.estado)) nextErrors.estado = 'Estado no válido';
    if (!ALLOWED_PRIORITY.includes(formData.prioridad)) nextErrors.prioridad = 'Prioridad no válida';

    if (formData.horasEstimadas !== '') {
      const hours = Number(formData.horasEstimadas);
      if (!Number.isFinite(hours) || hours < 0) {
        nextErrors.horasEstimadas = 'Introduce un número válido';
      }
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      setSubmitError('');

      const payload = {
        proyectoId: formData.proyectoId,
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || null,
        estado: formData.estado,
        prioridad: formData.prioridad,
        asignadoA: formData.asignadoA.trim() || null,
        fechaVencimiento: formData.fechaVencimiento || null,
        horasEstimadas:
          formData.horasEstimadas === '' ? null : Number(formData.horasEstimadas),
      };

      if (isEditMode) {
        await updateTask(id, payload);
      } else {
        await createTask(payload);
      }

      navigate('/alm/tareas');
    } catch (error) {
      setSubmitError(error.response?.data?.error?.message || error.message || 'No se pudo guardar la tarea');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/alm/tareas');
  };

  if (loading) return <LoadingSpinner fullScreen text="Cargando formulario..." />;
  if (loadError) return <ErrorMessage message={loadError} fullScreen />;

  return (
    <div className="task-form-page">
      <PageHeader
        title={pageTitle}
        subtitle={isEditMode ? 'Actualiza la información de la tarea' : 'Completa la información para crear una nueva tarea'}
      />

      <form onSubmit={handleSubmit}>
        <Card padding="large">
          {submitError && <div className="task-form-submit-error">{submitError}</div>}

          <div className="task-form-grid">
            <div className="task-form-group">
              <label htmlFor="proyectoId">Proyecto *</label>
              <select
                id="proyectoId"
                value={formData.proyectoId}
                onChange={handleChange('proyectoId')}
                disabled={submitting}
              >
                <option value="">Selecciona un proyecto</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.nombre}
                  </option>
                ))}
              </select>
              {formErrors.proyectoId && <p className="task-form-field-error">{formErrors.proyectoId}</p>}
            </div>

            <div className="task-form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                id="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleChange('nombre')}
                disabled={submitting}
              />
              {formErrors.nombre && <p className="task-form-field-error">{formErrors.nombre}</p>}
            </div>

            <div className="task-form-group task-form-full-width">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                rows={4}
                value={formData.descripcion}
                onChange={handleChange('descripcion')}
                disabled={submitting}
              />
            </div>

            <div className="task-form-group">
              <label htmlFor="estado">Estado *</label>
              <select
                id="estado"
                value={formData.estado}
                onChange={handleChange('estado')}
                disabled={submitting}
              >
                <option value="pendiente">Pendiente</option>
                <option value="en_progreso">En progreso</option>
                <option value="completada">Completada</option>
              </select>
              {formErrors.estado && <p className="task-form-field-error">{formErrors.estado}</p>}
            </div>

            <div className="task-form-group">
              <label htmlFor="prioridad">Prioridad *</label>
              <select
                id="prioridad"
                value={formData.prioridad}
                onChange={handleChange('prioridad')}
                disabled={submitting}
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
              {formErrors.prioridad && <p className="task-form-field-error">{formErrors.prioridad}</p>}
            </div>

            <div className="task-form-group">
              <label htmlFor="asignadoA">Asignada a</label>
              <input
                id="asignadoA"
                type="text"
                value={formData.asignadoA}
                onChange={handleChange('asignadoA')}
                disabled={submitting}
                placeholder="Ej: designer-1"
              />
            </div>

            <div className="task-form-group">
              <label htmlFor="fechaVencimiento">Fecha de vencimiento</label>
              <input
                id="fechaVencimiento"
                type="date"
                value={formData.fechaVencimiento}
                onChange={handleChange('fechaVencimiento')}
                disabled={submitting}
              />
            </div>

            <div className="task-form-group">
              <label htmlFor="horasEstimadas">Horas estimadas</label>
              <input
                id="horasEstimadas"
                type="number"
                min="0"
                step="1"
                value={formData.horasEstimadas}
                onChange={handleChange('horasEstimadas')}
                disabled={submitting}
                placeholder="0"
              />
              {formErrors.horasEstimadas && <p className="task-form-field-error">{formErrors.horasEstimadas}</p>}
            </div>
          </div>

          <div className="task-form-actions">
            <Button
              type="button"
              variant="secondary"
              icon={X}
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={Save}
              loading={submitting}
            >
              {isEditMode ? 'Guardar Cambios' : 'Crear Tarea'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default TaskForm;
