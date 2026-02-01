/**
 * Componente de tabla de instancias
 */

import React, { useState } from 'react';
import { INSTANCE_STATUS_LABELS } from '../../constants/instanceStatus';
import { ArrowUpDown, MoreVertical, CheckCircle, AlertCircle } from 'lucide-react';
import './InstanceTable.css';

const InstanceTable = ({ instances, loading, onRowClick, onAction }) => {
  const [sortBy, setSortBy] = useState('fecha_inicio');
  const [sortOrder, setSortOrder] = useState('desc');
  const [menuOpen, setMenuOpen] = useState(null);

  const sortedInstances = [...instances].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (sortBy === 'fecha_inicio' || sortBy === 'fecha_limite' || sortBy === 'fecha_fin') {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    } else if (sortBy === 'progreso') {
      aVal = (a.tareas_completadas / a.progreso_total) || 0;
      bVal = (b.tareas_completadas / b.progreso_total) || 0;
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

  const getProgressPercentage = (instance) => {
    if (!instance.progreso_total) return 0;
    return Math.min(100, (instance.tareas_completadas / instance.progreso_total) * 100);
  };

  const isPastDue = (date, estado) => {
    if (!date) return false;
    return new Date(date) < new Date() && !['completed', 'cancelled'].includes(estado);
  };

  if (loading) {
    return <div className="instance-table-loading">Cargando instancias...</div>;
  }

  return (
    <div className="instance-table-container">
      <table className="instance-table">
        <thead>
          <tr>
            <SortableHeader label="ID" column="numero" />
            <SortableHeader label="Proceso" column="proceso_nombre" />
            <SortableHeader label="Estado" column="estado" />
            <SortableHeader label="Progreso" column="progreso" />
            <SortableHeader label="Inicio" column="fecha_inicio" />
            <SortableHeader label="Vencimiento" column="fecha_limite" />
            <SortableHeader label="Solicitante" column="solicitante" />
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedInstances.length === 0 ? (
            <tr className="empty-row">
              <td colSpan="8" className="empty-message">No hay instancias</td>
            </tr>
          ) : (
            sortedInstances.map((instance) => (
              <tr
                key={instance.id}
                className="instance-row"
                onClick={() => onRowClick && onRowClick(instance)}
              >
                <td className="id-cell">
                  #{instance.numero}
                </td>
                <td>{instance.proceso_nombre}</td>
                <td>
                  <span className={`status-label status-${instance.estado}`}>
                    {INSTANCE_STATUS_LABELS[instance.estado]}
                  </span>
                </td>
                <td>
                  <div className="progress-cell">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${getProgressPercentage(instance)}%` }}
                      />
                    </div>
                    <span className="progress-value">
                      {instance.tareas_completadas}/{instance.progreso_total}
                    </span>
                  </div>
                </td>
                <td>{formatDate(instance.fecha_inicio)}</td>
                <td className={isPastDue(instance.fecha_limite, instance.estado) ? 'overdue' : ''}>
                  <div className="date-cell">
                    {isPastDue(instance.fecha_limite, instance.estado) && (
                      <AlertCircle size={14} />
                    )}
                    {formatDate(instance.fecha_limite)}
                  </div>
                </td>
                <td>{instance.solicitante || '-'}</td>
                <td className="actions-cell">
                  <div
                    className="action-menu"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="action-btn"
                      onClick={() => setMenuOpen(menuOpen === instance.id ? null : instance.id)}
                    >
                      <MoreVertical size={16} />
                    </button>
                    {menuOpen === instance.id && (
                      <div className="action-dropdown">
                        <button onClick={() => {
                          onAction && onAction('view', instance);
                          setMenuOpen(null);
                        }}>
                          Ver
                        </button>
                        {instance.estado === 'active' && (
                          <button onClick={() => {
                            onAction && onAction('pause', instance);
                            setMenuOpen(null);
                          }}>
                            Pausar
                          </button>
                        )}
                        {instance.estado === 'paused' && (
                          <button onClick={() => {
                            onAction && onAction('resume', instance);
                            setMenuOpen(null);
                          }}>
                            Reanudar
                          </button>
                        )}
                        {['active', 'paused'].includes(instance.estado) && (
                          <button className="danger" onClick={() => {
                            onAction && onAction('cancel', instance);
                            setMenuOpen(null);
                          }}>
                            Cancelar
                          </button>
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

export default InstanceTable;
