# Documentación Técnica - Módulo BPM Frontend

---

## 🎯 Visión General

### Propósito del Módulo

El módulo **BPM (Business Process Management)** del frontend es responsable de proporcionar una interfaz completa y eficiente para la gestión integral de procesos de negocio, flujos de aprobación, tareas humanas y monitorización operacional.

Este módulo actúa como **punto central de orquestación de procesos**, proporcionando herramientas tanto para administradores de procesos, ejecutores de tareas, aprobadores y dirección. 

### Objetivos Principales

1. **Modelado de Procesos**
   - Diseño visual de procesos con editor BPMN
   - Versionado y publicación de procesos
   - Validación de modelos antes de activación

2. **Gestión de Instancias**
   - Iniciar procesos desde diferentes puntos
   - Seguimiento del estado de instancias
   - Cancelación, pausa y reanudación de flujos

3. **Bandejas de Tareas Humanas**
   - Visualización de tareas pendientes por usuario
   - Aprobación/rechazo con comentarios
   - Transferencia y delegación de tareas

4. **Formularios Dinámicos**
   - Captura de datos necesarios en cada actividad
   - Validaciones configurables
   - Precarga de información desde otros módulos

5. **Monitorización y SLA**
   - Dashboard de procesos activos
   - Alertas de incumplimiento de SLA
   - Métricas en tiempo real de cuellos de botella

6. **Gestión Documental**
   - Adjuntar archivos a instancias
   - Generación automática de documentos
   - Expediente electrónico completo

7. **Integración Transversal**
   - Orquestar acciones en ERP, RRHH, ALM, Soporte
   - Consumir datos de CORE para usuarios y roles
   - Proveer métricas a BI

---

## 🏗️ Arquitectura del Módulo

### Principios de Diseño

El módulo BPM Frontend está diseñado siguiendo estos principios arquitectónicos:

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
┌─────���────────▼──────────────────────────┐
│         CAPA DE SERVICIOS               │
│    (Comunicación con API)               │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│           BACKEND API                   │
│      (Motor BPM + Endpoints)            │
└─────────────────────────────────────────┘
```

#### 2. **Composición de Componentes**

- **Componentes Atómicos**:  Badges de estado, botones de acción, iconos de proceso
- **Componentes Moleculares**: Cards de instancia, formularios dinámicos, bandejas de tareas
- **Componentes Organismos**: Editor de procesos, dashboard de monitorización, timeline de actividad
- **Páginas**:  Composición de organismos y contexto específico

#### 3. **Gestión de Estado Predictible**

- **Estado Local**: `useState` para formularios y modals
- **Estado Compartido**: Context API para filtros de bandeja y proceso seleccionado
- **Estado de Servidor**: Custom hooks con polling para actualización de tareas pendientes

#### 4. **Code Splitting y Lazy Loading**

```javascript
// Optimización de carga
const ProcessList = lazy(() => import('./pages/ProcessList'));
const ProcessDesigner = lazy(() => import('./pages/ProcessDesigner'));
const TaskInbox = lazy(() => import('./pages/TaskInbox'));
const InstanceMonitor = lazy(() => import('./pages/InstanceMonitor'));
```

---

## 🔗 Integración con Backend

### Concordancia con Backend BPM

El módulo frontend está **completamente alineado** con la documentación del backend BPM: 

#### Entidades Gestionadas

| Entidad Backend | Representación Frontend | Pantallas Asociadas |
|----------------|------------------------|---------------------|
| Modelos de Proceso | Process Definitions | ProcessList, ProcessDesigner |
| Instancias | Process Instances | InstanceMonitor, InstanceDetail |
| Tareas Humanas | Task Items | TaskInbox, TaskDetail |
| Formularios | Dynamic Forms | TaskForm, ProcessStartForm |
| Documentos | File Attachments | DocumentManager, InstanceDetail |

#### Mapeo de Endpoints

| Operación | Método | Endpoint | Pantalla Frontend |
|-----------|--------|----------|-------------------|
| Listar procesos | GET | `/api/v1/bpm/procesos` | ProcessList |
| Obtener proceso | GET | `/api/v1/bpm/procesos/:id` | ProcessDesigner |
| Crear proceso | POST | `/api/v1/bpm/procesos` | ProcessDesigner |
| Publicar proceso | POST | `/api/v1/bpm/procesos/:id/publicar` | ProcessList |
| Iniciar instancia | POST | `/api/v1/bpm/instancias` | ProcessStartForm |
| Listar instancias | GET | `/api/v1/bpm/instancias` | InstanceMonitor |
| Obtener instancia | GET | `/api/v1/bpm/instancias/:id` | InstanceDetail |
| Cancelar instancia | POST | `/api/v1/bpm/instancias/:id/cancelar` | InstanceDetail |
| Listar tareas pendientes | GET | `/api/v1/bpm/tareas/bandeja` | TaskInbox |
| Obtener tarea | GET | `/api/v1/bpm/tareas/: id` | TaskDetail |
| Completar tarea | POST | `/api/v1/bpm/tareas/:id/completar` | TaskForm |
| Transferir tarea | POST | `/api/v1/bpm/tareas/:id/transferir` | TaskInbox |
| Adjuntar documento | POST | `/api/v1/bpm/instancias/:id/documentos` | DocumentUpload |
| Obtener métricas | GET | `/api/v1/bpm/metricas` | BPMDashboard |

---

## 🖥️ Pantallas y Funcionalidades

### 1. Listado de Procesos (`ProcessList. jsx`)

#### Funcionalidad Completa

**Propósito**: Proporcionar una vista general de todos los procesos definidos con sus versiones y estados.

**Características**: 

- ✅ **Vista de Cards con Información Clave**: 
  - Nombre del proceso
  - Versión actual y estado (borrador, publicado, obsoleto)
  - Número de instancias activas
  - Fecha de última modificación
  - Usuario creador
  
- ✅ **Búsqueda y Filtros**:
  - Búsqueda por nombre o descripción
  - Filtro por estado (borrador, publicado, obsoleto)
  - Filtro por categoría (aprobaciones, compras, RRHH, proyectos)
  - Ordenación por nombre, fecha, instancias activas

- ✅ **Acciones Rápidas**:
  - Ver detalle del modelo (ícono ojo)
  - Editar proceso (ícono lápiz) - Solo borradores
  - Publicar versión (ícono check) - Requiere validación
  - Iniciar nueva instancia (ícono play)
  - Ver instancias activas (ícono lista)
  - Archivar proceso (ícono archivo)

- ✅ **Estadísticas del Dashboard**:
  - Total de procesos publicados
  - Instancias en ejecución
  - Tareas pendientes globales
  - Procesos más utilizados

**Permisos Requeridos**:
- `bpm.view` - Ver listado de procesos
- `bpm.design` - Crear/editar procesos
- `bpm.publish` - Publicar procesos
- `bpm.start_instance` - Iniciar instancias

**Navegación**:
- **Desde**:  Menú lateral → BPM → Procesos
- **Hacia**: 
  - ProcessDesigner (nuevo/editar)
  - InstanceMonitor (ver instancias)
  - ProcessStartForm (iniciar)

---

### 2. Diseñador de Procesos (`ProcessDesigner.jsx`)

#### Funcionalidad Completa

**Propósito**: Editor visual tipo BPMN para modelar procesos de negocio. 

**Características**:

**Panel de Herramientas (Izquierda)**:
- 🟢 **Eventos**:
  - Evento de inicio
  - Evento de fin
  - Evento temporizador
  - Evento de señal/mensaje
  
- 🟦 **Actividades**:
  - Tarea humana
  - Tarea automática (servicio)
  - Subproceso
  - Tarea de usuario
  
- 🟨 **Compuertas (Gateways)**:
  - Exclusiva (XOR) - Decisión
  - Paralela (AND) - Ejecución simultánea
  - Inclusiva (OR)

- ⚫ **Conectores**:
  - Flujo de secuencia
  - Flujo condicional

**Canvas Central**:
- Área de diseño con drag & drop
- Grid para alineación
- Zoom in/out
- Selección múltiple
- Copiar/pegar elementos
- Deshacer/rehacer

**Panel de Propiedades (Derecha)**:
Al seleccionar un elemento: 

- **Tarea Humana**:
  - Nombre de la tarea
  - Asignación (usuario, rol, grupo)
  - Formulario asociado
  - SLA (tiempo límite)
  - Prioridad
  - Notificaciones

- **Tarea Automática**:
  - Nombre del servicio
  - Conector a utilizar
  - Parámetros de entrada
  - Mapeo de salida
  - Manejo de errores (reintentos, compensación)

- **Compuerta Exclusiva**:
  - Condiciones de salida por rama
  - Expresiones JavaScript o reglas

**Barra Superior**:
- Nombre del proceso (editable)
- Versión actual
- Estado (borrador/publicado)
- Botones: 
  - Guardar borrador
  - Validar modelo
  - Publicar (solo si validación exitosa)
  - Previsualizar
  - Exportar a XML/JSON
  - Cancelar

**Validaciones Automáticas**:
- ✅ Debe existir un evento de inicio
- ✅ Debe existir al menos un evento de fin
- ✅ Todas las actividades deben estar conectadas
- ✅ No puede haber caminos sin salida
- ✅ Las tareas humanas deben tener asignación
- ✅ Las compuertas deben tener condiciones claras

**Permisos**:
- `bpm.design` - Acceder al diseñador
- `bpm.publish` - Publicar versiones

---

### 3. Bandeja de Tareas (`TaskInbox.jsx`)

#### Funcionalidad Completa

**Propósito**: Centralizar todas las tareas pendientes del usuario con capacidad de gestión y ejecución.

**Características**:

**Tabs Principales**:
- 📥 **Mis Tareas** - Tareas asignadas directamente
- 👥 **Tareas de Grupo** - Asignadas a roles/grupos
- ⏰ **Próximas a Vencer** - Por SLA
- 📋 **Todas** - Vista completa

**Tabla de Tareas**: 
Columnas:
- Proceso (nombre e ícono)
- Tarea (nombre de la actividad)
- Prioridad (badge:  alta, media, baja)
- Estado (pendiente, en progreso, vencida)
- Fecha de asignación
- Fecha límite (con indicador visual si está próxima)
- SLA restante (barra de progreso)
- Acciones (ejecutar, ver detalle, transferir)

**Filtros Avanzados**:
- Por proceso
- Por prioridad
- Por estado de SLA (a tiempo, en riesgo, vencida)
- Por rango de fechas
- Por solicitante

**Ordenación**:
- Por fecha límite (defecto)
- Por prioridad
- Por fecha de asignación
- Por SLA restante

**Acciones Rápidas**:
- **Ejecutar**: Abre el formulario de la tarea
- **Ver Detalle**: Muestra información completa de la instancia
- **Transferir**:  Reasigna a otro usuario
- **Comentar**: Añade nota sin completar
- **Posponer**: Solicita extensión de SLA

**Panel Lateral de Resumen**:
- Total de tareas pendientes
- Tareas vencidas (en rojo)
- Promedio de SLA restante
- Gráfico de distribución por proceso

**Notificaciones en Tiempo Real**:
- 🔔 Nueva tarea asignada
- ⚠️ Tarea próxima a vencer (24h antes)
- 🚨 Tarea vencida

**Permisos**:
- `bpm.view_tasks` - Ver tareas propias
- `bpm.execute_tasks` - Ejecutar tareas
- `bpm.transfer_tasks` - Transferir tareas

---

### 4. Formulario de Tarea (`TaskForm.jsx`)

#### Funcionalidad Completa

**Propósito**:  Capturar la información necesaria para completar una actividad humana.

**Características**: 

**Cabecera del Formulario**:
- Nombre de la tarea
- Proceso al que pertenece
- Instancia (con enlace a detalle)
- Solicitante (avatar + nombre)
- Fecha de inicio
- Tiempo restante de SLA (barra de progreso)

**Contexto de la Instancia**:
Panel colapsable con información resumida:
- Variables del proceso
- Documentos adjuntos
- Historial de actividades previas
- Comentarios anteriores

**Campos Dinámicos**:
Los campos se generan según la configuración del proceso:

- **Inputs de Texto**: Para nombres, descripciones, códigos
- **Textareas**: Para motivos, observaciones, comentarios
- **Selects**: Para opciones predefinidas (aprobado/rechazado, departamentos, categorías)
- **DatePickers**: Para fechas relevantes
- **File Uploads**: Para adjuntar documentos
- **Checkboxes/Radios**: Para confirmaciones o selecciones
- **Campos Numéricos**: Para montos, cantidades, porcentajes

**Validaciones en Tiempo Real**:
- Campos obligatorios marcados con *
- Formatos específicos (email, teléfono, DNI)
- Rangos numéricos (mínimo/máximo)
- Validaciones custom según proceso

**Precarga de Datos**:
El formulario puede precargarse con información de:
- RRHH (datos del empleado solicitante)
- ERP (códigos de cliente, productos)
- CRM (información de contacto)
- ALM (datos del proyecto)

**Acciones Disponibles**: 

1. **Aprobar/Completar** (botón verde):
   - Completa la tarea exitosamente
   - Avanza el flujo a la siguiente actividad
   - Registra comentario opcional
   - Notifica al solicitante

2. **Rechazar** (botón rojo):
   - Devuelve el flujo al paso anterior
   - Motivo de rechazo obligatorio
   - Notifica al solicitante
   - Registra en auditoría

3. **Guardar Borrador** (botón gris):
   - Guarda progreso sin completar
   - Mantiene la tarea en bandeja
   - Permite continuar después

4. **Transferir** (botón azul):
   - Reasigna a otro usuario
   - Motivo de transferencia obligatorio
   - Notifica al nuevo responsable

5. **Solicitar Información** (botón amarillo):
   - Devuelve al solicitante para aclaración
   - Comentario obligatorio
   - Pausa SLA (opcional)

**Adjuntar Documentos**: 
- Subida múltiple de archivos
- Formatos permitidos configurables
- Tamaño máximo por archivo
- Clasificación de documentos
- Preview de archivos adjuntos

**Comentarios y Notas**:
- Campo de texto enriquecido
- Historial de comentarios visible
- Mención de usuarios (@usuario)
- Adjuntos por comentario

**Comportamiento**:
- Validación antes de envío
- Confirmación en acciones críticas (rechazar, transferir)
- Feedback visual de éxito/error
- Registro de auditoría completo
- Notificaciones automáticas

**Permisos**:
- `bpm.execute_tasks` - Completar tareas
- `bpm.transfer_tasks` - Transferir tareas
- `bpm.attach_documents` - Adjuntar archivos

---

### 5. Monitor de Instancias (`InstanceMonitor.jsx`)

#### Funcionalidad Completa

**Propósito**: Visualizar y gestionar el estado de todas las instancias de procesos en ejecución.

**Características**:

**Vista Principal - Tabla de Instancias**: 

Columnas:
- ID de Instancia (enlace a detalle)
- Proceso (nombre + versión)
- Iniciado por (avatar + nombre)
- Fecha de inicio
- Estado actual (badge: activa, completada, cancelada, en error)
- Actividad actual (nombre de la tarea)
- Responsable actual
- SLA global (barra de progreso)
- Acciones

**Filtros Avanzados**:
- Por proceso
- Por estado
- Por responsable actual
- Por solicitante
- Por rango de fechas
- Por cumplimiento de SLA (a tiempo, en riesgo, vencida)

**Estados de Instancia**:
- 🟢 **Activa**: En ejecución normal
- 🔵 **En Espera**: Pausada o esperando evento
- 🟡 **En Riesgo**: Próxima a vencer SLA
- 🔴 **Vencida**: SLA superado
- ⚫ **Cancelada**: Finalizada manualmente
- ✅ **Completada**:  Finalizada exitosamente
- ⚠️ **Error**: Fallo en tarea automática

**Acciones sobre Instancias** (solo administradores):
- Ver detalle completo
- Pausar instancia
- Reanudar instancia
- Cancelar instancia (con motivo)
- Reintentar tarea fallida
- Reasignar tarea actual

**Dashboard de Métricas**: 
- Total de instancias activas
- Instancias completadas hoy
- Instancias vencidas
- Tiempo promedio de ciclo
- Gráfico de distribución por estado
- Gráfico de instancias por proceso

**Búsqueda Rápida**:
- Por ID de instancia
- Por solicitante
- Por número de referencia (si aplica)

**Exportación**:
- Descargar listado en CSV/Excel
- Exportar con filtros aplicados
- Incluir métricas agregadas

**Actualización en Tiempo Real**: 
- Polling cada 30 segundos
- Notificación de cambios relevantes
- Indicador visual de actualizaciones

**Permisos**:
- `bpm.view_instances` - Ver instancias propias
- `bpm.view_all_instances` - Ver todas las instancias
- `bpm.manage_instances` - Pausar/cancelar/reintentar

---

### 6. Detalle de Instancia (`InstanceDetail.jsx`)

#### Funcionalidad Completa

**Propósito**: Mostrar información completa y trazabilidad de una instancia específica.

**Características**: 

**Pestaña:  Información General**
- ID de la instancia
- Proceso y versión
- Estado actual con badge
- Solicitante (avatar, nombre, departamento)
- Fecha de inicio
- Fecha de finalización (si completada)
- Duración total
- SLA global (barra de progreso)
- Actividad actual y responsable

**Pestaña: Diagrama de Flujo**
- Visualización del proceso BPMN
- Resaltado del camino ejecutado
- Actividad actual marcada
- Actividades completadas en verde
- Actividades pendientes en gris
- Indicadores de tiempo en cada actividad

**Pestaña:  Timeline de Actividad**
- Cronología de todas las actividades
- Información por actividad: 
  - Nombre de la tarea
  - Usuario ejecutor
  - Fecha de inicio y fin
  - Duración
  - Resultado (aprobado/rechazado)
  - Comentarios
  - Documentos adjuntos
- Ordenación cronológica (ascendente/descendente)
- Filtro por tipo de actividad

**Pestaña: Variables del Proceso**
- Listado de todas las variables
- Nombre de variable
- Valor actual
- Tipo de dato
- Fecha de última modificación
- Usuario que modificó
- Historial de cambios (colapsable)

**Pestaña: Documentos**
- Gestor de archivos de la instancia
- Categorización automática por actividad
- Información por documento:
  - Nombre del archivo
  - Tipo/extensión
  - Tamaño
  - Fecha de subida
  - Usuario que subió
  - Actividad asociada
- Acciones: 
  - Descargar
  - Previsualizar (PDF, imágenes)
  - Eliminar (si no está firmado)
- Subida de nuevos documentos
- Generación de documentos automáticos (si configurado)

**Pestaña: Comentarios y Notas**
- Timeline de comentarios
- Avatar del autor
- Fecha y hora
- Texto del comentario
- Adjuntos opcionales
- Formulario para nuevo comentario
- Mención de usuarios
- Edición/eliminación de comentarios propios

**Pestaña:  Auditoría**
- Registro completo de eventos
- Tipos de eventos:
  - Inicio de instancia
  - Inicio de actividad
  - Finalización de actividad
  - Cambio de variables
  - Adjuntar documentos
  - Transferencias
  - Pausas/reanudaciones
  - Cancelación
- Información por evento:
  - Fecha y hora exacta
  - Usuario responsable
  - Acción ejecutada
  - Detalles técnicos (JSON colapsable)
- Filtros por tipo de evento y fecha
- Exportación de log completo

**Acciones Globales** (según permisos):
- Cancelar instancia (con confirmación y motivo)
- Pausar instancia
- Reanudar instancia
- Reintentar tarea fallida
- Exportar expediente completo (ZIP con documentos y PDF de resumen)
- Compartir enlace de seguimiento

**Panel Lateral de Contexto**:
- Resumen de estado
- Próximas acciones esperadas
- Responsables actuales
- Enlaces relacionados (si hay integración con ERP, RRHH, etc.)

**Permisos**:
- `bpm.view_instances` - Ver detalle de instancias propias
- `bpm.view_all_instances` - Ver todas las instancias
- `bpm.manage_instances` - Acciones administrativas

---

### 7. Formulario de Inicio de Proceso (`ProcessStartForm.jsx`)

#### Funcionalidad Completa

**Propósito**:  Capturar información inicial para iniciar una nueva instancia de proceso.

**Características**:

**Selección de Proceso**:
- Lista de procesos disponibles para iniciar
- Descripci��n del proceso
- Tiempo estimado de resolución
- SLA esperado
- Icono o imagen del proceso
- Filtro por categoría

**Formulario Inicial**: 
Campos configurables según el proceso:

- **Campos Obligatorios Comunes**:
  - Título/Asunto de la solicitud
  - Descripción o motivo
  - Prioridad (si aplica)
  - Fecha deseada de resolución

- **Campos Específicos del Proceso**:
  - Inputs dinámicos según configuración
  - Validaciones específicas
  - Ayudas contextuales

**Precarga Inteligente**:
- Datos del usuario actual (nombre, departamento, email)
- Información del contexto (si viene desde otro módulo)
- Valores por defecto configurados

**Adjuntar Documentos Iniciales**:
- Subida de archivos requeridos
- Indicación de documentos obligatorios
- Formatos permitidos
- Tamaño máximo

**Vista Previa del Flujo**:
- Diagrama simplificado del proceso
- Pasos principales
- Aprobadores esperados (si es público)
- Tiempo estimado por etapa

**Validaciones**:
- Campos obligatorios
- Formatos correctos
- Documentos requeridos adjuntos
- Reglas de negocio específicas

**Acciones**:
- **Iniciar Proceso**: Crea la instancia y la pone en cola
- **Guardar Borrador**: Guarda para continuar después
- **Cancelar**:  Descarta la solicitud

**Comportamiento Post-Inicio**:
- Feedback visual de éxito
- Número de instancia generado
- Enlace para seguimiento
- Notificación al primer responsable
- Redirección a detalle de instancia

**Permisos**:
- `bpm.start_instance` - Iniciar procesos
- Permisos específicos por proceso (si configurados)

---

### 8. Dashboard BPM (`BPMDashboard.jsx`)

#### Funcionalidad Completa

**Propósito**: Vista general con KPIs y métricas operacionales de todos los procesos.

**Características**:

**Tarjetas de Resumen (KPIs)**:
- Instancias activas
- Tareas pendientes totales
- Tareas vencidas (en rojo)
- Tiempo promedio de resolución
- Tasa de cumplimiento de SLA
- Procesos más utilizados esta semana

**Gráficos Principales**: 

1. **Distribución de Instancias por Estado** (Donut Chart)
   - Activas
   - Completadas
   - Canceladas
   - En error

2. **Instancias Iniciadas por Día** (Line Chart)
   - Últimos 30 días
   - Línea de tendencia
   - Comparación con mes anterior

3. **Cumplimiento de SLA** (Bar Chart)
   - Por proceso
   - % a tiempo vs % vencidas
   - Código de color

4. **Tareas Pendientes por Usuario** (Bar Chart horizontal)
   - Top 10 usuarios con más carga
   - Diferenciación por prioridad

5. **Tiempo Promedio por Proceso** (Bar Chart)
   - Procesos en eje X
   - Días promedio en eje Y
   - Comparación con objetivo

**Tabla de Procesos Críticos**:
- Procesos con instancias vencidas
- Número de afectadas
- Responsable actual
- Acción recomendada (escalamiento, reasignación)

**Alertas y Recomendaciones**:
- 🚨 Cuellos de botella detectados
- ⚠️ Usuarios sobrecargados
- 📊 Procesos con baja tasa de completitud
- 🔄 Procesos candidatos para automatización

**Filtros del Dashboard**:
- Por rango de fechas
- Por departamento
- Por categoría de proceso
- Por responsable

**Actualización**:
- Automática cada 60 segundos
- Indicador de última actualización
- Botón de refrescar manual

**Exportación**:
- Descargar dashboard en PDF
- Exportar datos a Excel
- Programar envío periódico por email

**Permisos**:
- `bpm.view_dashboard` - Ver dashboard general
- `bpm.view_all_metrics` - Ver métricas globales (no solo propias)

---

## 🎨 Componentes Compartidos del Módulo

### Componentes Reutilizables Internos

**1. ProcessStatusBadge** - Badge visual del estado del proceso (borrador, publicado, obsoleto)

**2. InstanceStatusBadge** - Badge del estado de instancia (activa, completada, cancelada, error)

**3. TaskPriorityBadge** - Badge de prioridad (alta, media, baja)

**4. SLAProgressBar** - Barra de progreso de SLA con código de color

**5. ActivityTimeline** - Componente de línea de tiempo reutilizable

**6. DocumentUploader** - Subida de archivos con preview y validación

**7. DynamicFormBuilder** - Constructor de formularios dinámicos desde configuración JSON

**8. BPMNViewer** - Visualizador de diagramas BPMN

**9. UserPicker** - Selector de usuarios para asignación/transferencia

**10. CommentThread** - Hilo de comentarios reutilizable

---

## 🔐 Control de Acceso y Permisos

### Matriz de Permisos del Módulo BPM

| Permiso | Descripción | Rol con Acceso |
|---------|-------------|----------------|
| `bpm.view` | Ver procesos disponibles | Todos |
| `bpm.design` | Diseñar y modelar procesos | Administradores de proceso |
| `bpm.publish` | Publicar versiones de procesos | Administradores de proceso |
| `bpm.start_instance` | Iniciar instancias | Todos (según proceso) |
| `bpm.view_tasks` | Ver tareas propias | Todos |
| `bpm.execute_tasks` | Ejecutar/completar tareas | Todos |
| `bpm.transfer_tasks` | Transferir tareas | Managers, Admins |
| `bpm.view_instances` | Ver instancias propias | Todos |
| `bpm.view_all_instances` | Ver todas las instancias | Managers, Admins |
| `bpm.manage_instances` | Pausar/cancelar/reintentar | Admins |
| `bpm.attach_documents` | Adjuntar documentos | Todos |
| `bpm.view_dashboard` | Ver dashboard | Managers, Admins |

---

## 📊 Flujos de Datos Principales

### 1. Flujo de Inicio de Proceso
```
Usuario → ProcessStartForm → Validación → bpmService.startInstance()
    ↓
Backend crea instancia → Asigna primera tarea → Notifica responsable
    ↓
Redirección a InstanceDetail → Usuario puede hacer seguimiento
```

### 2. Flujo de Ejecución de Tarea
```
Usuario ve tarea en TaskInbox → Clic en "Ejecutar" → TaskForm carga
    ↓
Usuario completa formulario → Validación → bpmService.completeTask()
    ↓
Backend avanza flujo → Asigna siguiente tarea → Actualiza bandeja
    ↓
Notificación de éxito → Bandeja se actualiza
```

### 3. Flujo de Monitorización
```
Manager accede a InstanceMonitor → Filtros aplicados
    ↓
Detecta instancia vencida → Clic en detalle → InstanceDetail
    ↓
Revisa timeline → Identifica cuello de botella
    ↓
Reasigna tarea → Notifica nuevo responsable → SLA se actualiza
```

---

## 🚀 Optimizaciones y Mejores Prácticas

**Rendimiento**:
- Lazy loading del editor BPMN (librería pesada)
- Virtualización en tablas largas de instancias
- Caché de procesos publicados (cambian poco)

**UX**:
- Feedback inmediato en acciones de tarea
- Indicadores visuales de SLA claros
- Confirmaciones en acciones críticas
- Breadcrumbs para navegación contextual

**Accesibilidad**:
- Etiquetas ARIA en formularios dinámicos
- Navegación por teclado en editor
- Contraste alto en badges de estado

---

Este documento proporciona una visión técnica completa del módulo BPM en el frontend, asegurando coherencia con el backend y facilitando el desarrollo y mantenimiento. 