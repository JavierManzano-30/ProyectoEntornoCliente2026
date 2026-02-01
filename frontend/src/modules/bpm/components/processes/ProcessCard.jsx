/**
 * Componente card para procesos
 */

import React from 'react';
import { Archive, Edit2, Play, MoreVertical } from 'lucide-react';
import { PROCESS_STATUS_LABELS, PROCESS_STATUS_COLORS } from '../../constants/processStatus';
import './ProcessCard.css';

const ProcessCard = ({ 
  process, 
  onEdit, 
  onPublish, 
  onStart, 
  onDelete,
  onSelect
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const getStatusBadgeClass = (status) => {
    return `process-status-badge process-status-${status}`;
  };

  return (
    <div className="process-card" onClick={() => onSelect?.(process)}>
      <div className="process-card-header">
        <div>
          <h3 className="process-card-title">{process.nombre}</h3>
          <p className="process-card-code">{process.codigo}</p>
        </div>
        <div className="process-card-actions">
          <span className={getStatusBadgeClass(process.estado)}>
            {PROCESS_STATUS_LABELS[process.estado]}
          </span>
          <button
            className="process-card-menu-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
          >
            <MoreVertical size={16} />
          </button>
          {showMenu && (
            <div className="process-card-menu" onClick={e => e.stopPropagation()}>
              {process.estado === 'draft' && (
                <>
                  <button onClick={() => onEdit?.(process)}>
                    <Edit2 size={14} /> Editar
                  </button>
                  <button onClick={() => onPublish?.(process.id)}>
                    <Play size={14} /> Publicar
                  </button>
                </>
              )}
              {process.estado === 'published' && (
                <button onClick={() => onStart?.(process.id)}>
                  <Play size={14} /> Iniciar
                </button>
              )}
              <button className="delete-btn" onClick={() => onDelete?.(process.id)}>
                <Archive size={14} /> Archivar
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="process-card-description">{process.descripcion}</p>

      <div className="process-card-footer">
        <div className="process-card-meta">
          <span>{process.instancias_activas || 0} activas</span>
          <span>v{process.version || '1.0'}</span>
        </div>
      </div>
    </div>
  );
};

export default ProcessCard;
