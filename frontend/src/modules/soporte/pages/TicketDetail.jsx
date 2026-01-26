import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { useTicket } from '../hooks/useTicket';
import ConversationThread from '../components/conversation/ConversationThread';
import SLAIndicator from '../components/sla/SLAIndicator';
import TicketStatusBadge from '../components/tickets/TicketStatusBadge';
import TicketPriorityBadge from '../components/tickets/TicketPriorityBadge';
import TicketCategoryBadge from '../components/tickets/TicketCategoryBadge';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import { formatTicketId } from '../utils/ticketHelpers';
import { formatDateTime } from '../../utils/dateHelpers';
import './TicketDetail.css';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ticket, loading, error, updating, changeStatus, escalateTicket, refetch } = useTicket(id);
  const [activeTab, setActiveTab] = useState('conversation');

  const handleBack = () => {
    navigate('/soporte/tickets');
  };

  const handleEdit = () => {
    navigate(`/soporte/tickets/${id}/editar`);
  };

  const handleChangeStatus = async (newStatus) => {
    const result = await changeStatus(newStatus);
    if (result.success) {
      // TODO: Mostrar notificación de éxito
      console.log('Estado actualizado correctamente');
    }
  };

  const handleEscalate = async () => {
    const motivo = prompt('Motivo de la escalación:');
    if (motivo) {
      const result = await escalateTicket(motivo);
      if (result.success) {
        // TODO: Mostrar notificación de éxito
        console.log('Ticket escalado correctamente');
      }
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Cargando ticket..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} fullScreen />;
  if (!ticket) return <ErrorMessage message="Ticket no encontrado" fullScreen />;

  return (
    <div className="ticket-detail-page">
      <PageHeader
        title={`Ticket ${formatTicketId(ticket.id)}`}
        subtitle={ticket.titulo}
        breadcrumbs={[
          { label: 'Soporte', href: '/soporte' },
          { label: 'Tickets', href: '/soporte/tickets' },
          { label: formatTicketId(ticket.id) },
        ]}
        actions={
          <>
            <Button variant="ghost" icon={ArrowLeft} onClick={handleBack}>
              Volver
            </Button>
            <Button variant="secondary" icon={Edit} onClick={handleEdit}>
              Editar
            </Button>
            <Button 
              variant="warning" 
              icon={AlertTriangle} 
              onClick={handleEscalate}
              disabled={updating}
            >
              Escalar
            </Button>
          </>
        }
      />

      <div className="ticket-detail-grid">
        <div className="ticket-detail-main">
          <Card padding="medium">
            <div className="ticket-detail-header">
              <div className="ticket-badges">
                <TicketStatusBadge status={ticket.estado} />
                <TicketPriorityBadge priority={ticket.prioridad} />
                <TicketCategoryBadge category={ticket.categoria} />
              </div>
            </div>

            <div className="ticket-detail-description">
              <h3>Descripción</h3>
              <p>{ticket.descripcion}</p>
            </div>

            <div className="ticket-detail-tabs">
              <button
                className={`tab-button ${activeTab === 'conversation' ? 'active' : ''}`}
                onClick={() => setActiveTab('conversation')}
              >
                Conversación
              </button>
              <button
                className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                Historial
              </button>
            </div>

            <div className="ticket-detail-tab-content">
              {activeTab === 'conversation' && (
                <ConversationThread ticketId={ticket.id} />
              )}
              {activeTab === 'history' && (
                <div className="tab-placeholder">
                  <p>Historial de auditoría</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="ticket-detail-sidebar">
          <Card title="Información" padding="medium">
            <div className="ticket-info-grid">
              <div className="info-item">
                <span className="info-label">Cliente</span>
                <span className="info-value">{ticket.cliente?.nombre || 'N/A'}</span>
              </div>

              <div className="info-item">
                <span className="info-label">Asignado a</span>
                <span className="info-value">{ticket.asignadoA?.nombre || 'Sin asignar'}</span>
              </div>

              <div className="info-item">
                <span className="info-label">Creado</span>
                <span className="info-value">{formatDateTime(ticket.fechaCreacion)}</span>
              </div>

              <div className="info-item">
                <span className="info-label">Actualizado</span>
                <span className="info-value">{formatDateTime(ticket.fechaActualizacion)}</span>
              </div>

              {ticket.nivelSLA && (
                <div className="info-item">
                  <span className="info-label">Nivel SLA</span>
                  <span className="info-value">{ticket.nivelSLA.toUpperCase()}</span>
                </div>
              )}
            </div>
          </Card>

          {ticket.nivelSLA && (
            <div className="ticket-sla-card">
              <SLAIndicator ticket={ticket} showDetails={true} />
            </div>
          )}

          <Card title="Acciones" padding="medium">
            <div className="ticket-actions-list">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => handleChangeStatus('en_progreso')}
                disabled={updating || ticket.estado === 'en_progreso'}
              >
                Marcar en Progreso
              </Button>
              <Button
                variant="success"
                fullWidth
                onClick={() => handleChangeStatus('resuelto')}
                disabled={updating || ticket.estado === 'resuelto'}
              >
                Marcar Resuelto
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => handleChangeStatus('cerrado')}
                disabled={updating || ticket.estado === 'cerrado'}
              >
                Cerrar Ticket
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
