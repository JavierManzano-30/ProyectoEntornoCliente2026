import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, AlertCircle, User } from 'lucide-react';
import TicketPriorityBadge from '../tickets/TicketPriorityBadge';
import { formatTicketId, calculateTicketAge } from '../../utils/ticketHelpers';
import { calculateSLAStatus } from '../../utils/slaHelpers';
import './TicketCard.css';

const TicketCard = ({ ticket, onClick, draggable = false, onDragStart, onDragEnd, isDragging = false, isUpdating = false }) => {
  const navigate = useNavigate();
  const slaStatus = ticket.nivelSLA ? calculateSLAStatus(ticket) : null;
  const assignedLabel = typeof ticket.asignadoA === 'string'
    ? ticket.asignadoA
    : ticket.asignadoA?.nombre;
  
  const handleClick = () => {
    if (isDragging || isUpdating) return;

    if (onClick) {
      onClick(ticket);
    } else {
      navigate(`/soporte/tickets/${ticket.id}`);
    }
  };

  const getPriorityClass = () => {
    switch (ticket.prioridad) {
      case 'critica':
        return 'priority-critical';
      case 'alta':
        return 'priority-high';
      case 'media':
        return 'priority-medium';
      case 'baja':
        return 'priority-low';
      default:
        return '';
    }
  };

  return (
    <div 
      className={`ticket-card ${getPriorityClass()} ${isDragging ? 'dragging' : ''} ${isUpdating ? 'updating' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="ticket-card-header">
        <span className="ticket-card-id">{formatTicketId(ticket.id)}</span>
        <TicketPriorityBadge priority={ticket.prioridad} showIcon={false} />
      </div>

      <h4 className="ticket-card-title">{ticket.titulo}</h4>
      
      {ticket.descripcion && (
        <p className="ticket-card-description">
          {ticket.descripcion.length > 100 
            ? `${ticket.descripcion.substring(0, 100)}...` 
            : ticket.descripcion}
        </p>
      )}

      <div className="ticket-card-footer">
        <div className="ticket-card-meta">
          {ticket.cliente && (
            <div className="ticket-card-meta-item" title="Cliente">
              <User size={14} />
              <span>{ticket.cliente.nombre}</span>
            </div>
          )}
          
          {assignedLabel && (
            <div className="ticket-card-meta-item" title="Asignado a">
              <User size={14} />
              <span>{assignedLabel}</span>
            </div>
          )}
          
          <div className="ticket-card-meta-item" title="Antigüedad">
            <Clock size={14} />
            <span>{calculateTicketAge(ticket.fechaCreacion)}</span>
          </div>
        </div>

        {slaStatus && slaStatus.overallStatus !== 'ok' && (
          <div className={`ticket-card-sla ${slaStatus.overallStatus === 'breached' ? 'breached' : 'warning'}`}>
            <AlertCircle size={14} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketCard;
