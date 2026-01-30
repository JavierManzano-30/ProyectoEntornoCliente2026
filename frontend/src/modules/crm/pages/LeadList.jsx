import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, UserPlus } from 'lucide-react';
import { useLeads } from '../hooks/useLeads';
import LeadTable from '../components/leads/LeadTable';
import CRMHeader from '../components/common/CRMHeader';
import Button from '../../../components/common/Button';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import './LeadList.css';

const LeadList = () => {
  const navigate = useNavigate();
  const { 
    leads, 
    loading, 
    error, 
    refetch,
    sortBy,
    sortOrder,
    toggleSort 
  } = useLeads();

  const handleCreateLead = () => {
    navigate('/crm/leads/nuevo');
  };

  const handleViewLead = (id) => {
    navigate(`/crm/leads/${id}`);
  };

  const handleEditLead = (id) => {
    navigate(`/crm/leads/${id}/editar`);
  };

  const handleConvertLead = (id) => {
    navigate(`/crm/leads/${id}/convertir`);
  };

  if (loading) return <LoadingSpinner fullScreen text="Cargando leads..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} fullScreen />;

  return (
    <div className="lead-list-page">
      <CRMHeader
        title="Leads"
        subtitle="Gestión de clientes potenciales"
        icon={UserPlus}
        actions={
          <Button variant="primary" icon={Plus} onClick={handleCreateLead}>
            Nuevo Lead
          </Button>
        }
      />

      <LeadTable
        leads={leads}
        onView={handleViewLead}
        onEdit={handleEditLead}
        onConvert={handleConvertLead}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={toggleSort}
      />
    </div>
  );
};

export default LeadList;
