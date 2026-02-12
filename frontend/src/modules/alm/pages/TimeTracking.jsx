import React, { useMemo, useState } from 'react';
import { Plus, Calendar, Trash2, Edit2 } from 'lucide-react';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import { useTimeTracking } from '../hooks/useTimeTracking';
import { createTimeEntry, updateTimeEntry, deleteTimeEntry } from '../services/almService';
import './TimeTracking.css';

const initialFormData = () => ({
  proyectoId: '',
  tareaId: '',
  fecha: new Date().toISOString().split('T')[0],
  horas: '',
  descripcion: '',
});

const TimeTracking = () => {
  const { timeEntries, projects, tasks, stats, loading, error, refetch } = useTimeTracking();
  const [showForm, setShowForm] = useState(false);
  const [filterProject, setFilterProject] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormData());

  const filteredEntries = useMemo(() => {
    return timeEntries.filter((entry) => {
      const matchProject = filterProject === 'all' || String(entry.proyectoId) === filterProject;
      const matchDate = !filterDate || entry.fecha === filterDate;
      return matchProject && matchDate;
    });
  }, [timeEntries, filterProject, filterDate]);

  const availableTasks = useMemo(() => {
    if (!formData.proyectoId) return tasks;
    return tasks.filter((task) => String(task.proyectoId) === String(formData.proyectoId));
  }, [tasks, formData.proyectoId]);

  const entriesByDate = useMemo(() => {
    const grouped = {};
    filteredEntries.forEach((entry) => {
      if (!grouped[entry.fecha]) grouped[entry.fecha] = [];
      grouped[entry.fecha].push(entry);
    });
    return Object.entries(grouped).sort(([dateA], [dateB]) => dateB.localeCompare(dateA));
  }, [filteredEntries]);

  const totalHours = Number(stats.totalHoras || 0);
  const averageHours = Number(stats.promedioHoras || 0);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.tareaId || !formData.horas || !formData.fecha) {
      alert('Completa los campos obligatorios');
      return;
    }

    try {
      if (editingId) {
        await updateTimeEntry(editingId, formData);
      } else {
        await createTimeEntry(formData);
      }
      await refetch();
      setEditingId(null);
      setShowForm(false);
      setFormData(initialFormData());
    } catch (err) {
      console.error('Error saving time entry:', err);
    }
  };

  const handleEdit = (entry) => {
    setFormData({
      proyectoId: entry.proyectoId || '',
      tareaId: entry.tareaId || '',
      fecha: entry.fecha || initialFormData().fecha,
      horas: entry.horas || '',
      descripcion: entry.descripcion || '',
    });
    setEditingId(entry.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta entrada?')) return;
    try {
      await deleteTimeEntry(id);
      await refetch();
    } catch (err) {
      console.error('Error deleting time entry:', err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(initialFormData());
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="time-tracking-page">
      <PageHeader
        title="Registro de Tiempos"
        subtitle="Controla y registra el tiempo dedicado a cada tarea"
      />

      <div className="stats-grid">
        <Card padding="medium" className="stat-card stat-card--total">
          <div className="stat-content">
            <div className="stat-number">{totalHours.toFixed(2)}h</div>
            <div className="stat-label">Horas Registradas</div>
          </div>
        </Card>
        <Card padding="medium" className="stat-card stat-card--today">
          <div className="stat-content">
            <div className="stat-number">{stats.entradasHoy}</div>
            <div className="stat-label">Entradas Hoy</div>
          </div>
        </Card>
        <Card padding="medium" className="stat-card stat-card--average">
          <div className="stat-content">
            <div className="stat-number">{averageHours.toFixed(1)}h</div>
            <div className="stat-label">Promedio de Horas</div>
          </div>
        </Card>
        <Card padding="medium" className="stat-card stat-card--projects">
          <div className="stat-content">
            <div className="stat-number">{stats.proyectosActivos}</div>
            <div className="stat-label">Proyectos Activos</div>
          </div>
        </Card>
      </div>

      <Card padding="large" className="form-section">
        <div className="form-header">
          <h3>{editingId ? 'Editar Entrada' : 'Registrar Tiempo'}</h3>
          {showForm && (
            <button className="close-btn" onClick={handleCancel}>×</button>
          )}
        </div>

        {showForm ? (
          <form onSubmit={handleSubmit} className="time-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="proyectoId">Proyecto</label>
                <select
                  id="proyectoId"
                  name="proyectoId"
                  value={formData.proyectoId}
                  onChange={handleChange}
                >
                  <option value="">Todos</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>{project.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="tareaId">Tarea *</label>
                <select
                  id="tareaId"
                  name="tareaId"
                  value={formData.tareaId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona una tarea</option>
                  {availableTasks.map((task) => (
                    <option key={task.id} value={task.id}>{task.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fecha">Fecha *</label>
                <input
                  type="date"
                  id="fecha"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="horas">Horas *</label>
                <input
                  type="number"
                  id="horas"
                  name="horas"
                  value={formData.horas}
                  onChange={handleChange}
                  required
                  min="0.25"
                  step="0.25"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
                placeholder="Describe el trabajo realizado"
              />
            </div>

            <div className="form-actions">
              <Button type="button" variant="secondary" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                {editingId ? 'Actualizar' : 'Registrar'} Tiempo
              </Button>
            </div>
          </form>
        ) : (
          <Button variant="primary" icon={Plus} onClick={() => setShowForm(true)} fullWidth>
            Registrar Nuevo Tiempo
          </Button>
        )}
      </Card>

      <Card padding="medium" className="filters-section">
        <div className="filters-row">
          <div className="filter-group">
            <label htmlFor="filterProject">Filtrar por Proyecto:</label>
            <select
              id="filterProject"
              value={filterProject}
              onChange={(event) => setFilterProject(event.target.value)}
              className="filter-select"
            >
              <option value="all">Todos los Proyectos</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>{project.nombre}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="filterDate">Filtrar por Fecha:</label>
            <input
              type="date"
              id="filterDate"
              value={filterDate}
              onChange={(event) => setFilterDate(event.target.value)}
              className="filter-input"
            />
            {filterDate && (
              <button className="clear-filter" onClick={() => setFilterDate('')}>
                Limpiar
              </button>
            )}
          </div>
        </div>
      </Card>

      {error && <ErrorMessage message={error} />}

      {filteredEntries.length === 0 ? (
        <Card padding="large" className="empty-state">
          <div className="empty-content">
            <Calendar size={48} />
            <h3>No hay registros de tiempo</h3>
            <p>Comienza registrando el tiempo dedicado a tus tareas</p>
          </div>
        </Card>
      ) : (
        <div className="entries-timeline">
          {entriesByDate.map(([date, entries]) => (
            <div key={date} className="date-group">
              <div className="date-header">
                <h4 className="date-label">
                  {new Date(date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h4>
                <span className="total-hours">
                  {entries.reduce((sum, entry) => sum + parseFloat(entry.horas || 0), 0).toFixed(2)}h
                </span>
              </div>

              <div className="entries-list">
                {entries.map((entry) => {
                  const project = projects.find((item) => String(item.id) === String(entry.proyectoId));
                  const task = tasks.find((item) => String(item.id) === String(entry.tareaId));

                  return (
                    <Card key={entry.id} padding="medium" className="entry-card">
                      <div className="entry-content">
                        <div className="entry-info">
                          <h4 className="entry-project">{project?.nombre || entry.proyectoNombre || '-'}</h4>
                          <p className="entry-task">{task?.nombre || entry.tareaNombre || '-'}</p>
                          {entry.descripcion && (
                            <p className="entry-description">{entry.descripcion}</p>
                          )}
                        </div>
                        <div className="entry-hours">{entry.horas}h</div>
                      </div>
                      <div className="entry-actions">
                        <button className="action-btn edit" onClick={() => handleEdit(entry)} title="Editar">
                          <Edit2 size={16} />
                        </button>
                        <button className="action-btn delete" onClick={() => handleDelete(entry.id)} title="Eliminar">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeTracking;
