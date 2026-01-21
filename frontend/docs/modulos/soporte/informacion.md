# Documentación Técnica - Módulo Soporte Frontend

---

## 🎯 Visión General

### Propósito del Módulo

El módulo **Soporte** del frontend permite la gestión integral de incidencias y peticiones (tickets) de usuarios, centralizando la comunicación entre clientes y el equipo de soporte. Su objetivo es registrar, priorizar, resolver y auditar solicitudes, proporcionando métricas y trazabilidad para la mejora continua.

### Objetivos Principales

1. **Gestión del ciclo de vida del ticket**
   - Creación, consulta, edición, asignación, escalado, resolución y cierre de tickets.
   - Seguimiento de estados y SLA.
2. **Comunicación y colaboración**
   - Conversación tipo chat/hilo en cada ticket (mensajes internos/externos).
   - Adjuntos y gestión de archivos.
3. **Priorización y categorización**
   - Selección de prioridad y categoría en la creación y edición.
   - Filtros avanzados en listados.
4. **Asignación y escalado**
   - Asignación manual y automática de tickets a agentes/roles.
   - Escalado según reglas de SLA y alertas.
5. **Integración transversal**
   - Conversión de ticket a tarea en ALM.
   - Consumo de usuarios/empresas de CORE.
   - Exposición de métricas a BI.
6. **Auditoría y trazabilidad**
   - Registro de todas las acciones críticas y cambios de estado.
   - Visualización de historial y logs.

---

## 🏗️ Arquitectura del Módulo

### Principios de Diseño

- Separación de responsabilidades (presentación, lógica, servicios, API).
- Componentes reutilizables para formularios, tablas, timelines y chat.
- Contexto compartido para usuario, empresa y permisos.
- Hooks personalizados para gestión de tickets, mensajes y adjuntos.
- Code splitting y lazy loading en páginas principales.

---

## 🔗 Integración con Backend

| Entidad Backend | Representación Frontend | Pantallas Asociadas                  |
| --------------- | ----------------------- | ------------------------------------ |
| Ticket          | Ticket Object           | TicketList, TicketDetail, TicketForm |
| Mensaje         | Message Object          | TicketDetail (pestaña Conversación)  |
| Adjunto         | Attachment Object       | TicketDetail (pestaña Adjuntos)      |
| Historial       | Audit Object            | TicketDetail (pestaña Historial)     |
| SLA             | SLA Object              | TicketList, TicketDetail             |

| Operación        | Método | Endpoint aproximado                       | Pantalla Frontend        |
| ---------------- | ------ | ----------------------------------------- | ------------------------ |
| Listar tickets   | GET    | `/api/v1/support/tickets`                 | TicketList               |
| Crear ticket     | POST   | `/api/v1/support/tickets`                 | TicketForm               |
| Obtener ticket   | GET    | `/api/v1/support/tickets/:id`             | TicketDetail             |
| Editar ticket    | PATCH  | `/api/v1/support/tickets/:id`             | TicketForm               |
| Añadir mensaje   | POST   | `/api/v1/support/tickets/:id/messages`    | TicketDetail             |
| Subir adjunto    | POST   | `/api/v1/support/tickets/:id/attachments` | TicketDetail             |
| Cambiar estado   | PATCH  | `/api/v1/support/tickets/:id/status`      | TicketDetail             |
| Asignar ticket   | PATCH  | `/api/v1/support/tickets/:id/assign`      | TicketDetail             |
| Escalar ticket   | PATCH  | `/api/v1/support/tickets/:id/escalate`    | TicketDetail             |
| Listar SLA       | GET    | `/api/v1/support/sla`                     | TicketList, TicketDetail |
| Listar historial | GET    | `/api/v1/support/tickets/:id/audit`       | TicketDetail             |

---

## 🖥️ Pantallas y Funcionalidades

### 1. Listado de Tickets (`TicketList.jsx`)

#### Funcionalidad Completa

**Propósito**: Proporcionar una vista general de todos los tickets con capacidades avanzadas de búsqueda, filtrado, priorización y gestión.

**Características**:

- ✅ **Tabla Responsive**: Columnas configurables (Título, Estado, Prioridad, Categoría, Empresa, Responsable, SLA, Fecha creación, Acciones).
- ✅ **Búsqueda en Tiempo Real**: Por título, descripción, número de ticket.
- ✅ **Filtros Múltiples**:
  - Estado (abierto, en progreso, resuelto, cerrado)
  - Prioridad (baja, media, alta, urgente)
  - Categoría (técnico, facturación, otro)
  - Empresa (si multiempresa)
  - Responsable
  - Rango de fechas
  - SLA (cumplido/incumplido)
- ✅ **Ordenación**: Por fecha, prioridad, estado, SLA.
- ✅ **Paginación**: Selector de elementos por página.
- ✅ **Acciones Rápidas**:
  - Ver detalle (icono ojo)
  - Asignar (icono usuario)
  - Responder (icono mensaje)
  - Cerrar (icono check)
- ✅ **Exportación**: Descarga de listado en CSV/Excel.
- ✅ **Estadísticas Rápidas**:
  - Total de tickets abiertos
  - Tickets en progreso
  - Tickets resueltos/cerrados
  - SLA incumplidos

**Permisos Requeridos**:

- `soporte.tickets.view` - Ver listado de tickets
- `soporte.tickets.create` - Botón "Nuevo Ticket"
- `soporte.tickets.assign` - Asignar tickets
- `soporte.tickets.close` - Cerrar tickets

**Navegación**:

- **Desde**: Menú lateral → Soporte → Tickets
- **Hacia**:
  - TicketDetail (clic en fila o botón ver)
  - TicketForm (botón nuevo/editar)

---

### 2. Detalle de Ticket (`TicketDetail.jsx`)

#### Funcionalidad Completa

**Propósito**: Mostrar información completa y centralizada de un ticket con navegación por pestañas y acciones rápidas.

**Características**:

**Cabecera**:

- Título, estado (badge), prioridad (badge), categoría, empresa, responsable, SLA (indicador visual), fecha de creación y última actualización.
- Botones de acción: Asignar, Escalar, Cerrar/Reabrir, Convertir a tarea ALM.

**Pestañas principales**:

1. **Conversación**
   - Hilo de mensajes tipo chat (internos/externos, con iconos y colores diferenciados)
   - Adjuntos en mensajes
   - Input de respuesta con validación y adjuntos
   - Filtros: solo internos, solo externos, todos
   - Marcar mensaje como interno/externo (según permisos)
2. **Historial**
   - Timeline visual de cambios de estado, asignaciones, escalados
   - Registro de usuario, acción, fecha y motivo
   - Filtros por tipo de evento (estado, asignación, escalado)
3. **Adjuntos**
   - Listado de archivos asociados al ticket
   - Subida, descarga y eliminación de archivos (según permisos)
   - Visualización de tipo, tamaño, usuario que subió, fecha

**Visualización de SLA y alertas**:

- Indicador de tiempo restante o vencido
- Alertas visuales si el ticket está en riesgo de incumplir SLA

**Permisos Requeridos**:

- `soporte.tickets.view` - Ver detalle
- `soporte.tickets.edit` - Editar ticket
- `soporte.tickets.assign` - Asignar/reasignar
- `soporte.tickets.escalate` - Escalar ticket
- `soporte.tickets.close` - Cerrar ticket
- `soporte.tickets.attachments` - Gestionar adjuntos

---

### 3. Formulario de Ticket (`TicketForm.jsx`)

#### Funcionalidad Completa

**Propósito**: Crear nuevos tickets o editar datos de tickets existentes.

**Características**:

**Validaciones en Tiempo Real**:

- Campos obligatorios resaltados (título, descripción, categoría, prioridad)
- Longitud mínima/máxima en título y descripción
- Formato de archivos adjuntos (extensiones y tamaño máximo)
- Selección de empresa (si multiempresa y permisos)

**Campos Agrupados por Sección**:

1. **Datos Generales**
   - Título\*
   - Descripción\*
   - Categoría\* (selector)
   - Prioridad\* (selector)
2. **Adjuntos**
   - Subida de archivos con preview y validación
   - Eliminación de adjuntos antes de guardar
3. **Empresa** (si aplica)
   - Selector de empresa (solo si el usuario tiene acceso a varias)

**Acciones**:

- Guardar: valida y envía al backend
- Cancelar: vuelve a la pantalla anterior con confirmación si hay cambios
- Limpiar: resetea el formulario

**Comportamiento**:

- Feedback visual de éxito/error
- Redirección automática tras crear/editar

**Permisos**:

- `soporte.tickets.create` - Crear ticket
- `soporte.tickets.edit` - Editar ticket

---

### 4. Dashboard de Soporte (`SupportDashboard.jsx`)

#### Funcionalidad Completa

**Propósito**: Ofrecer una visión global del estado del soporte y los tickets.

**Características**:

- Gráficas de tickets por estado, prioridad, categoría, SLA
- KPIs destacados: tickets abiertos, SLA incumplidos, tiempo medio de respuesta, tickets por agente
- Filtros por periodo, empresa, responsable
- Exportación de métricas

---

### 5. Gestión de SLA y Escalados (`SLAList.jsx`, `EscalationPanel.jsx`)

#### Funcionalidad Completa

**Propósito**: Administrar reglas de SLA y gestionar el escalado de tickets.

**Características**:

- Listado y edición de reglas de SLA (por prioridad, categoría, tipo de ticket)
- Visualización de tickets en riesgo o incumplidos (alertas, badges)
- Acciones de escalado manual (botón en ticket) y automático (según reglas)
- Historial de escalados y notificaciones

---

## 🔐 Permisos y Seguridad

- Permisos por rol y acción: ver, crear, responder, asignar, cerrar, escalar, editar tickets, gestionar adjuntos, ver métricas.
- Acceso multiempresa y segregación de datos.
- Seguridad en rutas y componentes (ProtectedLayout, validación de permisos en UI y API).
- Auditoría de todas las acciones críticas (cambios de estado, asignaciones, escalados, adjuntos).
- Logs de acceso y cambios críticos.

---

## 🧪 Testing y Calidad

- Tests unitarios de componentes clave (TicketList, TicketDetail, TicketForm, Conversation, SLAIndicator).
- Tests de integración para flujos principales (creación, respuesta, cierre, escalado, adjuntos).
- Validación de contratos con la API de soporte (tipado, esquemas, DTOs).
- Pruebas de seguridad en formularios y rutas protegidas.

---

## 📱 Responsive Design e Internacionalización

- Layouts adaptables a diferentes resoluciones y dispositivos.
- Tablas y timelines con scroll horizontal en pantallas pequeñas.
- Componentes y formularios accesibles (a11y).
- Textos preparados para i18n (etiquetas y mensajes en ficheros de traducción).
