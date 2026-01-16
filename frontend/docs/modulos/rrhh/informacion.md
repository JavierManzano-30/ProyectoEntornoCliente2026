# Documentación Técnica - Módulo RRHH Frontend

## 📋 Índice

1. [Visión General](#-visión-general)
2. [Arquitectura del Módulo](#-arquitectura-del-módulo)
3. [Integración con Backend](#-integración-con-backend)
4. [Pantallas y Funcionalidades](#-pantallas-y-funcionalidades)
5. [Gestión de Estado](#-gestión-de-estado)
6. [Comunicación con API](#-comunicación-con-api)
7. [Validaciones y Reglas de Negocio](#-validaciones-y-reglas-de-negocio)
8. [Integración con Otros Módulos](#-integración-con-otros-módulos)
9. [Consideraciones de UX/UI](#-consideraciones-de-uxui)
10. [Testing](#-testing)
11. [Métricas y Monitoreo](#-métricas-y-monitoreo)
12. [Guía de Desarrollo](#-guía-de-desarrollo)

---

## 🎯 Visión General

### Propósito del Módulo

El módulo **RRHH (Recursos Humanos)** del frontend es responsable de proporcionar una interfaz completa y eficiente para la gestión integral de empleados, contratos, ausencias, nóminas y estructura organizativa de la empresa.

Este módulo actúa como **punto central de administración de personal**, proporcionando herramientas tanto para el departamento de Recursos Humanos como para empleados y managers.

### Objetivos Principales

1. **Gestión Integral de Empleados**
   - Alta, consulta, edición y baja de empleados
   - Mantenimiento de datos personales y laborales
   - Gestión de documentación asociada

2. **Control de Ausencias y Vacaciones**
   - Solicitud de ausencias por parte de empleados
   - Aprobación/rechazo por parte de managers
   - Visualización de calendarios y balances

3. **Administración Salarial**
   - Consulta de nóminas
   - Descarga de documentos PDF
   - Histórico de pagos

4. **Estructura Organizativa**
   - Gestión de departamentos jerárquicos
   - Asignación de empleados a departamentos
   - Visualización de organigrama

5. **Evaluación de Desempeño**
   - Registro de evaluaciones periódicas
   - Consulta de histórico
   - Seguimiento de objetivos

6. **Integración Transversal**
   - Proveer información de empleados a otros módulos (ALM, BPM, ERP, BI)
   - Consumir datos de autenticación del módulo CORE

---

## 🏗️ Arquitectura del Módulo

### Principios de Diseño

El módulo RRHH Frontend está diseñado siguiendo estos principios arquitectónicos:

#### 1. **Separación de Responsabilidades**

```
┌─────────────────────────────────────────┐
│          CAPA DE PRESENTACIÓN           │
│  (Páginas y Componentes Visuales)       │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         CAPA DE LÓGICA DE NEGOCIO       │
│    (Custom Hooks y Context)             │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         CAPA DE SERVICIOS               │
│    (Comunicación con API)               │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│           BACKEND API                   │
│      (Endpoints RESTful)                │
└─────────────────────────────────────────┘
```

#### 2. **Composición de Componentes**

- **Componentes Atómicos**: Botones, inputs, badges (reutilizables globalmente)
- **Componentes Moleculares**: Cards, tablas, formularios (específicos del módulo)
- **Componentes Organismos**: Secciones completas, layouts
- **Páginas**:  Composición de organismos y contexto específico

#### 3. **Gestión de Estado Predictible**

- **Estado Local**: `useState` para componentes individuales
- **Estado Compartido**: Context API para el módulo
- **Estado de Servidor**: React Query o custom hooks con caché

#### 4. **Code Splitting y Lazy Loading**

```javascript
// Optimización de carga
const EmployeeList = lazy(() => import('./pages/EmployeeList'));
const EmployeeDetail = lazy(() => import('./pages/EmployeeDetail'));
```

---

## 🔗 Integración con Backend

### Concordancia con Backend RRHH

El módulo frontend está **completamente alineado** con la documentación del backend RRHH:

#### Entidades Gestionadas

| Entidad Backend | Representación Frontend | Pantallas Asociadas |
|----------------|------------------------|---------------------|
| Empleados | Employee Objects | EmployeeList, EmployeeDetail, EmployeeForm |
| Departamentos | Department Tree | DepartmentManagement |
| Contratos | Contract Timeline | ContractManagement |
| Ausencias | Absence Events | AbsenceManagement |
| Nóminas | Payroll Documents | PayrollList, PayrollDetail |
| Evaluaciones | Performance Reviews | PerformanceReviews |

#### Mapeo de Endpoints

Todos los endpoints consumidos están documentados en el backend:

| Operación | Método | Endpoint | Pantalla Frontend |
|-----------|--------|----------|-------------------|
| Listar empleados | GET | `/api/v1/employees` | EmployeeList |
| Obtener empleado | GET | `/api/v1/employees/:id` | EmployeeDetail |
| Crear empleado | POST | `/api/v1/employees` | EmployeeForm |
| Actualizar empleado | PATCH | `/api/v1/employees/:id` | EmployeeForm |
| Desactivar empleado | PATCH | `/api/v1/employees/:id/deactivate` | EmployeeDetail |
| Listar ausencias | GET | `/api/v1/absences` | AbsenceManagement |
| Crear ausencia | POST | `/api/v1/absences` | AbsenceRequestModal |
| Aprobar ausencia | PATCH | `/api/v1/absences/:id/approve` | AbsenceApprovalList |
| Rechazar ausencia | PATCH | `/api/v1/absences/:id/reject` | AbsenceApprovalList |
| Balance de ausencias | GET | `/api/v1/employees/:id/absence-balance` | AbsenceBalance |
| Listar nóminas | GET | `/api/v1/payrolls` | PayrollList |
| Descargar nómina PDF | GET | `/api/v1/payrolls/:id/pdf` | PayrollDetail |
| Listar contratos | GET | `/api/v1/employees/:id/contracts` | ContractTimeline |
| Crear contrato | POST | `/api/v1/contracts` | ContractForm |
| Listar departamentos | GET | `/api/v1/departments` | DepartmentManagement |
| Crear departamento | POST | `/api/v1/departments` | DepartmentForm |
| Actualizar departamento | PATCH | `/api/v1/departments/:id` | DepartmentForm |
| Eliminar departamento | DELETE | `/api/v1/departments/:id` | DepartmentManagement |
| Listar evaluaciones | GET | `/api/v1/evaluations` | PerformanceReviews |
| Crear evaluación | POST | `/api/v1/evaluations` | EvaluationForm |
| Subir documento | POST | `/api/v1/employees/:id/documents` | FileUpload |

---

## 🖥️ Pantallas y Funcionalidades

### 1.  Listado de Empleados (`EmployeeList. jsx`)

#### Funcionalidad Completa

**Propósito**: Proporcionar una vista general de todos los empleados con capacidades avanzadas de búsqueda, filtrado y gestión.

**Características**: 

- ✅ **Tabla Responsive**: Adaptable a diferentes tamaños de pantalla
- ✅ **Búsqueda en Tiempo Real**: Búsqueda instantánea por nombre, email, número de empleado
- ✅ **Filtros Múltiples**:
  - Por departamento (selector desplegable)
  - Por estado (activo, inactivo, suspendido)
  - Por puesto de trabajo
  - Por fecha de incorporación (rango)
- ✅ **Ordenación**:  Por columnas (nombre, fecha incorporación, salario)
- ✅ **Paginación**: Con selector de elementos por página (10, 20, 50, 100)
- ✅ **Acciones Rápidas**:
  - Ver detalle (ícono ojo)
  - Editar (ícono lápiz)
  - Desactivar (ícono ban) - Solo empleados activos
- ✅ **Exportación**:  Descarga de listado en CSV/Excel
- ✅ **Estadísticas Rápidas**:
  - Total de empleados activos
  - Nuevas incorporaciones del mes
  - Distribución por departamento

**Permisos Requeridos**:
- `rrhh.view` - Ver listado de empleados
- `rrhh.create` - Botón "Nuevo Empleado"
- `rrhh.edit` - Acción de edición
- `rrhh.delete` - Acción de desactivación

**Navegación**:
- **Desde**:  Menú lateral → RRHH → Empleados
- **Hacia**: 
  - EmployeeDetail (clic en fila o botón ver)
  - EmployeeForm (botón nuevo/editar)

---

### 2. Detalle de Empleado (`EmployeeDetail.jsx`)

#### Funcionalidad Completa

**Propósito**: Mostrar información completa y centralizada de un empleado con navegación por pestañas.

**Características**:

**Pestaña:  Datos Generales**
- Información personal completa
- Datos laborales actuales
- Estado del empleado con indicador visual
- Botones de acción:  Editar, Desactivar, Enviar mensaje

**Pestaña:  Contratos**
- Timeline visual de contratos históricos
- Contrato actual destacado
- Información:  tipo, fecha inicio/fin, salario, jornada
- Descarga de documentos contractuales
- Botón para añadir nuevo contrato (managers/RRHH)

**Pestaña: Ausencias**
- Mini calendario de ausencias del empleado
- Balance de días disponibles/consumidos
- Filtro por tipo de ausencia y año
- Historial de solicitudes con estados
- Botón para nueva solicitud

**Pestaña: Nóminas**
- Tabla de nóminas ordenadas por fecha
- Información: periodo, bruto, neto, estado
- Botón de descarga individual en PDF
- Descarga masiva seleccionada
- Filtro por año/mes

**Pestaña:  Evaluaciones**
- Historial de evaluaciones de desempeño
- Gráfica de evolución de puntuación
- Detalle de última evaluación
- Botón para nueva evaluación (managers)

**Pestaña:  Documentos**
- Gestor de archivos del empleado
- Categorías:  CV, contratos, certificados, formación
- Subida de nuevos documentos
- Visualización/descarga

**Pestaña: Historial**
- Registro de auditoría completo
- Cambios en datos personales/laborales
- Modificaciones de salario
- Cambios de departamento/puesto
- Filtro por tipo de cambio y fecha

**Permisos Requeridos**: 
- `rrhh.view` - Ver información básica
- `rrhh.view_salary` - Ver información salarial
- `rrhh.view_contracts` - Ver contratos
- `rrhh.view_evaluations` - Ver evaluaciones
- `rrhh.edit` - Editar empleado

---

### 3. Formulario de Empleado (`EmployeeForm.jsx`)

#### Funcionalidad Completa

**Propósito**: Crear nuevos empleados o editar datos de empleados existentes.

**Características**:

**Validaciones en Tiempo Real**:
- ✅ Campos obligatorios resaltados
- ✅ Formato de email válido
- ✅ DNI/NIE con formato correcto
- ✅ Número de empleado único
- ✅ Fecha de nacimiento (mayor de 16 años)
- ✅ Salario numérico positivo
- ✅ Email corporativo único en el sistema

**Campos Agrupados por Sección**: 

1. **Datos Personales** (Colapsable)
   - Nombre*
   - Apellidos*
   - DNI/NIE*
   - Fecha de nacimiento
   - Dirección completa
   - Ciudad
   - Código postal
   - País

2. **Datos Laborales** (Colapsable, abierto por defecto)
   - Número de empleado* (autogenerado opcional)
   - Departamento* (selector con búsqueda)
   - Puesto*
   - Fecha de incorporación*
   - Supervisor (selector de empleados)
   - Salario base
   - Tipo de jornada (completa, parcial, reducida)

3. **Datos de Contacto** (Colapsable)
   - Email corporativo*
   - Teléfono corporativo
   - Email personal
   - Teléfono personal
   - Contacto de emergencia (nombre + teléfono)

4. **Foto de Perfil** (Colapsable)
   - Subida de imagen con preview
   - Recorte de imagen opcional
   - Formatos: JPG, PNG, GIF
   - Tamaño máximo: 5MB

5. **Configuración de Usuario** (Opcional, solo al crear)
   - Crear usuario de acceso al sistema
   - Email de usuario (por defecto, email corporativo)
   - Rol inicial
   - Enviar email de bienvenida

**Acciones**:
- **Guardar**: Valida y envía al backend
- **Guardar y Continuar**: Guarda y permanece en el formulario
- **Cancelar**: Vuelve a la pantalla anterior con confirmación si hay cambios
- **Restablecer**: Limpia el formulario (solo en creación)

**Comportamiento**:
- Autoguardado como borrador cada 2 minutos (opcional)
- Confirmación antes de salir si hay cambios sin guardar
- Feedback visual de éxito/error
- Redirección al detalle tras crear/editar

**Permisos**:
- `rrhh.create` - Crear empleado
- `rrhh.edit` - Editar empleado
- `rrhh.manage_users` - Crear usuario asociado

---

### 4. Gestión de Ausencias (`AbsenceManagement.jsx`)

#### Funcionalidad Completa

**Propósito**: Administrar solicitudes, aprobaciones y consulta de ausencias y vacaciones.

**Características**: 

**Vista Principal:  Calendario**
- Calendario mensual/anual con FullCalendar
- Eventos coloreados por tipo de ausencia: 
  - 🟢 Verde: Vacaciones
  - 🔴 Rojo: Baja médica
  - 🟡 Amarillo: Permiso retribuido
  - 🔵 Azul:  Permiso sin retribución
- Selección de rango de fechas para nueva solicitud
- Tooltip al pasar sobre evento con detalles
- Vista mensual, semanal

**Panel Lateral Izquierdo**: 

1. **Balance de Días**
   - Vacaciones disponibles/consumidas
   - Permisos disponibles/consumidos
   - Gráfica de progreso circular
   - Proyección de días restantes

2. **Filtros**
   - Por empleado (solo managers/RRHH)
   - Por tipo de ausencia
   - Por estado (pendiente, aprobada, rechazada)
   - Por rango de fechas

3. **Aprobaciones Pendientes** (Solo managers)
   - Lista de solicitudes pendientes del equipo
   - Información:  empleado, fechas, días, tipo
   - Acciones rápidas: Aprobar/Rechazar
   - Badge con contador

4. **Leyenda de Colores**
   - Código de colores por tipo

**Modal de Nueva Solicitud**:
- Selector de tipo de ausencia
- Selector de rango de fechas (DateRangePicker)
- Cálculo automático de días laborables
- Validación de días disponibles
- Campo de motivo (obligatorio)
- Campo de observaciones (opcional)
- Alerta si no hay suficientes días
- Preview de días solicitados vs disponibles

**Funcionalidades Especiales**:
- ⚠️ Advertencia si hay ausencias solapadas del equipo
- 📧 Notificación automática al manager tras solicitud
- 🔔 Notificación al empleado tras aprobación/rechazo
- 📊 Exportación de calendario a ICS
- 📈 Estadísticas de ausencias por departamento (managers)

**Permisos**:
- `rrhh.view_absences` - Ver ausencias propias
- `rrhh.view_all_absences` - Ver ausencias de todos
- `rrhh.create_absence` - Crear solicitudes
- `rrhh.approve_absences` - Aprobar/rechazar solicitudes

**Reglas de Negocio**:
- No se pueden solicitar ausencias en el pasado
- Las vacaciones requieren días disponibles
- Las bajas médicas pueden ser retroactivas (con justificante)
- Los managers solo aprueban ausencias de su equipo directo
- Ausencias de más de 15 días requieren aprobación de RRHH

---

### 5. Listado de Nóminas (`PayrollList.jsx`)

#### Funcionalidad Completa

**Propósito**: Consultar y descargar nóminas generadas. 

**Características**:

**Filtros Principales**:
- Año (selector)
- Mes (selector múltiple)
- Empleado (solo RRHH/managers)
- Estado (generada, firmada, enviada)

**Tabla de Nóminas**: 
- Columnas: 
  - Empleado (con avatar)
  - Periodo (Mes/Año)
  - Salario Bruto
  - Deducciones
  - Salario Neto
  - Estado (badge)
  - Fecha de generación
  - Acciones (ver, descargar)

**Resumen Agregado** (Solo RRHH):
- Total bruto del periodo
- Total deducciones
- Total neto
- Número de nóminas
- Gráfica de evolución salarial

**Acciones**:
- **Descargar Individual**: PDF de nómina específica
- **Descargar Masiva**: ZIP con PDFs seleccionados
- **Ver Detalle**: Navegación a PayrollDetail
- **Enviar por Email**: Reenvío de nómina al empleado

**Permisos**:
- `rrhh.view_payrolls` - Ver nóminas propias
- `rrhh.view_all_payrolls` - Ver todas las nóminas
- `rrhh.download_payrolls` - Descargar PDFs

---

### 6. Detalle de Nómina (`PayrollDetail.jsx`)

#### Funcionalidad Completa

**Propósito**: Visualizar desglose completo de una nómina específica.

**Características**: 

**Cabecera**:
- Datos del empleado
- Periodo
- Estado de la nómina
- Fecha de generación/pago

**Secciones**:

1. **Datos de la Empresa**
   - Razón social
   - CIF
   - Dirección

2. **Datos del Empleado**
   - Nombre completo
   - DNI/NIE
   - Número de Seguridad Social
   - Categoría profesional

3. **Devengos**
   - Salario base
   - Complementos salariales
   - Horas extra
   - Pluses
   - Total devengado

4. **Deducciones**
   - IRPF
   - Seguridad Social
   - Anticipos
   - Embargos
   - Total deducciones

5. **Líquido a Percibir**
   - Total neto destacado
   - Método de pago
   - Número de cuenta

**Acciones**:
- Descargar PDF
- Imprimir
- Compartir por email
- Volver a listado

---

### 7. Gestión de Departamentos (`DepartmentManagement.jsx`)

#### Funcionalidad Completa

**Propósito**: Administrar la estructura organizativa jerárquica de la empresa.

**Características**: 

**Vista de Árbol Jerárquico**:
- Representación visual de jerarquía
- Nodos expandibles/colapsables
- Información por nodo: 
  - Nombre del departamento
  - Número de empleados
  - Responsable
  - Acciones (editar, eliminar, añadir subdepartamento)

**Drag & Drop** (Opcional):
- Reorganizar departamentos arrastrando
- Validación de jerarquías válidas
- Confirmación antes de guardar

**Modal de Creación/Edición**:
- Nombre del departamento*
- Departamento padre (selector de árbol)
- Responsable (selector de empleados)
- Descripción
- Código (opcional, para reportes)
- Activo/Inactivo

**Validaciones**:
- No se puede eliminar departamento con empleados asignados
- No se pueden crear ciclos en la jerarquía
- El responsable debe pertenecer al departamento

**Vista Complementaria**:
- Lista plana con filtros
- Exportación de estructura a Excel
- Visualización de organigrama completo

**Permisos**:
- `rrhh.view_departments` - Ver departamentos
- `rrhh.manage_departments` - Crear/editar/eliminar

---

### 8. Evaluaciones de Desempeño (`PerformanceReviews.jsx`)

#### Funcionalidad Completa

**Propósito**: Gestionar evaluaciones periódicas de empleados.

**Características**: 

**Listado de Evaluaciones**: 
- Tabla con evaluaciones realizadas
- Filtros:  empleado, periodo, evaluador
- Información: fecha, puntuación, estado

**Formulario de Evaluación**: 
- Datos del empleado y periodo
- Criterios de evaluación configurables: 
  - Competencias técnicas
  - Habilidades interpersonales
  - Cumplimiento de objetivos
  - Asistencia y puntualidad
- Escala de puntuación (1-5 estrellas)
- Comentarios por criterio
- Comentarios generales
- Objetivos para el próximo periodo
- Fecha de próxima revisión

**Visualización de Resultados**: 
- Gráfica de radar con puntuaciones
- Comparativa con evaluaciones anteriores
- Evolución temporal
- Promedio del equipo (para comparación)

**Permisos**:
- `rrhh.view_evaluations` - Ver evaluaciones propias
- `rrhh.view_team_evaluations` - Ver evaluaciones del equipo
- `rrhh.create_evaluations` - Crear evaluaciones
