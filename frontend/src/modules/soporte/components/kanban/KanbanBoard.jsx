import React, { useState } from 'react';
import { useTickets } from '../../hooks/useTickets';
import TicketCard from './TicketCard';
import { Plus } from 'lucide-react';
import './KanbanBoard.css';

const KanbanBoard = ({ onTicketClick }) => {
  const { tickets, loading } = useTickets();

  const columns = [
    { id: 'pendiente', title: 'Pendiente', status: 'pendiente' },
    { id: 'en_progreso', title: 'En Progreso', status: 'en_progreso' },
    { id: 'esperando_cliente', title: 'Esperando Cliente', status: 'esperando_cliente' },
    { id: 'resuelto', title: 'Resuelto', status: 'resuelto' },
  ];

  const getTicketsByStatus = (status) => {
    return tickets.filter(ticket => ticket.estado === status);
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
    <div className="kanban-board">
      {columns.map(column => {
        const columnTickets = getTicketsByStatus(column.status);
        
        return (
          <div key={column.id} className="kanban-column">
            <div className="kanban-column-header">
              <h3 className="kanban-column-title">{column.title}</h3>
              <span className="kanban-column-count">{columnTickets.length}</span>
            </div>

            <div className="kanban-column-content">
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
                  />
                ))
              )}
            </div>

            <button className="kanban-column-add">
              <Plus size={16} />
              <span>Agregar ticket</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
