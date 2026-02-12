// Páginas
export { default as CustomerList } from './pages/CustomerList';
export { default as LeadList } from './pages/LeadList';
export { default as OpportunityBoard } from './pages/OpportunityBoard';
export { default as CRMDashboard } from './pages/CRMDashboard';
export { default as ActivityList } from './pages/ActivityList';
export { default as CustomerForm } from './pages/CustomerForm';

// Componentes de clientes
export { default as CustomerTable } from './components/customers/CustomerTable';
export { default as CustomerStats } from './components/customers/CustomerStats';

// Componentes de leads
export { default as LeadTable } from './components/leads/LeadTable';

// Componentes de oportunidades
export { default as OpportunityCard } from './components/opportunities/OpportunityCard';
export { default as OpportunityBoardColumn } from './components/opportunities/OpportunityBoardColumn';

// Componentes de actividades
export { default as ActivityTimeline } from './components/activities/ActivityTimeline';

// Componentes comunes
export { default as CRMHeader } from './components/common/CRMHeader';
export { default as CustomerTypeBadge } from './components/common/CustomerTypeBadge';
export { default as StageBadge } from './components/common/StageBadge';
export { default as ActivityTypeIcon } from './components/common/ActivityTypeIcon';

// Hooks
export { useCustomers } from './hooks/useCustomers';
export { useCustomer } from './hooks/useCustomer';
export { useLeads } from './hooks/useLeads';
export { useOpportunities } from './hooks/useOpportunities';
export { useActivities } from './hooks/useActivities';
export { useCRMDashboard } from './hooks/useCRMDashboard';

// Servicios
export { default as crmService } from './services/crmService';

// Constantes
export * from './constants/customerStatuses';
export * from './constants/leadSources';
export * from './constants/opportunityStages';
export * from './constants/activityTypes';

// Utilidades
export * from './utils/customerHelpers';
export * from './utils/leadHelpers';
export * from './utils/opportunityHelpers';
export * from './utils/activityHelpers';
