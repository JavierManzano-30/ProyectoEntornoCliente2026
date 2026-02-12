import React, { useEffect, useState } from 'react';
import { useTickets } from '../../hooks/useTickets';
import TicketCard from './TicketCard';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import soporteService from '../../services/soporteService';
import './KanbanBoard.css';

const KanbanBoard = ({ onTicketClick }) => {
  const { tickets, loading, refetch } = useTickets();
  const navigate = useNavigate();
  const [boardTickets, setBoardTickets] = useState([]);
  const [draggedTicketId, setDraggedTicketId] = useState(null);
  const [dragOverStatus, setDragOverStatus] = useState(null);
  const [movingTicketId, setMovingTicketId] = useState(null);
  const [moveError, setMoveError] = useState('');

  useEffect(() => {
    setBoardTickets(tickets);
  }, [tickets]);

  const columns = [
    { id: 'nuevo', title: 'Nuevo', status: 'pendiente' },
    { id: 'asignado', title: 'Asignado', status: 'asignado' },
    { id: 'en_proceso', title: 'En Proceso', status: 'en_progreso' },
    { id: 'resuelto', title: 'Resuelto', status: 'resuelto' },
  ];

  const resolveBoardStatus = (ticket) => {
    if (ticket.estado === 'pendiente' && ticket.asignadoA) {
      return 'asignado';
    }
    return ticket.estado;
  };

  const getTicketsByStatus = (status) => {
    return boardTickets.filter(ticket => resolveBoardStatus(ticket) === status);
  };

  const handleDragStart = (ticketId) => (event) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(ticketId));
    setDraggedTicketId(String(ticketId));
    setMoveError('');
  };

  const handleDragEnd = () => {
    setDraggedTicketId(null);
    setDragOverStatus(null);
  };

  const handleDrop = (targetStatus) => async (event) => {
    event.preventDefault();

    const droppedId = event.dataTransfer.getData('text/plain') || draggedTicketId;
    const ticketId = String(droppedId || '');
    const ticket = boardTickets.find((item) => String(item.id) === ticketId);

    setDragOverStatus(null);

    if (!ticket || resolveBoardStatus(ticket) === targetStatus) {
      return;
    }

    const previousTickets = boardTickets;

    setMovingTicketId(ticketId);
    setMoveError('');

    setBoardTickets((prev) =>
      prev.map((item) => {
        if (String(item.id) !== ticketId) return item;

        const nextAssignedTo = targetStatus === 'pendiente'
          ? null
          : targetStatus === 'asignado'
            ? item.asignadoA || localStorage.getItem('userId')
            : item.asignadoA;

        return {
          ...item,
          estado: targetStatus === 'asignado' ? 'pendiente' : targetStatus,
          asignadoA: nextAssignedTo,
        };
      })
    );

    try {
      const updatedTicket = await soporteService.moveTicketToStatus(ticketId, targetStatus);
      setBoardTickets((prev) =>
        prev.map((item) => (String(item.id) === ticketId ? { ...item, ...updatedTicket } : item))
      );
    } catch (error) {
      setBoardTickets(previousTickets);
      setMoveError(error.response?.data?.error?.message || error.message || 'No se pudo mover el ticket');
      refetch();
    } finally {
      setMovingTicketId(null);
      setDraggedTicketId(null);
    }
  };

  if (loading) {
    return (
      <div className="kanban-loading">
        <div className="spinner"></div>
        <p>Cargando tablero...</p>
      </div>
    );
  }

  return (
    <div className="kanban-board-wrapper">
      {moveError && <div className="kanban-move-error">{moveError}</div>}

      <div className="kanban-board">
        {columns.map(column => {
          const columnTickets = getTicketsByStatus(column.status);

          return (
            <div key={column.id} className="kanban-column">
              <div className="kanban-column-header">
                <h3 className="kanban-column-title">{column.title}</h3>
                <span className="kanban-column-count">{columnTickets.length}</span>
              </div>

              <div
                className={`kanban-column-content ${dragOverStatus === column.status ? 'drop-target' : ''}`}
                onDragOver={(event) => {
                  event.preventDefault();
                  if (dragOverStatus !== column.status) {
                    setDragOverStatus(column.status);
                  }
                }}
                onDragLeave={() => {
                  if (dragOverStatus === column.status) {
                    setDragOverStatus(null);
                  }
                }}
                onDrop={handleDrop(column.status)}
              >
                {columnTickets.length === 0 ? (
                  <div className="kanban-column-empty">
                    <p>No hay tickets</p>
                  </div>
                ) : (
                  columnTickets.map(ticket => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      onClick={onTicketClick}
                      draggable={movingTicketId == null || String(movingTicketId) !== String(ticket.id)}
                      onDragStart={handleDragStart(ticket.id)}
                      onDragEnd={handleDragEnd}
                      isDragging={String(draggedTicketId) === String(ticket.id)}
                      isUpdating={String(movingTicketId) === String(ticket.id)}
                    />
                  ))
                )}
              </div>

              <button
                type="button"
                className="kanban-column-add"
                onClick={() => navigate('/soporte/tickets/nuevo')}
              >
                <Plus size={16} />
                <span>Agregar ticket</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;
