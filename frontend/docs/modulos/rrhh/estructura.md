# Módulo RRHH Frontend - Estructura y Código (React)

## 📁 Estructura de Carpetas Completa

```
src/
└── modules/
    └── rrhh/
        ├── components/                      # Componentes específicos del módulo
        │   ├── employees/
        │   │   ├── EmployeeCard.jsx
        │   │   ├── EmployeeTable.jsx
        │   │   ├── EmployeeFilters.jsx
        │   │   ├── EmployeeStats.jsx
        │   │   ├── EmployeeHeader.jsx
        │   │   ├── EmployeeInfoTab.jsx
        │   │   └── EmployeeAvatar.jsx
        │   │
        │   ├── absences/
        │   │   ├── AbsenceCalendar.jsx
        │   │   ├── AbsenceRequestModal.jsx
        │   │   ├���─ AbsenceApprovalCard.jsx
        │   │   ├── AbsenceBalance.jsx
        │   │   ├── AbsenceFilters.jsx
        │   │   ├── AbsenceApprovalList.jsx
        │   │   └── AbsenceTimeline.jsx
        │   │
        │   ├── payrolls/
        │   │   ├── PayrollCard.jsx
        │   │   ├── PayrollTable.jsx
        │   │   ├── PayrollDownloadButton.jsx
        │   │   ├── PayrollFilters.jsx
        │   │   ├── PayrollSummary.jsx
        │   │   └── PayrollDetailView.jsx
        │   │
        │   ├── contracts/
        │   │   ├── ContractTimeline.jsx
        │   │   ├── ContractCard. jsx
        │   │   ├── ContractForm.jsx
        │   │   ├── ContractHistory.jsx
        │   │   └── ContractStatusBadge.jsx
        │   │
        │   ├── departments/
        │   │   ├── DepartmentTree.jsx
        │   │   ├── DepartmentCard. jsx
        │   │   ├── DepartmentForm.jsx
        │   │   ├── DepartmentNode.jsx
        │   │   └── DepartmentStats.jsx
        │   │
        │   └── evaluations/
        │       ├── EvaluationCard.jsx
        │       ├── EvaluationForm.jsx
        │       ├── EvaluationChart.jsx
        │       ├── EvaluationHistory.jsx
        │       └── EvaluationCriteria.jsx
        │
        ├── pages/                           # Páginas principales del módulo
        │   ├── EmployeeList.jsx
        │   ├── EmployeeDetail.jsx
        │   ├── EmployeeForm.jsx
        │   ├── AbsenceManagement.jsx
        │   ├── PayrollList.jsx
        │   ├── PayrollDetail.jsx
        │   ├── ContractManagement.jsx
        │   ├── DepartmentManagement.jsx
        │   └── PerformanceReviews.jsx
        │
        ├── hooks/                           # Custom hooks del módulo
        │   ├── useEmployees.js
        │   ├── useEmployee.js
        │   ├── useAbsences.js
        │   ├── usePayrolls.js
        │   ├── useContracts.js
        │   ├── useDepartments.js
        │   ├── useEvaluations. js
        │   └── useEmployeeDocuments.js
        │
        ├── context/                         # Contexto específico del módulo
        │   ├── RRHHContext.jsx
        │   └── RRHHProvider.jsx
        │
        ├── services/                        # Servicios de comunicación con API
        │   └── rrhhService.js
        │
        ├── utils/                           # Utilidades específicas del módulo
        │   ├── employeeHelpers.js
        │   ├── absenceCalculations.js
        │   ├── payrollFormatters.js
        │   ├── dateUtils.js
        │   └── validators.js
        │
        ├── constants/                       # Constantes del módulo
        │   ├── employeeStatus.js
        │   ├── absenceTypes.js
        │   ├── contractTypes.js
        │   └── evaluationCriteria.js
        │
        ├── styles/                          # Estilos específicos del módulo
        │   ├── rrhh.module.css
        │   ├── employees.module.css
        │   ├── absences.module. css
        │   ├── payrolls.module.css
        │   └── departments.module.css
        │
        └── __tests__/                       # Tests del módulo
            ├── pages/
            │   ├── EmployeeList.test.jsx
            │   ├── EmployeeDetail.test.jsx
            │   └── AbsenceManagement.test.jsx
            ├── components/
            │   ├── EmployeeCard.test.jsx
            │   └── AbsenceRequestModal.test.jsx
            ├── hooks/
            │   ├── useEmployees.test.js
            │   └── useAbsences.test. js
            └── services/
                └── rrhhService.test. js
```

---

## 📄 Ejemplos de Código de Componentes

### 1. Página:  Listado de Empleados

```jsx
// pages/EmployeeList.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../hooks/useEmployees';
import EmployeeTable from '../components/employees/EmployeeTable';
import EmployeeFilters from '../components/employees/EmployeeFilters';
import EmployeeStats from '../components/employees/EmployeeStats';
import SearchBar from '@/components/common/SearchBar';
import Pagination from '@/components/common/Pagination';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import PageHeader from '@/components/common/PageHeader';
import styles from '../styles/employees.module.css';

const EmployeeList = () => {
  const navigate = useNavigate();
  const {
    employees,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    handleSearch,
    handlePageChange,
    refetch
  } = useEmployees();

  const handleCreateEmployee = () => {
    navigate('/rrhh/empleados/nuevo');
  };

  const handleViewEmployee = (id) => {
    navigate(`/rrhh/empleados/${id}`);
  };

  const handleEditEmployee = (id) => {
    navigate(`/rrhh/empleados/${id}/editar`);
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className={styles.employeeListContainer}>
      <PageHeader
        title="Gestión de Empleados"
        subtitle="Administra los empleados de la empresa"
        actions={
          <Button 
            variant="primary" 
            onClick={handleCreateEmployee}
            icon="plus"
          >
            Nuevo Empleado
          </Button>
        }
      />

      <EmployeeStats data={employees} />

      <div className={styles.filtersSection}>
        <SearchBar 
          placeholder="Buscar por nombre, email o número de empleado..."
          onSearch={handleSearch}
          className={styles.searchBar}
        />
        <EmployeeFilters 
          filters={filters}
          onFilterChange={setFilters}
        />
      </div>

      <EmployeeTable
        employees={employees}
        onView={handleViewEmployee}
        onEdit={handleEditEmployee}
        onRefresh={refetch}
      />

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination. totalPages}
        totalItems={pagination.totalItems}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default EmployeeList;
```

---

### 2. Página: Detalle de Empleado

```jsx
// pages/EmployeeDetail.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmployee } from '../hooks/useEmployee';
import Tabs from '@/components/common/Tabs';
import EmployeeHeader from '../components/employees/EmployeeHeader';
import EmployeeInfoTab from '../components/employees/EmployeeInfoTab';
import ContractTimeline from '../components/contracts/ContractTimeline';
import AbsenceCalendar from '../components/absences/AbsenceCalendar';
import PayrollTable from '../components/payrolls/PayrollTable';
import EvaluationList from '../components/evaluations/EvaluationHistory';
import DocumentList from '@/components/common/DocumentList';
import AuditLog from '@/components/common/AuditLog';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import NotFound from '@/components/common/NotFound';
import styles from '../styles/employees.module.css';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employee, loading, error, refetch } = useEmployee(id);
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'Datos Generales', icon: 'user' },
    { id: 'contracts', label: 'Contratos', icon: 'file-contract', badge: employee?.contracts?.length },
    { id: 'absences', label: 'Ausencias', icon: 'calendar' },
    { id: 'payrolls', label: 'Nóminas', icon: 'money' },
    { id: 'evaluations', label: 'Evaluaciones', icon: 'star' },
    { id: 'documents', label: 'Documentos', icon: 'folder', badge: employee?.documents?.length },
    { id: 'history', label: 'Historial', icon: 'clock' },
  ];

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (!employee) return <NotFound message="Empleado no encontrado" />;

  return (
    <div className={styles.employeeDetailContainer}>
      <EmployeeHeader 
        employee={employee} 
        onRefresh={refetch}
        onEdit={() => navigate(`/rrhh/empleados/${id}/editar`)}
        onBack={() => navigate('/rrhh/empleados')}
      />

      <Tabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onChange={setActiveTab}
        variant="underline"
      />

      <div className={styles.tabContent}>
        {activeTab === 'general' && (
          <EmployeeInfoTab employee={employee} onUpdate={refetch} />
        )}
        {activeTab === 'contracts' && (
          <ContractTimeline employeeId={id} />
        )}
        {activeTab === 'absences' && (
          <AbsenceCalendar employeeId={id} />
        )}
        {activeTab === 'payrolls' && (
          <PayrollTable employeeId={id} />
        )}
        {activeTab === 'evaluations' && (
          <EvaluationList employeeId={id} />
        )}
        {activeTab === 'documents' && (
          <DocumentList entityType="employee" entityId={id} />
        )}
        {activeTab === 'history' && (
          <AuditLog entityType="employee" entityId={id} />
        )}
      </div>
    </div>
  );
};

export default EmployeeDetail;
```

---

### 3. Página: Formulario de Empleado

```jsx
// pages/EmployeeForm.jsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { employeeSchema } from '../utils/validators';
import { useEmployee } from '../hooks/useEmployee';
import { useDepartments } from '../hooks/useDepartments';
import { rrhhService } from '../services/rrhhService';
import FormSection from '@/components/common/FormSection';
import InputField from '@/components/common/InputField';
import SelectField from '@/components/common/SelectField';
import DatePicker from '@/components/common/DatePicker';
import FileUpload from '@/components/common/FileUpload';
import Button from '@/components/common/Button';
import PageHeader from '@/components/common/PageHeader';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import toast from '@/utils/toast';
import styles from '../styles/employees.module. css';

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const { employee, loading:  loadingEmployee } = useEmployee(id);
  const { departments, loading: loadingDepartments } = useDepartments();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset
  } = useForm({
    resolver: yupResolver(employeeSchema)
  });

  useEffect(() => {
    if (employee && isEditMode) {
      reset(employee);
    }
  }, [employee, isEditMode, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        await rrhhService.updateEmployee(id, data);
        toast.success('Empleado actualizado correctamente');
        navigate(`/rrhh/empleados/${id}`);
      } else {
        const newEmployee = await rrhhService.createEmployee(data);
        toast.success('Empleado creado correctamente');
        navigate(`/rrhh/empleados/${newEmployee.id}`);
      }
    } catch (error) {
      toast.error(error.message || 'Error al guardar el empleado');
    }
  };

  const departmentOptions = departments?.map(dept => ({
    value: dept. id,
    label: dept. nombre
  })) || [];

  const supervisorOptions = [
    { value: '', label: 'Sin supervisor' },
    // Se cargarían dinámicamente los empleados que pueden ser supervisores
  ];

  if (loadingEmployee || loadingDepartments) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className={styles.employeeFormContainer}>
      <PageHeader
        title={isEditMode ? 'Editar Empleado' : 'Nuevo Empleado'}
        subtitle={isEditMode ? `Modificando datos de ${employee?.nombre} ${employee?.apellidos}` : 'Completa los datos del nuevo empleado'}
        onBack={() => navigate(-1)}
      />

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* Datos Personales */}
        <FormSection title="Datos Personales" icon="user" collapsible>
          <div className={styles.formGrid}>
            <InputField
              label="Nombre"
              {...register('nombre')}
              error={errors.nombre?.message}
              required
            />
            <InputField
              label="Apellidos"
              {...register('apellidos')}
              error={errors.apellidos?.message}
              required
            />
            <InputField
              label="DNI/NIE"
              {...register('dni')}
              error={errors. dni?.message}
              required
            />
            <DatePicker
              label="Fecha de Nacimiento"
              value={watch('fecha_nacimiento')}
              onChange={(date) => setValue('fecha_nacimiento', date)}
              error={errors.fecha_nacimiento?. message}
            />
            <InputField
              label="Dirección"
              {...register('direccion')}
              error={errors.direccion?.message}
              fullWidth
            />
          </div>
        </FormSection>

        {/* Datos Laborales */}
        <FormSection title="Datos Laborales" icon="briefcase" collapsible defaultOpen>
          <div className={styles.formGrid}>
            <InputField
              label="Número de Empleado"
              {...register('numero_empleado')}
              error={errors.numero_empleado?. message}
              placeholder="Ej: EMP-2024-001"
              required
            />
            <SelectField
              label="Departamento"
              {...register('departamento_id')}
              error={errors.departamento_id?.message}
              options={departmentOptions}
              required
            />
            <InputField
              label="Puesto"
              {...register('puesto')}
              error={errors.puesto?.message}
              placeholder="Ej: Desarrollador Senior"
              required
            />
            <DatePicker
              label="Fecha de Incorporación"
              value={watch('fecha_inicio')}
              onChange={(date) => setValue('fecha_inicio', date)}
              error={errors.fecha_inicio?.message}
              required
            />
            <SelectField
              label="Supervisor"
              {...register('manager_id')}
              error={errors.manager_id?.message}
              options={supervisorOptions}
            />
            <InputField
              label="Salario Base (€)"
              type="number"
              step="0.01"
              {... register('salario')}
              error={errors.salario?.message}
              placeholder="0. 00"
            />
          </div>
        </FormSection>

        {/* Datos de Contacto */}
        <FormSection title="Contacto" icon="phone" collapsible>
          <div className={styles.formGrid}>
            <InputField
              label="Email Corporativo"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="nombre. apellido@empresa.com"
              required
            />
            <InputField
              label="Teléfono"
              {...register('telefono')}
              error={errors.telefono?.message}
              placeholder="+34 600 000 000"
            />
            <InputField
              label="Teléfono Personal"
              {...register('telefono_personal')}
              error={errors.telefono_personal?.message}
            />
            <InputField
              label="Email Personal"
              type="email"
              {...register('email_personal')}
              error={errors. email_personal?.message}
            />
          </div>
        </FormSection>

        {/* Foto de Perfil */}
        <FormSection title="Foto de Perfil" icon="camera" collapsible>
          <FileUpload
            accept="image/*"
            maxSize={5}
            label="Selecciona una imagen (máx. 5MB)"
            onUpload={(url) => setValue('foto_url', url)}
            preview={watch('foto_url')}
            helpText="Formatos permitidos: JPG, PNG, GIF"
          />
        </FormSection>

        {/* Botones de Acción */}
        <div className={styles.formActions}>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            icon="save"
          >
            {isEditMode ? 'Guardar Cambios' : 'Crear Empleado'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
```

---

### 4. Página: Gestión de Ausencias

```jsx
// pages/AbsenceManagement.jsx
import React, { useState } from 'react';
import { useAbsences } from '../hooks/useAbsences';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import AbsenceRequestModal from '../components/absences/AbsenceRequestModal';
import AbsenceBalance from '../components/absences/AbsenceBalance';
import AbsenceFilters from '../components/absences/AbsenceFilters';
import AbsenceApprovalList from '../components/absences/AbsenceApprovalList';
import Button from '@/components/common/Button';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/common/Card';
import { useAuth } from '@/contexts/AuthContext';
import toast from '@/utils/toast';
import styles from '../styles/absences.module.css';

const AbsenceManagement = () => {
  const { user } = useAuth();
  const {
    absences,
    loading,
    balance,
    pendingApprovals,
    createAbsence,
    approveAbsence,
    rejectAbsence
  } = useAbsences();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState(null);
  const [filters, setFilters] = useState({
    employeeId: null,
    type: null,
    status: null
  });

  const handleDateSelect = (selectInfo) => {
    setSelectedDates({
      start: selectInfo.start,
      end: selectInfo. end
    });
    setIsModalOpen(true);
  };

  const handleRequestSubmit = async (data) => {
    try {
      await createAbsence(data);
      setIsModalOpen(false);
      toast.success('Solicitud de ausencia enviada correctamente');
    } catch (error) {
      toast.error(error.message || 'Error al crear la solicitud');
    }
  };

  const getAbsenceColor = (type) => {
    const colors = {
      'vacaciones': '#10b981',
      'baja_medica': '#ef4444',
      'permiso_retribuido': '#f59e0b',
      'permiso_sin_retribucion': '#6366f1'
    };
    return colors[type] || '#64748b';
  };

  const calendarEvents = absences.map(absence => ({
    id: absence.id,
    title: `${absence.tipo_display} - ${absence.empleado_nombre}`,
    start: absence.fecha_inicio,
    end: absence.fecha_fin,
    backgroundColor: getAbsenceColor(absence.tipo),
    borderColor: getAbsenceColor(absence.tipo),
    extendedProps: absence
  }));

  return (
    <div className={styles.absenceContainer}>
      <PageHeader
        title="Gestión de Ausencias y Vacaciones"
        subtitle="Solicita, aprueba y consulta ausencias"
        actions={
          <Button
            variant="primary"
            icon="plus"
            onClick={() => setIsModalOpen(true)}
          >
            Nueva Solicitud
          </Button>
        }
      />

      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <AbsenceBalance balance={balance} />
          
          <AbsenceFilters 
            filters={filters}
            onFilterChange={setFilters}
          />

          {user. isManager && pendingApprovals.length > 0 && (
            <Card title="Aprobaciones Pendientes" className={styles.approvalsCard}>
              <AbsenceApprovalList
                approvals={pendingApprovals}
                onApprove={approveAbsence}
                onReject={rejectAbsence}
              />
            </Card>
          )}

          {/* Leyenda */}
          <Card title="Leyenda" className={styles.legendCard}>
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: '#10b981' }}></span>
                <span>Vacaciones</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: '#ef4444' }}></span>
                <span>Baja Médica</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: '#f59e0b' }}></span>
                <span>Permiso Retribuido</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: '#6366f1' }}></span>
                <span>Permiso Sin Retribución</span>
              </div>
            </div>
          </Card>
        </aside>

        {/* Calendario Principal */}
        <main className={styles.calendarSection}>
          <Card>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              selectable={true}
              select={handleDateSelect}
              events={calendarEvents}
              locale={esLocale}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek'
              }}
              height="auto"
              buttonText={{
                today: 'Hoy',
                month: 'Mes',
                week: 'Semana'
              }}
              eventClick={(info) => {
                // Mostrar detalle de la ausencia
                console.log(info. event. extendedProps);
              }}
            />
          </Card>
        </main>
      </div>

      {/* Modal de Solicitud */}
      <AbsenceRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRequestSubmit}
        initialDates={selectedDates}
        balance={balance}
      />
    </div>
  );
};

export default AbsenceManagement;
```

---

### 5. Componente: EmployeeCard

```jsx
// components/employees/EmployeeCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';
import IconButton from '@/components/common/IconButton';
import { formatDate } from '@/utils/dateUtils';
import styles from './EmployeeCard.module.css';

const EmployeeCard = ({ employee, onEdit, onDelete, variant = 'default' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/rrhh/empleados/${employee.id}`);
  };

  const statusConfig = {
    activo: { variant: 'success', label: 'Activo' },
    inactivo: { variant: 'danger', label: 'Inactivo' },
    suspendido: { variant: 'warning', label: 'Suspendido' }
  };

  const status = statusConfig[employee.estado] || statusConfig.activo;

  return (
    <Card 
      className={styles.employeeCard} 
      onClick={handleClick}
      hoverable
      variant={variant}
    >
      <div className={styles.header}>
        <Avatar 
          src={employee.foto_url} 
          alt={`${employee.nombre} ${employee.apellidos}`}
          size="lg"
          status={employee.estado === 'activo' ? 'online' : 'offline'}
        />
        
        <div className={styles.info}>
          <h3 className={styles.name}>
            {employee.nombre} {employee.apellidos}
          </h3>
          <p className={styles.position}>{employee.puesto}</p>
          <p className={styles.department}>
            {employee.departamento?. nombre || 'Sin departamento'}
          </p>
        </div>

        <Badge variant={status.variant}>
          {status.label}
        </Badge>
      </div>

      <div className={styles.body}>
        <div className={styles.detail}>
          <span className={styles.label}>Email:</span>
          <span className={styles.value}>{employee.email}</span>
        </div>
        <div className={styles.detail}>
          <span className={styles.label}>Teléfono:</span>
          <span className={styles.value}>
            {employee.telefono || 'No especificado'}
          </span>
        </div>
        <div className={styles.detail}>
          <span className={styles. label}>Nº Empleado:</span>
          <span className={styles.value}>{employee.numero_empleado}</span>
        </div>
        <div className={styles.detail}>
          <span className={styles.label}>Fecha de ingreso:</span>
          <span className={styles.value}>
            {formatDate(employee.fecha_inicio)}
          </span>
        </div>
      </div>

      <div className={styles.actions}>
        <IconButton 
          icon="eye" 
          tooltip="Ver detalle"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/rrhh/empleados/${employee.id}`);
          }}
        />
        <IconButton 
          icon="edit" 
          tooltip="Editar"
          onClick={(e) => {
            e. stopPropagation();
            onEdit? .(employee);
          }}
        />
        {employee.estado === 'activo' && (
          <IconButton 
            icon="ban" 
            tooltip="Desactivar"
            variant="warning"
            onClick={(e) => {
              e.stopPropagation();
              onDelete? .(employee.id);
            }}
          />
        )}
      </div>
    </Card>
  );
};

export default EmployeeCard;
```

---

### 6. Componente: AbsenceRequestModal

```jsx
// components/absences/AbsenceRequestModal.jsx
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Modal from '@/components/common/Modal';
import InputField from '@/components/common/InputField';
import SelectField from '@/components/common/SelectField';
import DateRangePicker from '@/components/common/DateRangePicker';
import TextArea from '@/components/common/TextArea';
import Button from '@/components/common/Button';
import Alert from '@/components/common/Alert';
import { ABSENCE_TYPES } from '../../constants/absenceTypes';
import { calculateBusinessDays } from '../../utils/absenceCalculations';
import styles from './AbsenceRequestModal.module. css';

const schema = yup.object({
  tipo: yup.string().required('El tipo de ausencia es obligatorio'),
  fecha_inicio: yup.date().required('La fecha de inicio es obligatoria'),
  fecha_fin: yup.date()
    .required('La fecha de fin es obligatoria')
    .min(yup.ref('fecha_inicio'), 'La fecha de fin debe ser posterior a la de inicio'),
  motivo: yup.string().required('El motivo es obligatorio').min(10, 'El motivo debe tener al menos 10 caracteres'),
  observaciones: yup.string()
});

const AbsenceRequestModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialDates,
  balance 
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fecha_inicio: initialDates?.start,
      fecha_fin: initialDates?.end,
      tipo: 'vacaciones'
    }
  });

  const selectedType = watch('tipo');
  const dateRange = watch(['fecha_inicio', 'fecha_fin']);

  const requestedDays = useMemo(() => {
    if (!dateRange[0] || !dateRange[1]) return 0;
    return calculateBusinessDays(dateRange[0], dateRange[1]);
  }, [dateRange]);

  const hasEnoughDays = useMemo(() => {
    if (selectedType !== 'vacaciones') return true;
    return balance?. vacaciones >= requestedDays;
  }, [selectedType, balance, requestedDays]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva Solicitud de Ausencia"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Balance Info */}
        <div className={styles.balanceInfo}>
          <h4>Balance de días disponibles</h4>
          <div className={styles.balanceGrid}>
            <div className={styles.balanceItem}>
              <span className={styles.balanceLabel}>Vacaciones: </span>
              <strong className={styles.balanceValue}>
                {balance?.vacaciones || 0} días
              </strong>
            </div>
            <div className={styles.balanceItem}>
              <span className={styles.balanceLabel}>Permisos: </span>
              <strong className={styles.balanceValue}>
                {balance?.permisos || 0} días
              </strong>
            </div>
          </div>
        </div>

        {/* Tipo de Ausencia */}
        <SelectField
          label="Tipo de Ausencia"
          {...register('tipo')}
          error={errors.tipo?. message}
          options={ABSENCE_TYPES}
          required
        />

        {/* Periodo */}
        <DateRangePicker
          label="Periodo"
          startDate={watch('fecha_inicio')}
          endDate={watch('fecha_fin')}
          onStartDateChange={(date) => setValue('fecha_inicio', date)}
          onEndDateChange={(date) => setValue('fecha_fin', date)}
          error={errors.fecha_inicio?.message || errors.fecha_fin?.message}
          minDate={new Date()}
          required
        />

        {/* Días solicitados */}
        <div className={styles. daysInfo}>
          <span className={styles. daysLabel}>Días laborables solicitados:</span>
          <strong className={styles.daysValue}>{requestedDays}</strong>
        </div>

        {/* Alerta si no hay suficientes días */}
        {!hasEnoughDays && (
          <Alert variant="warning">
            No tienes suficientes días de vacaciones disponibles.  
            Disponibles: {balance?.vacaciones || 0}, Solicitados: {requestedDays}
          </Alert>
        )}

        {/* Motivo */}
        <InputField
          label="Motivo"
          {...register('motivo')}
          error={errors.motivo?.message}
          placeholder="Ej:  Vacaciones de verano"
          required
        />

        {/* Observaciones */}
        <TextArea
          label="Observaciones"
          {...register('observaciones')}
          error={errors.observaciones?.message}
          placeholder="Información adicional (opcional)"
          rows={4}
        />

        {/* Acciones */}
        <div className={styles.actions}>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            loading={isSubmitting}
            disabled={!hasEnoughDays}
          >
            Enviar Solicitud
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AbsenceRequestModal;
```

---

### 7. Custom Hook: useEmployees

```javascript
// hooks/useEmployees. js
import { useState, useEffect, useCallback } from 'react';
import { rrhhService } from '../services/rrhhService';
import { useRRHHContext } from '../context/RRHHContext';
import { debounce } from '@/utils/debounce';

export const useEmployees = (initialFilters = {}) => {
  const { state } = useRRHHContext();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 20,
    totalPages: 1,
    totalItems: 0
  });

  const [filters, setFilters] = useState({
    ... initialFilters,
    ... state.filters
  });

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pagination.page,
        per_page: pagination.perPage,
        ...filters
      };
      const data = await rrhhService.getEmployees(params);
      
      setEmployees(data.employees || data. data || []);
      setPagination({
        page: data.page || data.current_page,
        perPage:  data.per_page || data. items_per_page,
        totalPages: data.total_pages,
        totalItems: data.total_items || data.total
      });
    } catch (err) {
      setError(err.message || 'Error al cargar empleados');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, [pagination. page, pagination.perPage, filters]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleSearch = debounce((searchTerm) => {
    setFilters(prev => ({ ...prev, searchTerm }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, 300);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const refetch = () => {
    fetchEmployees();
  };

  return {
    employees,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    handleSearch,
    handlePageChange,
    refetch
  };
};
```

---

### 8. Servicio:  rrhhService.js

```javascript
// services/rrhhService.js
import api from '@/services/api';

const BASE_URL = '/api/v1';

export const rrhhService = {
  // ============ EMPLEADOS ============
  getEmployees: async (params = {}) => {
    const response = await api.get(`${BASE_URL}/employees`, { params });
    return response.data;
  },

  getEmployeeById: async (id) => {
    const response = await api.get(`${BASE_URL}/employees/${id}`);
    return response.data;
  },

  createEmployee: async (data) => {
    const response = await api.post(`${BASE_URL}/employees`, data);
    return response.data;
  },

  updateEmployee: async (id, data) => {
    const response = await api.patch(`${BASE_URL}/employees/${id}`, data);
    return response.data;
  },

  deactivateEmployee: async (id) => {
    const response = await api.patch(`${BASE_URL}/employees/${id}/deactivate`);
    return response.data;
  },

  // ============ AUSENCIAS ============
  getAbsences: async (params = {}) => {
    const response = await api.get(`${BASE_URL}/absences`, { params });
    return response.data;
  },

  createAbsence: async (data) => {
    const response = await api.post(`${BASE_URL}/absences`, data);
    return response.data;
  },

  approveAbsence: async (id) => {
    const response = await api.patch(`${BASE_URL}/absences/${id}/approve`);
    return response.data;
  },

  rejectAbsence: async (id, reason) => {
    const response = await api.patch(`${BASE_URL}/absences/${id}/reject`, { reason });
    return response.data;
  },

  getEmployeeAbsenceBalance: async (employeeId) => {
    const response = await api.get(`${BASE_URL}/employees/${employeeId}/absence-balance`);
    return response.data;
  },

  // ============ NÓMINAS ============
  getPayrolls: async (params = {}) => {
    const response = await api.get(`${BASE_URL}/payrolls`, { params });
    return response.data;
  },

  getPayrollById: async (id) => {
    const response = await api.get(`${BASE_URL}/payrolls/${id}`);
    return response.data;
  },

  downloadPayrollPDF: async (id) => {
    const response = await api.get(`${BASE_URL}/payrolls/${id}/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // ============ CONTRATOS ============
  getEmployeeContracts: async (employeeId) => {
    const response = await api.get(`${BASE_URL}/employees/${employeeId}/contracts`);
    return response.data;
  },

  createContract: async (data) => {
    const response = await api. post(`${BASE_URL}/contracts`, data);
    return response.data;
  },

  // ============ DEPARTAMENTOS ============
  getDepartments: async () => {
    const response = await api.get(`${BASE_URL}/departments`);
    return response.data;
  },

  createDepartment: async (data) => {
    const response = await api.post(`${BASE_URL}/departments`, data);
    return response.data;
  },

  updateDepartment: async (id, data) => {
    const response = await api.patch(`${BASE_URL}/departments/${id}`, data);
    return response.data;
  },

  deleteDepartment: async (id) => {
    const response = await api.delete(`${BASE_URL}/departments/${id}`);
    return response.data;
  },

  // ============ EVALUACIONES ============
  getEvaluations: async (params = {}) => {
    const response = await api.get(`${BASE_URL}/evaluations`, { params });
    return response.data;
  },

  createEvaluation: async (data) => {
    const response = await api.post(`${BASE_URL}/evaluations`, data);
    return response.data;
  },

  getEmployeeEvaluations: async (employeeId) => {
    const response = await api.get(`${BASE_URL}/employees/${employeeId}/evaluations`);
    return response.data;
  },

  // ============ DOCUMENTOS ============
  uploadEmployeeDocument: async (employeeId, formData) => {
    const response = await api.post(
      `${BASE_URL}/employees/${employeeId}/documents`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );
    return response.data;
  },

  getEmployeeDocuments:  async (employeeId) => {
    const response = await api. get(`${BASE_URL}/employees/${employeeId}/documents`);
    return response.data;
  }
};

export default rrhhService;
```

---

### 9. Constantes: absenceTypes.js

```javascript
// constants/absenceTypes.js
export const ABSENCE_TYPES = [
  { value: 'vacaciones', label:  'Vacaciones', color: '#10b981' },
  { value: 'baja_medica', label: 'Baja Médica', color: '#ef4444' },
  { value: 'permiso_retribuido', label:  'Permiso Retribuido', color: '#f59e0b' },
  { value: 'permiso_sin_retribucion', label: 'Permiso sin Retribución', color: '#6366f1' },
  { value: 'licencia_maternidad', label: 'Licencia de Maternidad', color: '#ec4899' },
  { value: 'licencia_paternidad', label:  'Licencia de Paternidad', color: '#8b5cf6' },
];

export const ABSENCE_STATUS = {
  PENDING: 'pendiente',
  APPROVED: 'aprobada',
  REJECTED: 'rechazada',
  CANCELLED: 'cancelada'
};

export const ABSENCE_STATUS_LABELS = {
  [ABSENCE_STATUS.PENDING]:  'Pendiente',
  [ABSENCE_STATUS.APPROVED]: 'Aprobada',
  [ABSENCE_STATUS. REJECTED]: 'Rechazada',
  [ABSENCE_STATUS.CANCELLED]: 'Cancelada'
};
```

---

### 10. Rutas del Módulo

```jsx
// routes/rrhhRoutes.jsx
import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import { RRHHProvider } from '../modules/rrhh/context/RRHHProvider';
import ProtectedRoute from '@/components/common/ProtectedRoute';

// Lazy loading
const EmployeeList = lazy(() => import('../modules/rrhh/pages/EmployeeList'));
const EmployeeDetail = lazy(() => import('../modules/rrhh/pages/EmployeeDetail'));
const EmployeeForm = lazy(() => import('../modules/rrhh/pages/EmployeeForm'));
const AbsenceManagement = lazy(() => import('../modules/rrhh/pages/AbsenceManagement'));
const PayrollList = lazy(() => import('../modules/rrhh/pages/PayrollList'));
const PayrollDetail = lazy(() => import('../modules/rrhh/pages/PayrollDetail'));
const DepartmentManagement = lazy(() => import('../modules/rrhh/pages/DepartmentManagement'));
const PerformanceReviews = lazy(() => import('../modules/rrhh/pages/PerformanceReviews'));

const rrhhRoutes = (
  <Route
    path="/rrhh"
    element={
      <RRHHProvider>
        <ProtectedRoute requiredPermission="rrhh.view" />
      </RRHHProvider>
    }
  >
    <Route index element={<EmployeeList />} />
    <Route path="empleados" element={<EmployeeList />} />
    <Route path="empleados/nuevo" element={<EmployeeForm />} />
    <Route path="empleados/:id" element={<EmployeeDetail />} />
    <Route path="empleados/:id/editar" element={<EmployeeForm />} />
    <Route path="ausencias" element={<AbsenceManagement />} />
    <Route path="nominas" element={<PayrollList />} />
    <Route path="nominas/:id" element={<PayrollDetail />} />
    <Route 
      path="departamentos" 
      element={
        <ProtectedRoute requiredPermission="rrhh.manage_departments">
          <DepartmentManagement />
        </ProtectedRoute>
      } 
    />
    <Route path="evaluaciones" element={<PerformanceReviews />} />
  </Route>
);

export default rrhhRoutes;
```

---

## 📦 Dependencias Específicas del Módulo

```json
{
  "dependencies": {
    "@fullcalendar/react": "^6.1.10",
    "@fullcalendar/daygrid": "^6.1.10",
    "@fullcalendar/interaction": "^6.1.10",
    "@fullcalendar/core": "^6.1.10",
    "react-hook-form": "^7.49.0",
    "@hookform/resolvers": "^3.3.3",
    "yup": "^1.3.3",
    "date-fns": "^3.0.0"
  }
}
```

---

Este archivo contiene todos los ejemplos de código necesarios para implementar el módulo RRHH en React. 
