# Módulo RRHH - Frontend

## 📋 Descripción

El módulo de Recursos Humanos (RRHH) proporciona una interfaz completa para la gestión integral de empleados, ausencias, nóminas, contratos y estructura organizativa de la empresa.

## 🏗️ Estructura del Módulo

```
src/modules/rrhh/
├── components/          # Componentes reutilizables
│   ├── employees/      # Componentes de empleados
│   ├── absences/       # Componentes de ausencias
│   ├── payrolls/       # Componentes de nóminas
│   ├── departments/    # Componentes de departamentos
│   └── evaluations/    # Componentes de evaluaciones
├── pages/              # Páginas principales
│   ├── EmployeeList.jsx
│   ├── EmployeeDetail.jsx
│   ├── AbsenceManagement.jsx
│   ├── PayrollList.jsx
│   └── DepartmentManagement.jsx
├── hooks/              # Custom hooks
│   ├── useEmployees.js
│   ├── useEmployee.js
│   ├── useAbsences.js
│   ├── usePayrolls.js
│   ├── useDepartments.js
│   ├── useContracts.js
│   └── useEvaluations.js
├── services/           # Servicios API
│   └── rrhhService.js
├── utils/              # Utilidades
│   ├── employeeHelpers.js
│   ├── absenceCalculations.js
│   └── payrollFormatters.js
└── constants/          # Constantes
    ├── employeeStatus.js
    ├── absenceTypes.js
    ├── contractTypes.js
    └── evaluationCriteria.js
```

## 🚀 Funcionalidades Principales

### 1. Gestión de Empleados
- ✅ Listado completo con búsqueda y filtros
- ✅ Vista detallada de empleado
- ✅ Creación y edición de empleados
- ✅ Desactivación de empleados
- ✅ Estadísticas en tiempo real

### 2. Gestión de Ausencias
- ✅ Listado de ausencias con filtros
- ✅ Creación de solicitudes de ausencia
- ✅ Aprobación/rechazo de ausencias
- ✅ Cálculo automático de días laborables
- ✅ Balance de vacaciones

### 3. Gestión de Nóminas
- ✅ Listado de nóminas por período
- ✅ Descarga de PDF de nóminas
- ✅ Cálculo automático de neto
- ✅ Estadísticas salariales
- ✅ Filtros por año y mes

### 4. Gestión de Departamentos
- ✅ Vista de árbol jerárquico
- ✅ Creación y edición de departamentos
- ✅ Eliminación de departamentos
- ✅ Contador de empleados por departamento

### 5. Gestión de Contratos
- ✅ Historial de contratos por empleado
- ✅ Vista de contrato activo
- ✅ Timeline de contratos

### 6. Evaluaciones de Desempeño
- ✅ Historial de evaluaciones
- ✅ Última evaluación
- ✅ Cálculo de puntuación media

## 📡 Endpoints API Utilizados

### Empleados
- `GET /api/v1/employees` - Listar empleados
- `GET /api/v1/employees/:id` - Obtener empleado
- `POST /api/v1/employees` - Crear empleado
- `PATCH /api/v1/employees/:id` - Actualizar empleado
- `PATCH /api/v1/employees/:id/deactivate` - Desactivar empleado

### Ausencias
- `GET /api/v1/absences` - Listar ausencias
- `POST /api/v1/absences` - Crear ausencia
- `PATCH /api/v1/absences/:id/approve` - Aprobar ausencia
- `PATCH /api/v1/absences/:id/reject` - Rechazar ausencia

### Nóminas
- `GET /api/v1/payrolls` - Listar nóminas
- `GET /api/v1/payrolls/:id/pdf` - Descargar PDF

### Departamentos
- `GET /api/v1/departments` - Listar departamentos
- `POST /api/v1/departments` - Crear departamento
- `PATCH /api/v1/departments/:id` - Actualizar departamento
- `DELETE /api/v1/departments/:id` - Eliminar departamento

### Contratos
- `GET /api/v1/employees/:id/contracts` - Contratos de empleado
- `POST /api/v1/contracts` - Crear contrato

### Evaluaciones
- `GET /api/v1/employees/:id/evaluations` - Evaluaciones de empleado
- `POST /api/v1/evaluations` - Crear evaluación

## 🎨 Componentes Principales

### Páginas

#### EmployeeList
Lista paginada de empleados con:
- Búsqueda en tiempo real
- Filtros por estado, departamento
- Ordenamiento por columnas
- Métricas de resumen

#### EmployeeDetail
Detalles completos de un empleado con pestañas:
- Información general
- Contrato activo e historial
- Evaluaciones

#### AbsenceManagement
Gestión de ausencias con:
- Filtros por tipo, estado, fechas
- Aprobación/rechazo rápido
- Métricas de ausencias

#### PayrollList
Listado de nóminas con:
- Filtros por año y mes
- Descarga directa de PDF
- Cálculo de totales

#### DepartmentManagement
Estructura organizativa con:
- Vista de árbol jerárquico
- CRUD completo de departamentos
- Contador de empleados

### Custom Hooks

#### useEmployees
Hook principal para gestión de listado de empleados:
```javascript
const {
  employees,          // Empleados paginados
  loading,            // Estado de carga
  error,              // Errores
  filters,            // Filtros activos
  setFilters,         // Actualizar filtros
  pagination,         // Info de paginación
  handlePageChange,   // Cambiar página
  handleSearch,       // Búsqueda
  stats,              // Estadísticas
  refetch,            // Recargar datos
} = useEmployees();
```

#### useEmployee
Hook para gestión de un empleado individual:
```javascript
const {
  employee,           // Datos del empleado
  loading,            // Estado de carga
  error,              // Errores
  updating,           // Estado de actualización
  updateEmployeeData, // Actualizar empleado
  deactivate,         // Desactivar empleado
  refetch,            // Recargar datos
} = useEmployee(employeeId);
```

## 🛠️ Utilidades

### employeeHelpers.js
- `getFullName(employee)` - Nombre completo
- `getInitials(employee)` - Iniciales
- `isActiveEmployee(employee)` - Verificar si está activo
- `getYearsOfService(hireDate)` - Calcular antigüedad
- `formatSalary(amount)` - Formatear salario
- `filterEmployees(employees, filters)` - Filtrar empleados
- `sortEmployees(employees, sortBy, order)` - Ordenar empleados
- `calculateEmployeeStats(employees)` - Calcular estadísticas

### absenceCalculations.js
- `calculateDaysBetween(start, end)` - Días entre fechas
- `calculateWorkDays(start, end)` - Días laborables
- `doAbsencesOverlap(absence1, absence2)` - Verificar solapamiento
- `calculateAbsenceBalance(absences, allowed)` - Balance de ausencias
- `getAbsenceTypeColor(type)` - Color por tipo
- `filterAbsences(absences, filters)` - Filtrar ausencias

### payrollFormatters.js
- `formatCurrency(amount)` - Formatear moneda
- `formatPayrollPeriod(payroll)` - Formatear período
- `calculateNetAmount(payroll)` - Calcular neto
- `calculateDeductionPercentage(payroll)` - Porcentaje de deducción
- `filterPayrolls(payrolls, filters)` - Filtrar nóminas
- `generatePayrollFilename(payroll)` - Generar nombre de archivo

## 🎯 Próximos Pasos

- [ ] Implementar formularios de creación/edición
- [ ] Añadir calendario interactivo de ausencias
- [ ] Implementar drag & drop para organigrama
- [ ] Añadir gráficas de estadísticas
- [ ] Implementar exportación a Excel
- [ ] Añadir notificaciones push
- [ ] Implementar chat interno
- [ ] Añadir sistema de permisos granular

## 📝 Notas de Desarrollo

- Todos los hooks utilizan `useCallback` para optimizar el rendimiento
- Los componentes están optimizados con React.memo donde es necesario
- Se utiliza lazy loading para las páginas
- Los estilos siguen el sistema de diseño global
- Todas las fechas se formatean con `toLocaleDateString('es-ES')`
- Los montos se formatean con `Intl.NumberFormat`

## 🔗 Integración con Otros Módulos

El módulo RRHH se integra con:
- **CORE**: Autenticación y permisos de usuario
- **ALM**: Asignación de empleados a proyectos
- **BPM**: Flujos de aprobación de ausencias
- **ERP**: Datos salariales y financieros
- **BI**: Métricas y análisis de personal

## 📚 Documentación Adicional

Para más información, consulta:
- [Documentación del Backend](/backend/docs/modulos/rrhh/)
- [API Reference](/backend/docs/api/modulos/rrhh.md)
- [Guía de Estilos](/docs/style-guide.md)
