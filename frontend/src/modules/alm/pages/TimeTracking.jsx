import React, { useState, useMemo } from 'react';
import { useTimeTracking } from '../hooks/useTimeTracking';
import { createTimeEntry, updateTimeEntry, deleteTimeEntry } from '../services/almService';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import { Plus, Calendar, Trash2, Edit2 } from 'lucide-react';
import './TimeTracking.css';

const TimeTracking = () => {
  const { timeEntries, stats, loading, error } = useTimeTracking();
  const [showForm, setShowForm] = useState(false);
  const [filterProject, setFilterProject] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    proyectoId: '',
    tareaId: '',
    fecha: new Date().toISOString().split('T')[0],
    horas: '',
    descripcion: ''
  });

  const projects = [
    { id: 1, nombre: 'Rediseño Web' },
    { id: 2, nombre: 'App Móvil' },
    { id: 3, nombre: 'Migración Cloud' },
    { id: 4, nombre: 'Sistema Gestión' },
    { id: 5, nombre: 'Integración APIs' }
  ];

  const tasks = [
    { id: 1, nombre: 'Diseño UI', proyectoId: 1 },
    { id: 2, nombre: 'Desarrollo Backend', proyectoId: 1 },
    { id: 3, nombre: 'Testing', proyectoId: 2 },
    { id: 4, nombre: 'Optimización', proyectoId: 3 }
  ];

  const filteredEntries = useMemo(() => {
    return timeEntries.filter(entry => {
      const matchProject = filterProject === 'all' || entry.proyectoId.toString() === filterProject;
      const matchDate = !filterDate || entry.fecha === filterDate;
      return matchProject && matchDate;
    });
  }, [timeEntries, filterProject, filterDate]);

  const entriesByDate = useMemo(() => {
    const grouped = {};
    filteredEntries.forEach(entry => {
      if (!grouped[entry.fecha]) {
        grouped[entry.fecha] = [];
      }
      grouped[entry.fecha].push(entry);
    });
    return Object.entries(grouped).sort(([dateA], [dateB]) => dateB.localeCompare(dateA));
  }, [filteredEntries]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.proyectoId || !formData.horas || !formData.fecha) {
      alert('Completa los campos obligatorios');
      return;
    }

    try {
      if (editingId) {
        await updateTimeEntry(editingId, formData);
        setEditingId(null);
      } else {
        await createTimeEntry(formData);
      }
      
      setFormData({
        proyectoId: '',
        tareaId: '',
        fecha: new Date().toISOString().split('T')[0],
        horas: '',
        descripcion: ''
      });
      setShowForm(false);
    } catch (err) {
      console.error('Error saving time entry:', err);
    }
  };

  const handleEdit = (entry) => {
    setFormData({
      proyectoId: entry.proyectoId,
      tareaId: entry.tareaId || '',
      fecha: entry.fecha,
      horas: entry.horas,
      descripcion: entry.descripcion
    });
    setEditingId(entry.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta entrada?')) {
      try {
        await deleteTimeEntry(id);
      } catch (err) {
        console.error('Error deleting time entry:', err);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      proyectoId: '',
      tareaId: '',
      fecha: new Date().toISOString().split('T')[0],
      horas: '',
      descripcion: ''
    });
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="time-tracking-page">
      <PageHeader
        title="Registro de Tiempos"
        subtitle="Controla y registra el tiempo dedicado a cada tarea"
      />

      {/* Stats Cards */}
      <div className="stats-grid">
        <Card padding="medium" className="stat-card">
          <div className="stat-content">
            <div className="stat-number">{stats.totalHoras}</div>
            <div className="stat-label">Horas Registradas</div>
          </div>
        </Card>

        <Card padding="medium" className="stat-card">
          <div className="stat-content">
            <div className="stat-number">{stats.entradasHoy}</div>
            <div className="stat-label">Entradas Hoy</div>
          </div>
        </Card>

        <Card padding="medium" className="stat-card">
          <div className="stat-content">
            <div className="stat-number">{stats.promedioHoras.toFixed(1)}</div>
            <div className="stat-label">Promedio de Horas</div>
          </div>
        </Card>

        <Card padding="medium" className="stat-card">
          <div className="stat-content">
            <div className="stat-number">{stats.proyectosActivos}</div>
            <div className="stat-label">Proyectos Activos</div>
          </div>
        </Card>
      </div>

      {/* Form Section */}
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
                <label htmlFor="proyectoId">Proyecto *</label>
                <select
                  id="proyectoId"
                  name="proyectoId"
                  value={formData.proyectoId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona un proyecto</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="tareaId">Tarea</label>
                <select
                  id="tareaId"
                  name="tareaId"
                  value={formData.tareaId}
                  onChange={handleChange}
                >
                  <option value="">Selecciona una tarea (opcional)</option>
                  {tasks.map(t => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
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
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setShowForm(true)}
            fullWidth
          >
            Registrar Nuevo Tiempo
          </Button>
        )}
      </Card>

      {/* Filters */}
      <Card padding="medium" className="filters-section">
        <div className="filters-row">
          <div className="filter-group">
            <label htmlFor="filterProject">Filtrar por Proyecto:</label>
            <select
              id="filterProject"
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="filter-select"
            >
              <option value="all">Todos los Proyectos</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="filterDate">Filtrar por Fecha:</label>
            <input
              type="date"
              id="filterDate"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="filter-input"
            />
            {filterDate && (
              <button 
                className="clear-filter"
                onClick={() => setFilterDate('')}
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Time Entries List */}
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
                    day: 'numeric'
                  })}
                </h4>
                <span className="total-hours">
                  {entries.reduce((sum, e) => sum + parseFloat(e.horas), 0).toFixed(2)}h
                </span>
              </div>

              <div className="entries-list">
                {entries.map(entry => {
                  const project = projects.find(p => p.id === entry.proyectoId);
                  const task = tasks.find(t => t.id === entry.tareaId);
                  
                  return (
                    <Card key={entry.id} padding="medium" className="entry-card">
                      <div className="entry-content">
                        <div className="entry-info">
                          <h4 className="entry-project">{project?.nombre}</h4>
                          {task && (
                            <p className="entry-task">{task.nombre}</p>
                          )}
                          {entry.descripcion && (
                            <p className="entry-description">{entry.descripcion}</p>
                          )}
                        </div>
                        <div className="entry-hours">{entry.horas}h</div>
                      </div>
                      <div className="entry-actions">
                        <button
                          className="action-btn edit"
                          onClick={() => handleEdit(entry)}
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDelete(entry.id)}
                          title="Eliminar"
                        >
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
