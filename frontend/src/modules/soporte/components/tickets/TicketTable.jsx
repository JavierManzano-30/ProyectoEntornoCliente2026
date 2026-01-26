import React from 'react';
import { Eye, UserPlus, CheckCircle, ArrowUp, ArrowDown } from 'lucide-react';
import Button from '../../../../components/common/Button';
import TicketStatusBadge from './TicketStatusBadge';
import TicketPriorityBadge from './TicketPriorityBadge';
import TicketCategoryBadge from './TicketCategoryBadge';
import { formatTicketId, calculateTicketAge } from '../../utils/ticketHelpers';
import './TicketTable.css';

const TicketTable = ({ 
  tickets, 
  onView, 
  onAssign, 
  onClose,
  sortBy,
  sortOrder,
  onSort
}) => {
  const handleSort = (field) => {
    if (onSort) {
      onSort(field);
    }
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  if (tickets.length === 0) {
    return (
      <div className="ticket-table-empty">
        <p>No se encontraron tickets</p>
      </div>
    );
  }

  return (
    <div className="ticket-table-container">
      <table className="ticket-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('id')} className="sortable">
              ID <SortIcon field="id" />
            </th>
            <th onClick={() => handleSort('titulo')} className="sortable">
              Título <SortIcon field="titulo" />
            </th>
            <th>Cliente</th>
            <th onClick={() => handleSort('categoria')} className="sortable">
              Categoría <SortIcon field="categoria" />
            </th>
            <th onClick={() => handleSort('prioridad')} className="sortable">
              Prioridad <SortIcon field="prioridad" />
            </th>
            <th onClick={() => handleSort('estado')} className="sortable">
              Estado <SortIcon field="estado" />
            </th>
            <th>Asignado a</th>
            <th onClick={() => handleSort('fechaCreacion')} className="sortable">
              Antigüedad <SortIcon field="fechaCreacion" />
            </th>
            <th className="actions-column">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td className="ticket-id">{formatTicketId(ticket.id)}</td>
              <td className="ticket-title">{ticket.titulo}</td>
              <td>{ticket.cliente?.nombre || 'N/A'}</td>
              <td>
                <TicketCategoryBadge category={ticket.categoria} />
              </td>
              <td>
                <TicketPriorityBadge priority={ticket.prioridad} />
              </td>
              <td>
                <TicketStatusBadge status={ticket.estado} />
              </td>
              <td>{ticket.asignadoA?.nombre || 'Sin asignar'}</td>
              <td className="ticket-age">{calculateTicketAge(ticket.fechaCreacion)}</td>
              <td className="ticket-actions">
                <Button
                  variant="ghost"
                  size="small"
                  icon={Eye}
                  onClick={() => onView(ticket.id)}
                  title="Ver detalles"
                />
                {!ticket.asignadoA && onAssign && (
                  <Button
                    variant="ghost"
                    size="small"
                    icon={UserPlus}
                    onClick={() => onAssign(ticket.id)}
                    title="Asignar"
                  />
                )}
                {ticket.estado === 'resuelto' && onClose && (
                  <Button
                    variant="ghost"
                    size="small"
                    icon={CheckCircle}
                    onClick={() => onClose(ticket.id)}
                    title="Cerrar"
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTable;
