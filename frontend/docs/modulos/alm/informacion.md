# Documentación Técnica - Módulo ALM Frontend

---

## 🎯 Visión General

### Propósito del Módulo

El módulo **ALM (Application Lifecycle Management)** del frontend es responsable de proporcionar una interfaz completa y eficiente para la gestión integral de proyectos, tareas, sprints y seguimiento de tiempos de trabajo.

Este módulo actúa como **punto central de gestión de proyectos**, proporcionando herramientas tanto para managers de proyecto como para desarrolladores y dirección.

### Objetivos Principales

1. **Gestión Integral de Proyectos**
   - Alta, consulta, edición y cierre de proyectos
   - Mantenimiento de datos del proyecto y vinculación con clientes
   - Seguimiento de avance y presupuesto

2. **Control de Tareas**
   - Creación y asignación de tareas
   - Tablero Kanban con drag & drop
   - Priorización y seguimiento de estado

3. **Registro de Tiempos**
   - Registro de horas trabajadas por tarea
   - Comparación entre tiempo estimado y real
   - Generación de reportes temporales

4. **Planificación de Sprints**
   - Gestión de sprints ágiles
   - Backlog de producto
   - Burndown charts y métricas de velocidad

5. **Visualización y Métricas**
   - Dashboard con KPIs de proyectos
   - Gráficos de progreso y distribución
   - Alertas de tareas retrasadas

6. **Integración Transversal**
   - Proveer información de proyectos a otros módulos (BI, ERP)
   - Consumir datos de empleados del módulo RRHH
   - Integrar clientes desde CRM

---

## 🏗️ Arquitectura del Módulo

### Principios de Diseño

El módulo ALM Frontend está diseñado siguiendo estos principios arquitectónicos:

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

- **Componentes Atómicos**: Botones, badges, progress bars (reutilizables globalmente)
- **Componentes Moleculares**: Cards de proyecto/tarea, formularios (específicos del módulo)
- **Componentes Organismos**: Tablero Kanban, calendario, dashboards
- **Páginas**:  Composición de organismos y contexto específico

#### 3. **Gestión de Estado Predictible**

- **Estado Local**: `useState` para componentes individuales
- **Estado Compartido**: Context API para el módulo (filtros, vista seleccionada)
- **Estado de Servidor**: Custom hooks con caché para proyectos y tareas

#### 4. **Code Splitting y Lazy Loading**

```javascript
// Optimización de carga
const ProjectList = lazy(() => import('./pages/ProjectList'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const TaskManagement = lazy(() => import('./pages/TaskManagement'));
const TimeTracking = lazy(() => import('./pages/TimeTracking'));
```

---

## 🔗 Integración con Backend

### Concordancia con Backend ALM

El módulo frontend está **completamente alineado** con la documentación del backend ALM:

#### Entidades Gestionadas

| Entidad Backend | Representación Frontend | Pantallas Asociadas |
|----------------|------------------------|---------------------|
| Proyectos | Project Objects | ProjectList, ProjectDetail, ProjectForm |
| Tareas | Task Cards/Items | TaskManagement, TaskDetail, TaskBoard |
| Tiempos | Time Entries | TimeTracking, TimeLogTable |
| Sprints | Sprint Objects | SprintPlanning, SprintBoard |

#### Mapeo de Endpoints

Todos los endpoints consumidos están documentados en el backend:

| Operación | Método | Endpoint | Pantalla Frontend |
|-----------|--------|----------|-------------------|
| Listar proyectos | GET | `/api/v1/alm/proyectos` | ProjectList |
| Obtener proyecto | GET | `/api/v1/alm/proyectos/:id` | ProjectDetail |
| Crear proyecto | POST | `/api/v1/alm/proyectos` | ProjectForm |
| Actualizar proyecto | PUT | `/api/v1/alm/proyectos/:id` | ProjectForm |
| Eliminar proyecto | DELETE | `/api/v1/alm/proyectos/:id` | ProjectList |
| Obtener tareas del proyecto | GET | `/api/v1/alm/proyectos/:id/tareas` | ProjectDetail |
| Obtener estadísticas | GET | `/api/v1/alm/proyectos/:id/estadisticas` | ProjectDetail |
| Listar tareas | GET | `/api/v1/alm/tareas` | TaskManagement |
| Obtener tarea | GET | `/api/v1/alm/tareas/: id` | TaskDetail |
| Crear tarea | POST | `/api/v1/alm/tareas` | TaskForm |
| Actualizar tarea | PUT | `/api/v1/alm/tareas/:id` | TaskForm |
| Eliminar tarea | DELETE | `/api/v1/alm/tareas/:id` | TaskManagement |
| Actualizar estado tarea | PATCH | `/api/v1/alm/tareas/:id/estado` | TaskBoard |
| Asignar tarea | PATCH | `/api/v1/alm/tareas/:id/asignar` | TaskAssignmentDropdown |
| Listar registros de tiempo | GET | `/api/v1/alm/tiempos` | TimeTracking |
| Registrar tiempo | POST | `/api/v1/alm/tiempos` | TimeEntryForm |
| Actualizar tiempo | PUT | `/api/v1/alm/tiempos/: id` | TimeEntryForm |
| Eliminar tiempo | DELETE | `/api/v1/alm/tiempos/:id` | TimeTracking |
| Resumen tiempo por proyecto | GET | `/api/v1/alm/tiempos/proyecto/:id/resumen` | ProjectDetail |
| Tiempo por usuario | GET | `/api/v1/alm/tiempos/usuario/:id` | TimeTracking |
| Tiempo por tarea | GET | `/api/v1/alm/tiempos/tarea/:id` | TaskDetail |

---

## 🖥️ Pantallas y Funcionalidades

### 1. Listado de Proyectos (`ProjectList. jsx`)

#### Funcionalidad Completa

**Propósito**: Proporcionar una vista general de todos los proyectos con capacidades avanzadas de búsqueda, filtrado y gestión.

**Características**: 

- ✅ **Vista de Cards Responsive**: Grid adaptable a diferentes tamaños de pantalla
- ✅ **Búsqueda en Tiempo Real**: Búsqueda instantánea por nombre, descripción
- ✅ **Filtros Múltiples**:
  - Por estado (planificación, en_curso, pausado, completado)
  - Por responsable (selector de usuarios)
  - Por cliente (selector de clientes CRM)
  - Por rango de fechas (inicio/fin)
- ✅ **Ordenación**:  Por nombre, fecha inicio, fecha fin, progreso
- ✅ **Indicadores Visuales**:
  - Barra de progreso (tareas completadas/totales)
  - Badge de estado con código de color
  - Avatar del responsable
  - Nombre del cliente vinculado
- ✅ **Acciones Rápidas**:
  - Ver detalle (clic en card)
  - Editar (ícono lápiz)
  - Eliminar (ícono papelera) - Con confirmación
- ✅ **Estadísticas Rápidas**:
  - Total de proyectos activos
  - Proyectos en planificación
  - Proyectos completados este mes
  - Distribución por estado (gráfico circular)

**Permisos Requeridos**:
- `alm. view` - Ver listado de proyectos
- `alm.create` - Botón "Nuevo Proyecto"
- `alm.edit` - Acción de edición
- `alm.delete` - Acción de eliminación

**Navegación**:
- **Desde**:  Menú lateral → ALM → Proyectos
- **Hacia**: 
  - ProjectDetail (clic en card)
  - ProjectForm (botón nuevo/editar)

---

### 2. Detalle de Proyecto (`ProjectDetail.jsx`)

#### Funcionalidad Completa

**Propósito**: Mostrar información completa y centralizada de un proyecto con navegación por pestañas.

**Características**:

**Pestaña:  Información General**
- Nombre y descripción del proyecto
- Estado actual con badge
- Fechas de inicio y fin
- Responsable con avatar
- Cliente vinculado (si existe)
- Presupuesto
- Botones de acción:  Editar, Eliminar, Cambiar Estado

**Pestaña:  Tareas**
- Listado de tareas del proyecto
- Vista de tabla con filtros por estado/prioridad
- Botón para crear nueva tarea
- Acciones:  editar, eliminar, cambiar estado
- Estadísticas:  total, pendientes, en progreso, completadas

**Pestaña:  Progreso**
- Barra de progreso general
- Gráfico de distribución de tareas por estado
- Timeline de hitos del proyecto
- Métricas de avance: 
  - Tareas completadas vs totales
  - Porcentaje de progreso
  - Días transcurridos vs días totales
  - Velocidad estimada de finalización

**Pestaña:  Tiempos**
- Resumen de tiempo trabajado en el proyecto
- Tabla de registros de tiempo por tarea
- Comparación tiempo estimado vs real
- Gráfico de distribución de tiempo por usuario
- Total de horas trabajadas
- Coste laboral estimado (si disponible)

**Pestaña: Equipo**
- Lista de usuarios asignados a tareas del proyecto
- Avatar, nombre y rol
- Número de tareas asignadas por usuario
- Horas trabajadas por usuario
- Disponibilidad actual (integración con RRHH)

**Pestaña: Actividad**
- Timeline de actividad del proyecto
- Cambios de estado
- Creación/modificación de tareas
- Comentarios y notas
- Registro de tiempo
- Filtro por tipo de actividad y fecha

**Permisos Requeridos**:
- `alm.view` - Ver información del proyecto
- `alm.edit` - Editar proyecto
- `alm.delete` - Eliminar proyecto
- `alm.view_team` - Ver equipo asignado
- `alm.view_times` - Ver tiempos registrados

---

### 3. Formulario de Proyecto (`ProjectForm.jsx`)

#### Funcionalidad Completa

**Propósito**: Crear nuevos proyectos o editar proyectos existentes. 

**Características**:

**Validaciones en Tiempo Real**:
- ✅ Campos obligatorios resaltados
- ✅ Nombre mínimo 3 caracteres, máximo 100
- ✅ Fecha de fin posterior a fecha de inicio
- ✅ Presupuesto numérico positivo
- ✅ Responsable válido seleccionado
- ✅ Estado válido según opciones

**Campos del Formulario**: 

1. **Información Básica**
   - Nombre del proyecto* (Input de texto)
   - Descripción (Textarea, máximo 500 caracteres)
   - Estado* (Select:  planificación, en_curso, pausado, completado)

2. **Asignaciones**
   - Responsable* (Select con búsqueda de usuarios)
   - Cliente (Select opcional de clientes CRM)

3. **Planificación**
   - Fecha de inicio* (DatePicker)
   - Fecha de fin (DatePicker)
   - Presupuesto (Input numérico con formato moneda)

**Acciones**:
- **Crear Proyecto** / **Actualizar Proyecto**: Valida y envía al backend
- **Cancelar**: Vuelve a la pantalla anterior con confirmación si hay cambios
- **Restablecer**: Limpia el formulario (solo en creación)

**Comportamiento**:
- Confirmación antes de salir si hay cambios sin guardar
- Feedback visual de éxito/error
- Redirección al detalle del proyecto tras crear/editar
- Validación antes de envío

**Permisos**:
- `alm.create` - Crear proyecto
- `alm.edit` - Editar proyecto

---

### 4. Gestión de Tareas (`TaskManagement.jsx`)

#### Funcionalidad Completa

**Propósito**: Administrar tareas de proyectos con vistas flexibles (lista/tablero Kanban).

**Características**:

**Selector de Vista**:
- 📋 **Vista Lista**: Tabla con filtros y ordenación
- 📊 **Vista Tablero**:  Kanban con drag & drop

**Vista Lista - Características**:
- Tabla responsive con columnas: 
  - Título de la tarea
  - Proyecto asociado
  - Estado (badge)
  - Prioridad (badge)
  - Asignado a (avatar + nombre)
  - Fecha límite
  - Horas estimadas/reales
  - Acciones
- Filtros avanzados:
  - Por proyecto
  - Por estado
  - Por prioridad
  - Por usuario asignado
  - Por rango de fechas
  - Por búsqueda de texto
- Ordenación por cualquier columna
- Selección múltiple para acciones masivas
- Paginación

**Vista Tablero Kanban - Características**: 
- 3 columnas principales:
  - 🟦 **Pendiente**
  - 🟨 **En Progreso**
  - 🟩 **Completada**
- Drag & Drop entre columnas
  - Arrastra una task card a otra columna
  - Actualización optimista del estado
  - Rollback en caso de error
- Task Cards muestran:
  - Título de la tarea
  - Badge de prioridad
  - Avatar del asignado
  - Fecha límite con indicador de retraso
  - Tiempo estimado vs real
- Contador de tareas por columna
- Filtros aplicables también en vista tablero
- Indicador visual de columna activa durante drag

**Modal de Creación/Edición de Tarea**:
- Título de la tarea* (Input)
- Descripción (Textarea)
- Proyecto* (Select con búsqueda)
- Asignado a (Select de usuarios)
- Estado* (Select: pendiente, en_progreso, completada)
- Prioridad* (Select: baja, media, alta)
- Fecha límite (DatePicker)
- Horas estimadas (Input numérico)

**Validaciones**:
- Título obligatorio (3-200 caracteres)
- Proyecto obligatorio
- Horas estimadas positivas
- Fecha límite no en el pasado

**Funcionalidades Especiales**:
- ⚠️ Alerta visual para tareas retrasadas (fecha límite pasada)
- 🔔 Notificación al asignar tarea a un usuario
- 📊 Estadísticas rápidas: 
  - Total de tareas
  - Distribución por estado
  - Tareas retrasadas
  - Tareas sin asignar
- 🔄 Actualización en tiempo real del tablero
- 📤 Exportación de tareas a CSV

**Permisos**: 
- `alm.view` - Ver tareas
- `alm.create` - Crear tareas
- `alm.edit` - Editar tareas
- `alm.delete` - Eliminar tareas
- `alm.assign_tasks` - Asignar tareas a usuarios

**Reglas de Negocio**:
- Solo se pueden asignar tareas a usuarios activos
- Las tareas completadas no se pueden volver a estado pendiente sin motivo
- Las tareas sin proyecto no son válidas
- Una tarea en progreso debe estar asignada

---

### 5. Detalle de Tarea (`TaskDetail.jsx`)

#### Funcionalidad Completa

**Propósito**: Visualizar y gestionar información completa de una tarea específica.

**Características**: 

**Sección Principal**:
- Título de la tarea (editable inline)
- Estado actual con selector rápido de cambio
- Prioridad con selector rápido
- Descripción completa (editable inline)
- Proyecto padre (enlace a ProjectDetail)
- Usuario asignado (selector con avatares)
- Fechas: 
  - Fecha de creación
  - Fecha límite
  - Fecha de última modificación

**Panel Lateral Derecho**: 

1. **Información Rápida**
   - Tiempo estimado
   - Tiempo real registrado
   - Diferencia (estimado - real)
   - Badge de estado de tiempo (en plazo, excedido)

2. **Acciones Rápidas**
   - Editar tarea completa
   - Eliminar tarea
   - Duplicar tarea
   - Mover a otro proyecto
   - Cambiar estado
   - Asignar a otro usuario

**Sección de Tiempos**:
- Tabla de registros de tiempo en esta tarea
- Usuario, fecha, horas, descripción
- Botón para registrar nuevo tiempo
- Total de horas trabajadas
- Comparación con estimación

**Sección de Comentarios**:
- Timeline de comentarios
- Avatar del autor, fecha, texto
- Formulario para nuevo comentario
- Edición/eliminación de comentarios propios
- Mención de usuarios (@usuario)

**Sección de Historial**:
- Registro de cambios de la tarea
- Cambios de estado
- Reasignaciones
- Modificaciones de fechas
- Cambios de prioridad
- Filtro por tipo de cambio

**Permisos**:
- `alm.view` - Ver detalle de tarea
- `alm.edit` - Editar tarea
- `alm.delete` - Eliminar tarea
- `alm.comment` - Añadir comentarios
- `alm.track_time` - Registrar tiempo

---

### 6. Registro de Tiempos (`TimeTracking.jsx`)

#### Funcionalidad Completa

**Propósito**: Registrar y consultar tiempos trabajados en tareas.

**Características**: 

**Formulario de Registro de Tiempo**:
- Proyecto (Select con búsqueda)
- Tarea (Select filtrado por proyecto)
- Fecha (DatePicker, por defecto hoy)
- Horas trabajadas (Input numérico, incrementos de 0.5h)
- Descripción (Textarea opcional)
- Botones:  Guardar, Guardar y Nuevo, Cancelar

**Validaciones**:
- Horas entre 0.5 y 24
- Fecha no futura
- Tarea obligatoria
- Proyecto obligatorio

**Tabla de Registros de Tiempo**:
- Columnas: 
  - Fecha
  - Proyecto
  - Tarea
  - Horas
  - Descripción
  - Usuario (solo managers)
  - Acciones (editar, eliminar)
- Filtros:
  - Por proyecto
  - Por tarea
  - Por usuario (solo managers)
  - Por rango de fechas
- Ordenación por columnas
- Paginación
- Total de horas al pie de tabla

**Resumen Semanal/Mensual**:
- Calendario de semana actual con horas por día
- Total de horas de la semana
- Gráfico de distribución de tiempo por proyecto
- Comparación con semanas anteriores

**Funcionalidades Especiales**: 
- ⏱️ **Cronómetro Integrado** (opcional):
  - Iniciar timer para una tarea
  - Pausar/reanudar
  - Detener y guardar automáticamente
- 📊 **Reportes**:
  - Exportar a CSV/Excel
  - Resumen por proyecto
  - Resumen por usuario (managers)
  - Horas facturables vs no facturables
- 🔔 **Recordatorios**:
  - Notificación si no se ha registrado tiempo hoy
  - Alerta de horas menores a jornada completa

**Permisos**:
- `alm.track_time` - Registrar tiempo propio
- `alm.view_team_time` - Ver tiempo del equipo
- `alm.edit_time` - Editar registros
- `alm.delete_time` - Eliminar registros

**Reglas de Negocio**:
- No se puede registrar tiempo en tareas de otros usuarios (salvo managers)
- Las horas no pueden exceder 24h en un día
- No se puede registrar tiempo en fechas futuras
- Los registros de hace más de 30 días requieren aprobación para edición

---

### 7. Planificación de Sprints (`SprintPlanning.jsx`)

#### Funcionalidad Completa

**Propósito**: Gestionar sprints ágiles con backlog y seguimiento de velocidad.

**Características**: 

**Vista Principal de Sprints**:
- Lista de sprints (activo, planificados, completados)
- Información por sprint:
  - Nombre del sprint
  - Fecha inicio/fin
  - Objetivo del sprint
  - Capacidad estimada vs comprometida
  - Número de tareas
  - Estado (badge)

**Backlog de Producto**:
- Lista de tareas sin asignar a sprint
- Priorización con drag & drop
- Estimación de story points
- Filtros por proyecto y prioridad
- Drag & drop a sprint

**Tablero de Sprint Activo**:
- Similar al tablero Kanban general
- Filtrado solo por tareas del sprint activo
- Burndown chart del sprint
- Velocidad actual vs velocidad objetivo
- Días restantes del sprint

**Modal de Creación de Sprint**:
- Nombre del sprint*
- Proyecto asociado
- Fecha de inicio*
- Fecha de fin*
- Objetivo del sprint
- Capacidad del equipo (story points)

**Burndown Chart**:
- Gráfico de trabajo restante vs tiempo
- Línea ideal de progreso
- Línea real de progreso
- Predicción de finalización

**Métricas de Sprint**:
- Velocidad del equipo
- Story points completados
- Story points pendientes
- Porcentaje de completitud
- Tareas añadidas/eliminadas durante el sprint

**Permisos**:
- `alm.view` - Ver sprints
- `alm.manage_sprints` - Crear/editar sprints
- `alm.plan_sprints` - Asignar tareas a sprints

---

### 8. Dashboard ALM (`ALMDashboard.jsx`)

#### Funcionalidad Completa

**Propósito**: Vista general con KPIs y métricas de todos los proyectos.

**Características**:

**Tarjetas de Resumen (Cards)**:
- Total de proyectos activos
- Tareas en progreso
- Tareas vencidas (en rojo)
- Horas trabajadas esta semana

**Gráficos**:
1. **Distribución de Proyectos por Estado** (Pie Chart)
   - Planificación
   - En curso
   - Pausado
   - Completado

2. **Progreso de Proyectos** (Bar Chart)
   - Proyectos en el eje X
   - Porcentaje de completitud en eje Y

3. **Distribución de Tareas por Prioridad** (Donut Chart)
   - Alta
   - Media
   - Baja

4. **Evolución de Horas Trabajadas** (Line Chart)
   - Últimos 7 días
   - Horas por día

**Tabla de Tareas Recientes**:
- Últimas 10 tareas creadas o modificadas
- Información:  proyecto, título, estado, asignado
- Enlace rápido a detalle

**Alertas y Notificaciones**: 
- Proyectos próximos a fecha de fin
- Tareas retrasadas sin asignación
- Proyectos sin actividad en X días
- Usuarios con sobrecarga de tareas

**Filtros del Dashboard**:
- Por rango de fechas
- Por responsable de proyecto
- Por cliente

**Permisos**: 
- `alm.view` - Ver dashboard general
- `alm.view_all_projects` - Ver todos los proyectos (no solo los propios)

---

## 🎨 Componentes Compartidos del Módulo

### Componentes Reutilizables Internos

Estos componentes son específicos del módulo ALM y se reutilizan en múltiples pantallas:

**1. ProgressBar** (`components/shared/ProgressBar.jsx`)
- Barra de progreso visual
- Muestra porcentaje de tareas completadas
- Color configurable según estado
- Tooltips con información detallada

**2. ProjectStatusBadge** (`components/projects/ProjectStatusBadge.jsx`)
- Badge visual del estado del proyecto
- Código de color según estado
- Tamaño configurable (sm, md, lg)

**3. TaskStatusBadge** (`components/tasks/TaskStatusBadge.jsx`)
- Badge visual del estado de tarea
- Colores:  gris (pendiente), azul (en progreso), verde (completada)

**4. TaskPriorityBadge** (`components/tasks/TaskPriorityBadge.jsx`)
- Badge de prioridad de tarea
- Colores:  gris (baja), amarillo (media), rojo (alta)

**5. UserAssignmentPicker** (`components/shared/UserAssignmentPicker. jsx`)
- Selector de usuario con avatares
- Búsqueda de usuarios
- Integración con módulo RRHH para empleados

**6. DateRangePicker** (`components/shared/DateRangePicker.jsx`)
- Selector de rango de fechas
- Presets:  hoy, esta semana, este mes, último trimestre
- Validación de rango

**7. EstimationInput** (`components/shared/EstimationInput.jsx`)
- Input especializado para horas estimadas
- Incrementos de 0.5h
- Conversión automática días ↔ horas

---

## 🔐 Control de Acceso y Permisos

### Matriz de Permisos del Módulo ALM

| Permiso | Descripción | Rol con Acceso |
|---------|-------------|----------------|
| `alm.view` | Ver proyectos y tareas propias | Todos los usuarios |
| `alm.view_all_projects` | Ver todos los proyectos de la empresa | Managers, Admins |
| `alm.create` | Crear proyectos y tareas | Managers, Admins |
| `alm.edit` | Editar proyectos y tareas | Responsables, Managers, Admins |
| `alm.delete` | Eliminar proyectos y tareas | Managers, Admins |
| `alm.assign_tasks` | Asignar tareas a usuarios | Responsables de proyecto, Managers |
| `alm.track_time` | Registrar tiempo de trabajo | Todos los usuarios |
| `alm.view_team_time` | Ver tiempos del equipo | Managers, Admins |
| `alm.edit_time` | Editar registros de tiempo | Usuarios propios, Managers |
| `alm.delete_time` | Eliminar registros de tiempo | Managers, Admins |
| `alm.manage_sprints` | Gestionar sprints | Scrum Masters, Managers |
| `alm.plan_sprints` | Planificar y asignar tareas a sprints | Scrum Masters, Managers |

### Validación de Permisos en Frontend

```javascript
// Ejemplo de validación en componente
import { useAuth } from '@/hooks/useAuth';

const { hasPermission } = useAuth();

// Renderizado condicional
{hasPermission('alm.create') && (
  <Button onClick={handleCreateProject}>
    Nuevo Proyecto
  </Button>
)}

// Protección de rutas
<ProtectedRoute 
  path="/alm/proyectos/nuevo" 
  component={ProjectForm}
  requiredPermission="alm.create"
/>
```

---

## 📊 Flujos de Datos Principales

### 1. Flujo de Creación de Proyecto

```
Usuario → ProjectForm → Validación → almService. createProject()
    ↓
Backend API → Respuesta → useProjects hook → Actualización de estado
    ↓
Redirección a ProjectDetail → Notificación de éxito
```

### 2. Flujo de Actualización de Estado de Tarea (Drag & Drop)

```
Usuario arrastra TaskCard → onDragStart → Estado draggedItem actualizado
    ↓
Usuario suelta en columna → handleDrop → Actualización optimista del estado local
    ↓
almService.updateTaskStatus() → Backend API
    ↓
Éxito:  Estado actualizado confirmado
Fallo:  Rollback al estado anterior + Notificación de error
```

### 3. Flujo de Registro de Tiempo

```
Usuario → TimeEntryForm → Validación → almService.logTime()
    ↓
Backend API → Respuesta → useTimeTracking hook actualiza lista
    ↓
Actualización de resumen de tiempo → Notificación de éxito
```

---

## 🔄 Sincronización y Actualización de Datos

### Estrategias de Actualización

**1. Polling (Consulta Periódica)**
- Dashboard: Actualización cada 60 segundos
- Tablero Kanban: Actualización cada 30 segundos (si hay otros usuarios)

**2. Actualización Optimista**
- Drag & drop de tareas
- Cambios de estado
- Asignación de usuarios
- Mejora UX con feedback inmediato
- Rollback automático en caso de fallo

**3. Invalidación de Caché**
- Después de crear/editar/eliminar
- Después de cambios en entidades relacionadas
- Uso de React Query o SWR para gestión de caché

**4. WebSockets (Futuro)**
- Notificaciones en tiempo real de cambios
- Actualización automática del tablero cuando otros usuarios modifican tareas
- Alertas de conflictos de edición simultánea

---

## 🎯 Casos de Uso Principales

### Caso de Uso 1: Manager crea un nuevo proyecto

1. Manager navega a `/alm/proyectos`
2. Hace clic en "Nuevo Proyecto"
3. Completa formulario: 
   - Nombre:  "Desarrollo App Móvil"
   - Responsable:  Selecciona a sí mismo
   - Cliente:  Selecciona "Cliente ABC" desde CRM
   - Fechas: 01/02/2026 - 30/06/2026
   - Presupuesto: 50. 000€
4. Hace clic en "Crear Proyecto"
5. Sistema valida y crea el proyecto
6. Redirección a ProjectDetail del nuevo proyecto
7. Manager puede empezar a crear tareas

### Caso de Uso 2: Desarrollador registra tiempo de trabajo

1. Desarrollador navega a `/alm/tiempos`
2. Completa formulario de registro:
   - Proyecto:  "Desarrollo App Móvil"
   - Tarea: "Diseño de base de datos"
   - Fecha:  Hoy
   - Horas:  4. 5h
   - Descripción: "Modelado de entidades principales"
3. Hace clic en "Guardar"
4. Sistema valida y registra el tiempo
5. Tabla de registros se actualiza
6. Resumen semanal se recalcula
7. Notificación de éxito

### Caso de Uso 3:  Equipo gestiona tareas en tablero Kanban

1. Scrum Master navega a `/alm/tareas`
2. Selecciona vista "Tablero"
3. Aplica filtro por proyecto "Desarrollo App Móvil"
4. Arrastra tarea de "Pendiente" a "En Progreso"
5. Sistema actualiza estado optimistamente
6. Backend confirma cambio
7. Otros usuarios ven el cambio actualizado
8. Scrum Master asigna tarea a desarrollador usando dropdown
9. Desarrollador recibe notificación de asignación

---

## 🚀 Optimizaciones y Mejores Prácticas

### Rendimiento

1. **Lazy Loading de Rutas**
   - Carga diferida de páginas no visitadas
   - Reducción del bundle inicial

2. **Virtualización de Listas Largas**
   - `react-window` o `react-virtualized` para tablas con muchos registros
   - Render solo de elementos visibles

3. **Memoización de Componentes**
   - `React.memo` para componentes que no cambian frecuentemente
   - `useMemo` y `useCallback` para cálculos costosos

4. **Optimización de Imágenes**
   - Lazy loading de avatares
   - Uso de placeholders mientras cargan

### Experiencia de Usuario

1. **Feedback Inmediato**
   - Spinners durante cargas
   - Skeletons para contenido en carga
   - Actualizaciones optimistas

2. **Validación Proactiva**
   - Validación en tiempo real en formularios
   - Mensajes de error claros y accionables

3. **Accesibilidad**
   - Etiquetas ARIA en componentes
   - Navegación por teclado
   - Contraste de colores WCAG AA

4. **Responsive Design**
   - Mobile-first approach
   - Breakpoints claros
   - Touch-friendly en dispositivos móviles

---

Este documento proporciona una visión técnica completa del módulo ALM en el frontend, asegurando coherencia con el backend y facilitando el desarrollo y mantenimiento del código. 