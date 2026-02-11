/**
 * Componente tabla de procesos
 */

import React from 'react';
import { formatDate } from '../../utils/dateUtils';
import { PROCESS_STATUS_LABELS } from '../../constants/processStatus';
import './ProcessTable.css';

const ProcessTable = ({ 
  processes = [], 
  onSelect,
  onEdit,
  onPublish,
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="process-table-loading">
        <p>Cargando procesos...</p>
      </div>
    );
  }

  if (processes.length === 0) {
    return (
      <div className="process-table-empty">
        <p>No se encontraron procesos</p>
      </div>
    );
  }

  return (
    <div className="process-table-wrapper">
      <table className="process-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Código</th>
            <th>Estado</th>
            <th>Versión</th>
            <th>Instancias Activas</th>
            <th>Fecha Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {processes.map(process => (
            <tr key={process.id} onClick={() => onSelect?.(process)}>
              <td className="process-name">
                <strong>{process.nombre}</strong>
              </td>
              <td className="process-code">{process.codigo}</td>
              <td>
                <span className={`status-badge status-${process.estado}`}>
                  {PROCESS_STATUS_LABELS[process.estado]}
                </span>
              </td>
              <td>v{process.version || '1.0'}</td>
              <td className="text-center">{process.instancias_activas || 0}</td>
              <td>{formatDate(process.fecha_creacion)}</td>
              <td className="process-actions">
                {process.estado === 'draft' && (
                  <button 
                    className="btn-sm btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(process);
                    }}
                  >
                    Editar
                  </button>
                )}
                {process.estado === 'draft' && (
                  <button 
                    className="btn-sm btn-success"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPublish?.(process.id);
                    }}
                  >
                    Publicar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProcessTable;
