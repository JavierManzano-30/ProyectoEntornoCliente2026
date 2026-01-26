import React from 'react';
import { X, Calendar, User, Tag, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../components/common/Button';
import TicketStatusBadge from '../tickets/TicketStatusBadge';
import TicketPriorityBadge from '../tickets/TicketPriorityBadge';
import TicketCategoryBadge from '../tickets/TicketCategoryBadge';
import SLAIndicator from '../sla/SLAIndicator';
import { formatTicketId } from '../../utils/ticketHelpers';
import { formatDateTime } from '../../../utils/dateHelpers';
import './TicketDetailModal.css';

const TicketDetailModal = ({ ticket, onClose }) => {
  const navigate = useNavigate();

  if (!ticket) return null;

  const handleViewFull = () => {
    navigate(`/soporte/tickets/${ticket.id}`);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-content">
            <span className="modal-ticket-id">{formatTicketId(ticket.id)}</span>
            <h2 className="modal-title">{ticket.titulo}</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-badges">
            <TicketStatusBadge status={ticket.estado} />
            <TicketPriorityBadge priority={ticket.prioridad} />
            <TicketCategoryBadge category={ticket.categoria} />
          </div>

          <div className="modal-section">
            <h3 className="modal-section-title">Descripción</h3>
            <p className="modal-description">{ticket.descripcion}</p>
          </div>

          <div className="modal-info-grid">
            <div className="modal-info-item">
              <div className="modal-info-label">
                <User size={16} />
                <span>Cliente</span>
              </div>
              <div className="modal-info-value">{ticket.cliente?.nombre || 'N/A'}</div>
            </div>

            <div className="modal-info-item">
              <div className="modal-info-label">
                <User size={16} />
                <span>Asignado a</span>
              </div>
              <div className="modal-info-value">
                {ticket.asignadoA?.nombre || 'Sin asignar'}
              </div>
            </div>

            <div className="modal-info-item">
              <div className="modal-info-label">
                <Calendar size={16} />
                <span>Fecha de creación</span>
              </div>
              <div className="modal-info-value">
                {formatDateTime(ticket.fechaCreacion)}
              </div>
            </div>

            <div className="modal-info-item">
              <div className="modal-info-label">
                <Clock size={16} />
                <span>Última actualización</span>
              </div>
              <div className="modal-info-value">
                {formatDateTime(ticket.fechaActualizacion)}
              </div>
            </div>
          </div>

          {ticket.nivelSLA && (
            <div className="modal-section">
              <h3 className="modal-section-title">Estado SLA</h3>
              <SLAIndicator ticket={ticket} showDetails={true} />
            </div>
          )}
        </div>

        <div className="modal-footer">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleViewFull}>
            Ver detalles completos
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailModal;
