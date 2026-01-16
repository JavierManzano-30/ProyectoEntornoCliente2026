# Módulo CRM Frontend - Estructura y Código (React)

## 📁 Estructura de Carpetas Completa

```
src/
└── modules/
    └── crm/
        ├── components/                      # Componentes específicos del módulo
        │   ├── customers/
        │   │   ├── CustomerCard.jsx
        │   │   ├── CustomerTable.jsx
        │   │   ├── CustomerFilters.jsx
        │   │   ├── CustomerHeader.jsx
        │   │   └── CustomerStats.jsx
        │   │
        │   ├── leads/
        │   │   ├── LeadCard.jsx
        │   │   ├── LeadTable.jsx
        │   │   ├── LeadFilters.jsx
        │   │   └── LeadStats.jsx
        │   │
        │   ├── opportunities/
        │   │   ├── OpportunityCard.jsx
        │   │   ├── OpportunityBoardColumn.jsx
        │   │   ├── OpportunityFilters.jsx
        │   │   └── OpportunityStats.jsx
        │   │
        │   ├── activities/
        │   │   ├── ActivityTimeline.jsx
        │   │   ├── ActivityList.jsx
        │   │   ├── ActivityForm.jsx
        │   │   └── ActivityFilters.jsx
        │   │
        │   └── common/
        │       ├── CRMHeader.jsx
        │       ├── StageBadge.jsx
        │       ├── CustomerTypeBadge.jsx
        │       └── ActivityTypeIcon.jsx
        │
        ├── pages/                           # Páginas principales del módulo
        │   ├── CustomerList.jsx
        │   ├── CustomerDetail.jsx
        │   ├── CustomerForm.jsx
        │   ├── LeadList.jsx
        │   ├── LeadDetail.jsx
        │   ├── LeadForm.jsx
        │   ├── OpportunityBoard.jsx
        │   ├── OpportunityList.jsx
        │   ├── OpportunityDetail.jsx
        │   ├── ActivityCenter.jsx
        │   ├── CRMDashboard.jsx
        │   └── LeadConversionWizard.jsx
        │
        ├── hooks/                           # Custom hooks del módulo
        │   ├── useCustomers.js
        │   ├── useCustomer.js
        │   ├── useLeads.js
        │   ├── useLead.js
        │   ├── useOpportunities.js
        │   ├── useOpportunity.js
        │   ├── useActivities.js
        │   └── useCRMDashboard.js
        │
        ├── context/                         # Contexto específico del módulo
        │   ├── CRMContext.jsx
        │   └── CRMProvider.jsx
        │
        ├── services/                        # Servicios de comunicación con API
        │   └── crmService.js
        │
        ├── utils/                           # Utilidades específicas del módulo
        │   ├── crmMappers.js
        │   ├── crmValidators.js
        │   ├── pipelineHelpers.js
        │   └── activityHelpers.js
        │
        ├── constants/                       # Constantes del módulo
        │   ├── customerStatuses.js
        │   ├── leadSources.js
        │   ├── opportunityStages.js
        │   └── activityTypes.js
        │
        ├── styles/                          # Estilos específicos del módulo
        │   ├── crm.module.css
        │   ├── customers.module.css
        │   ├── leads.module.css
        │   ├── opportunities.module.css
        │   └── activities.module.css
        │
        └── __tests__/                       # Tests del módulo
            ├── pages/
            │   ├── CustomerList.test.jsx
            │   ├── OpportunityBoard.test.jsx
            │   └── LeadConversionWizard.test.jsx
            ├── components/
            │   ├── CustomerCard.test.jsx
            │   └── ActivityTimeline.test.jsx
            ├── hooks/
            │   ├── useCustomers.test.js
            │   └── useOpportunities.test.js
            └── services/
                └── crmService.test.js
```

---

## 📄 Ejemplos de Código de Páginas

### 1. Página: Listado de Clientes

```jsx
// pages/CustomerList.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomers } from '../hooks/useCustomers';
import CustomerTable from '../components/customers/CustomerTable';
import CustomerFilters from '../components/customers/CustomerFilters';
import CustomerStats from '../components/customers/CustomerStats';
import SearchBar from '@/components/common/SearchBar';
import Pagination from '@/components/common/Pagination';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import PageHeader from '@/components/common/PageHeader';
import styles from '../styles/customers.module.css';

const CustomerList = () => {
  const navigate = useNavigate();
  const {
    customers,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    handleSearch,
    handlePageChange,
    refetch
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

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className={styles.customerListContainer}>
      <PageHeader
        title="Gestión de Clientes"
        subtitle="Administra los clientes y leads de la empresa"
        actions={
          <Button 
            variant="primary" 
            onClick={handleCreateCustomer}
            icon="plus"
          >
            Nuevo Cliente
          </Button>
        }
      />

      <CustomerStats data={customers} />

      <div className={styles.filtersSection}>
        <SearchBar 
          placeholder="Buscar por nombre, NIF/CIF, email o teléfono..."
          onSearch={handleSearch}
          className={styles.searchBar}
        />
        <CustomerFilters 
          filters={filters}
          onFilterChange={setFilters}
        />
      </div>

      <CustomerTable
        customers={customers}
        onView={handleViewCustomer}
        onEdit={handleEditCustomer}
      />

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default CustomerList;
```

---

### 2. Página: Tablero de Oportunidades

```jsx
// pages/OpportunityBoard.jsx
import React, { useState } from 'react';
import { useOpportunities } from '../hooks/useOpportunities';
import OpportunityBoardColumn from '../components/opportunities/OpportunityBoardColumn';
import OpportunityFilters from '../components/opportunities/OpportunityFilters';
import OpportunityStats from '../components/opportunities/OpportunityStats';
import PageHeader from '@/components/common/PageHeader';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import styles from '../styles/opportunities.module.css';

const OpportunityBoard = () => {
  const {
    opportunitiesByStage,
    loading,
    error,
    filters,
    setFilters,
    refetch
  } = useOpportunities();

  const [activePipeline, setActivePipeline] = useState('default');

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  const stages = Object.keys(opportunitiesByStage);

  return (
    <div className={styles.opportunityBoardContainer}>
      <PageHeader
        title="Pipeline de Ventas"
        subtitle="Gestiona las oportunidades por fase"
      />

      <OpportunityStats data={opportunitiesByStage} />

      <OpportunityFilters
        filters={filters}
        onFilterChange={setFilters}
        activePipeline={activePipeline}
        onPipelineChange={setActivePipeline}
      />

      <div className={styles.board}>
        {stages.map((stage) => (
          <OpportunityBoardColumn
            key={stage}
            stage={stage}
            opportunities={opportunitiesByStage[stage]}
          />
        ))}
      </div>
    </div>
  );
};

export default OpportunityBoard;
```