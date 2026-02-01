/**
 * Índice del módulo BPM
 * Exporta todos los componentes, hooks, servicios y utilidades
 */

// Páginas
export { default as BPMDashboard } from './pages/BPMDashboard';
export { default as ProcessList } from './pages/ProcessList';
export { default as ProcessStartForm } from './pages/ProcessStartForm';
export { default as ProcessDesigner } from './pages/ProcessDesigner';
export { default as InstanceMonitor } from './pages/InstanceMonitor';
export { default as TaskInbox } from './pages/TaskInbox';

// Componentes - Procesos
export { default as ProcessCard } from './components/processes/ProcessCard';
export { default as ProcessFilters } from './components/processes/ProcessFilters';
export { default as ProcessTable } from './components/processes/ProcessTable';

// Componentes - Tareas
export { default as TaskCard } from './components/tasks/TaskCard';
export { default as TaskTable } from './components/tasks/TaskTable';

// Componentes - Instancias
export { default as InstanceCard } from './components/instances/InstanceCard';
export { default as InstanceTable } from './components/instances/InstanceTable';

// Componentes - Formularios
export { default as DynamicFormBuilder } from './components/forms/DynamicFormBuilder';
export { default as FormField } from './components/forms/FormField';
export { default as FormValidation } from './components/forms/FormValidation';

// Componentes - Documentos
export { default as DocumentUploader } from './components/documents/DocumentUploader';
export { default as DocumentList } from './components/documents/DocumentList';

// Componentes - Designer
export { default as BPMNViewer } from './components/designer/BPMNViewer';

// Componentes - Compartidos
export { default as SLAProgressBar } from './components/shared/SLAProgressBar';
export { default as ActivityTimeline } from './components/shared/ActivityTimeline';
export { default as UserPicker } from './components/shared/UserPicker';
export { default as CommentThread } from './components/shared/CommentThread';
export { default as DateRangePicker } from './components/shared/DateRangePicker';

// Hooks
export { useProcesses } from './hooks/useProcesses';
export { useProcess } from './hooks/useProcess';
export { useInstances } from './hooks/useInstances';
export { useInstance } from './hooks/useInstance';
export { useTasks } from './hooks/useTasks';
export { useTask } from './hooks/useTask';
export { useTaskInbox } from './hooks/useTaskInbox';
export { useDocuments } from './hooks/useDocuments';
export { useBPMMetrics } from './hooks/useBPMMetrics';
export { useBPMNEditor } from './hooks/useBPMNEditor';

// Context
export { BPMContext } from './context/BPMContext';
export { default as BPMProvider } from './context/BPMProvider';
export { useBPMContext } from './context/BPMContext';

// Servicios
export * as bpmService from './services/bpmService';

// Constantes
export * as PROCESS_STATUS from './constants/processStatus';
export * as INSTANCE_STATUS from './constants/instanceStatus';
export * as TASK_STATUS from './constants/taskStatus';
export * as TASK_PRIORITY from './constants/taskPriority';
export * as SLA_THRESHOLDS from './constants/slaThresholds';
export * as BPMN_ELEMENTS from './constants/bpmnElements';

// Utilidades
export * as processHelpers from './utils/processHelpers';
export * as instanceHelpers from './utils/instanceHelpers';
export * as taskHelpers from './utils/taskHelpers';
export * as slaCalculations from './utils/slaCalculations';
export * as bpmnParser from './utils/bpmnParser';
export * as formBuilder from './utils/formBuilder';
export * as dateUtils from './utils/dateUtils';
export * as validators from './utils/validators';
