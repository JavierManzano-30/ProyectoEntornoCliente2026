import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { deleteTask, updateTaskStatus } from '../services/almService';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import TaskCard from '../components/tasks/TaskCard';
import { Search, Plus, LayoutGrid, List } from 'lucide-react';
import './TaskManagement.css';

const TaskManagement = () => {
  const navigate = useNavigate();
  const { tasks, loading, error, refetch } = useTasks();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'kanban'

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchSearch = task.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterStatus === 'all' || task.estado === filterStatus;
      const matchPriority = filterPriority === 'all' || task.prioridad === filterPriority;
      return matchSearch && matchStatus && matchPriority;
    });
  }, [tasks, searchTerm, filterStatus, filterPriority]);

  const tasksByStatus = useMemo(() => {
    const grouped = {
      pendiente: [],
      en_progreso: [],
      en_revision: [],
      completada: [],
      cancelada: []
    };
    
    filteredTasks.forEach(task => {
      if (grouped[task.estado]) {
        grouped[task.estado].push(task);
      }
    });
    
    return grouped;
  }, [filteredTasks]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      await refetch();
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('¿Seguro que quieres eliminar esta tarea?')) return;

    try {
      await deleteTask(taskId);
      await refetch();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="task-management-page">
      <PageHeader
        title="Gestión de Tareas"
        subtitle="Administra todas las tareas de tus proyectos"
      />

      <div className="task-controls">
        <Card padding="medium">
          <div className="controls-row">
            <div className="search-container">
              <Search size={18} />
              <input
                type="text"
                placeholder="Buscar tareas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filters-group">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">Todos los Estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="en_progreso">En Progreso</option>
                <option value="en_revision">En Revisión</option>
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="filter-select"
              >
                <option value="all">Todas las Prioridades</option>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>

            <div className="view-controls">
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="Vista Lista"
              >
                <List size={18} />
              </button>
              <button
                className={`view-btn ${viewMode === 'kanban' ? 'active' : ''}`}
                onClick={() => setViewMode('kanban')}
                title="Vista Kanban"
              >
                <LayoutGrid size={18} />
              </button>
            </div>

            <Button
              variant="primary"
              icon={Plus}
              size="small"
              onClick={() => navigate('/alm/tareas/nueva')}
            >
              Nueva Tarea
            </Button>
          </div>
        </Card>
      </div>

      {error && <ErrorMessage message={error} />}

      {filteredTasks.length === 0 ? (
        <Card padding="large" className="empty-state">
          <div className="empty-content">
            <LayoutGrid size={48} />
            <h3>No hay tareas</h3>
            <p>Intenta ajustar tus filtros o crear una nueva tarea</p>
          </div>
        </Card>
      ) : viewMode === 'list' ? (
        <div className="tasks-list">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onEdit={(taskId) => navigate(`/alm/tareas/${taskId}/editar`)}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      ) : (
        <div className="kanban-board">
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
            <div key={status} className="kanban-column">
              <div className="column-header">
                <h4 className="column-title">
                  {status.replace('_', ' ').charAt(0).toUpperCase() + 
                   status.slice(1).replace('_', ' ')}
                </h4>
                <span className="task-count">{statusTasks.length}</span>
              </div>
              <div className="column-tasks">
                {statusTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    compact
                    onStatusChange={handleStatusChange}
                    onEdit={(taskId) => navigate(`/alm/tareas/${taskId}/editar`)}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskManagement;
