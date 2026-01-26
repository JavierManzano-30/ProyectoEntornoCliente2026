import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useTickets } from '../hooks/useTickets';
import TicketTable from '../components/tickets/TicketTable';
import TicketFilters from '../components/tickets/TicketFilters';
import TicketStats from '../components/tickets/TicketStats';
import Button from '../../../components/common/Button';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import './TicketList.css';

const TicketList = () => {
  const navigate = useNavigate();
  const { 
    tickets, 
    allTickets,
    loading, 
    error, 
    filters, 
    setFilters, 
    refetch,
    sortBy,
    sortOrder,
    toggleSort 
  } = useTickets();

  const handleCreateTicket = () => {
    navigate('/soporte/tickets/nuevo');
  };

  const handleViewTicket = (id) => {
    navigate(`/soporte/tickets/${id}`);
  };

  const handleAssignTicket = (id) => {
    // TODO: Abrir modal de asignación
    console.log('Asignar ticket:', id);
  };

  const handleCloseTicket = async (id) => {
    // TODO: Implementar cierre de ticket
    console.log('Cerrar ticket:', id);
  };

  if (loading) return <LoadingSpinner fullScreen text="Cargando tickets..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} fullScreen />;

  return (
    <div className="ticket-list-page">
      <PageHeader
        title="Gestión de Tickets"
        subtitle="Incidencias y peticiones de soporte"
        breadcrumbs={[
          { label: 'Soporte', href: '/soporte' },
          { label: 'Tickets' },
        ]}
        actions={
          <Button variant="primary" icon={Plus} onClick={handleCreateTicket}>
            Nuevo Ticket
          </Button>
        }
      />

      <TicketStats data={allTickets} />

      <TicketFilters filters={filters} onFilterChange={setFilters} />

      <TicketTable
        tickets={tickets}
        onView={handleViewTicket}
        onAssign={handleAssignTicket}
        onClose={handleCloseTicket}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={toggleSort}
      />
    </div>
  );
};

export default TicketList;
