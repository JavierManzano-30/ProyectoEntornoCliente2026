import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';
import { useCustomers } from '../hooks/useCustomers';
import CustomerTable from '../components/customers/CustomerTable';
import CustomerStats from '../components/customers/CustomerStats';
import CRMHeader from '../components/common/CRMHeader';
import Button from '../../../components/common/Button';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import './CustomerList.css';

const CustomerList = () => {
  const navigate = useNavigate();
  const { 
    customers, 
    allCustomers,
    loading, 
    error, 
    refetch,
    sortBy,
    sortOrder,
    toggleSort 
  } = useCustomers();

  const handleCreateCustomer = () => {
    navigate('/crm/clientes/nuevo');
  };

  const handleViewCustomer = (id) => {
    navigate(`/crm/clientes/${id}`);
  };

  const handleEditCustomer = (id) => {
    navigate(`/crm/clientes/${id}/editar`);
  };

  const handleDeleteCustomer = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      // TODO: Implementar eliminación
      console.log('Eliminar cliente:', id);
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Cargando clientes..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} fullScreen />;

  return (
    <div className="customer-list-page">
      <CRMHeader
        title="Clientes"
        subtitle="Gestión de cuentas activas"
        icon={Users}
        actions={
          <Button variant="primary" icon={Plus} onClick={handleCreateCustomer}>
            Nuevo Cliente
          </Button>
        }
      />

      <CustomerStats data={allCustomers} />

      <CustomerTable
        customers={customers}
        onView={handleViewCustomer}
        onEdit={handleEditCustomer}
        onDelete={handleDeleteCustomer}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={toggleSort}
      />
    </div>
  );
};

export default CustomerList;
