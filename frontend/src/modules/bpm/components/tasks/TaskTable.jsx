/**
 * Componente de tabla de tareas
 */

import React, { useState } from 'react';
import { TASK_STATUS_LABELS } from '../../constants/taskStatus';
import { TASK_PRIORITY_LABELS } from '../../constants/taskPriority';
import { ArrowUpDown, MoreVertical } from 'lucide-react';
import './TaskTable.css';

const TaskTable = ({ tasks, loading, onRowClick, onAction }) => {
  const [sortBy, setSortBy] = useState('fecha_creacion');
  const [sortOrder, setSortOrder] = useState('desc');
  const [menuOpen, setMenuOpen] = useState(null);

  const sortedTasks = [...tasks].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (sortBy === 'fecha_limite' || sortBy === 'fecha_creacion') {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const SortableHeader = ({ label, column, sortable = true }) => (
    <th
      className={sortable ? 'sortable' : ''}
      onClick={() => sortable && handleSort(column)}
    >
      {label}
      {sortable && sortBy === column && (
        <ArrowUpDown size={14} className={`sort-icon ${sortOrder}`} />
      )}
    </th>
  );

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
      year: '2-digit'
    });
  };

  const isPastDue = (date) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  if (loading) {
    return <div className="task-table-loading">Cargando tareas...</div>;
  }

  return (
    <div className="task-table-container">
      <table className="task-table">
        <thead>
          <tr>
            <SortableHeader label="Tarea" column="nombre" />
            <SortableHeader label="Proceso" column="proceso_nombre" />
            <SortableHeader label="Prioridad" column="prioridad" />
            <SortableHeader label="Estado" column="estado" />
            <SortableHeader label="Asignado a" column="asignado_a" />
            <SortableHeader label="Vencimiento" column="fecha_limite" />
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedTasks.length === 0 ? (
            <tr className="empty-row">
              <td colSpan="7" className="empty-message">No hay tareas</td>
            </tr>
          ) : (
            sortedTasks.map((task) => (
              <tr
                key={task.id}
                className="task-row"
                onClick={() => onRowClick && onRowClick(task)}
              >
                <td className="task-name-cell">
                  <span className="task-name">{task.nombre}</span>
                </td>
                <td>{task.proceso_nombre}</td>
                <td>
                  <span className={`priority-label priority-${task.prioridad}`}>
                    {TASK_PRIORITY_LABELS[task.prioridad]}
                  </span>
                </td>
                <td>
                  <span className={`status-label status-${task.estado}`}>
                    {TASK_STATUS_LABELS[task.estado]}
                  </span>
                </td>
                <td>{task.asignado_a || '-'}</td>
                <td className={isPastDue(task.fecha_limite) ? 'overdue' : ''}>
                  {formatDate(task.fecha_limite)}
                </td>
                <td className="actions-cell">
                  <div
                    className="action-menu"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="action-btn"
                      onClick={() => setMenuOpen(menuOpen === task.id ? null : task.id)}
                    >
                      <MoreVertical size={16} />
                    </button>
                    {menuOpen === task.id && (
                      <div className="action-dropdown">
                        <button onClick={() => {
                          onAction && onAction('view', task);
                          setMenuOpen(null);
                        }}>
                          Ver
                        </button>
                        {task.estado !== 'completed' && (
                          <>
                            <button onClick={() => {
                              onAction && onAction('complete', task);
                              setMenuOpen(null);
                            }}>
                              Completar
                            </button>
                            <button onClick={() => {
                              onAction && onAction('transfer', task);
                              setMenuOpen(null);
                            }}>
                              Transferir
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
