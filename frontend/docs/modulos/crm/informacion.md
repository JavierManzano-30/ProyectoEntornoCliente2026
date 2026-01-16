# Documentación Técnica - Módulo CRM Frontend

---

## 🎯 Visión General

### Propósito del Módulo

El módulo **CRM (Customer Relationship Management)** del frontend es responsable de proporcionar una interfaz completa y eficiente para la gestión de la **relación comercial** de la empresa con sus clientes actuales y potenciales.

Este módulo actúa como **punto central de información comercial**, permitiendo a los usuarios gestionar clientes, contactos, oportunidades, actividades y métricas de ventas, alineado con el modelo de datos y las reglas de negocio definidas en el backend CRM.

### Objetivos Principales

1. **Gestión Centralizada de Clientes (Leads y Cuentas)**
   - Alta, consulta y edición de clientes
   - Diferenciación entre leads y clientes activos
   - Gestión del estado comercial y clasificación
   - Asignación de responsable comercial

2. **Registro y Gestión de Contactos**
   - Alta y mantenimiento de contactos por cliente
   - Definición de roles y nivel de decisión
   - Gestión de datos de contacto (email, teléfono, redes)

3. **Gestión de Oportunidades y Pipeline de Ventas**
   - Creación y seguimiento de oportunidades
   - Gestión visual por fases (Kanban)
   - Estimación de valor y probabilidad de cierre
   - Previsión de ingresos

4. **Seguimiento de Actividades Comerciales**
   - Registro de llamadas, emails, reuniones y tareas
   - Agenda de actividades pendientes
   - Historial completo de interacciones por cliente y oportunidad

5. **Conversión de Leads a Clientes**
   - Flujo guiado de conversión
   - Creación automática de cuenta cliente y oportunidad inicial
   - Sincronización con ERP para facturación

6. **Dashboard Comercial y Métricas**
   - Panel de indicadores clave (KPI)
   - Evolución del pipeline
   - Actividad por comercial
   - Comparativa entre periodos

7. **Integración Transversal**
   - Proveer datos comerciales a ERP, ALM, Soporte y BI
   - Consumir configuración de CORE (empresas, usuarios, roles)

---

## 🏗️ Arquitectura del Módulo

### Principios de Diseño

El módulo CRM Frontend está diseñado siguiendo los mismos principios que el resto de módulos de negocio (RRHH, ERP):

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
│      (Endpoints RESTful CRM)           │
└─────────────────────────────────────────┘
```

#### 2. **Composición de Componentes**

- **Componentes Atómicos**: Botones, inputs, badges, chips
- **Componentes Moleculares**: Cards de cliente, tablas de oportunidades, formularios
- **Componentes Organismos**: Vistas de detalle con pestañas, paneles Kanban
- **Páginas**: Composición de organismos y contexto de navegación

#### 3. **Gestión de Estado Predictible**

- **Estado Local**: `useState` para formularios y componentes simples
- **Estado Compartido**: Context API o store del módulo CRM
- **Estado de Servidor**: Custom hooks (`useCustomers`, `useOpportunities`, etc.) con caché y refetch

#### 4. **Code Splitting y Lazy Loading**

```javascript
// Carga bajo demanda de páginas del módulo CRM
const CustomerList = lazy(() => import('./pages/CustomerList'));
const OpportunityBoard = lazy(() => import('./pages/OpportunityBoard'));
```

---

## 🔗 Integración con Backend

### Concordancia con Backend CRM

El módulo frontend está **alineado** con la documentación del backend CRM ([backend/docs/modulos/crm/información.md](backend/docs/modulos/crm/información.md) y [backend/docs/modulos/crm/funcionalidades.md](backend/docs/modulos/crm/funcionalidades.md)):

#### Entidades Gestionadas

| Entidad Backend | Representación Frontend | Pantallas Asociadas |
|-----------------|------------------------|---------------------|
| Clientes        | Customer Objects       | CustomerList, CustomerDetail, CustomerForm |
| Leads           | Lead Objects           | LeadList, LeadDetail, LeadForm |
| Contactos       | Contact Objects        | CustomerDetail (pestaña Contactos), ContactForm |
| Oportunidades   | Opportunity Objects    | OpportunityBoard, OpportunityList, OpportunityDetail |
| Actividades     | Activity Objects       | ActivityTimeline, ActivityForm |
| Pipelines       | Pipeline Config        | PipelineSettings |

#### Mapeo de Endpoints (Ejemplo)

> Los endpoints concretos se definen en la API CRM del backend. A nivel frontend se asume una estructura RESTful coherente con el resto de módulos.

| Operación                      | Método | Endpoint aproximado                          | Pantalla Frontend        |
|--------------------------------|--------|-----------------------------------------------|--------------------------|
| Listar clientes                | GET    | `/api/v1/crm/customers`                      | CustomerList             |
| Obtener detalle cliente        | GET    | `/api/v1/crm/customers/:id`                  | CustomerDetail           |
| Crear cliente                  | POST   | `/api/v1/crm/customers`                      | CustomerForm             |
| Actualizar cliente             | PATCH  | `/api/v1/crm/customers/:id`                  | CustomerForm             |
| Listar leads                   | GET    | `/api/v1/crm/leads`                          | LeadList                 |
| Convertir lead a cliente       | POST   | `/api/v1/crm/leads/:id/convert`              | LeadDetail / Wizard      |
| Listar contactos               | GET    | `/api/v1/crm/customers/:id/contacts`         | CustomerDetail           |
| Crear contacto                 | POST   | `/api/v1/crm/customers/:id/contacts`         | ContactForm              |
| Listar oportunidades           | GET    | `/api/v1/crm/opportunities`                  | OpportunityBoard/List    |
| Actualizar fase oportunidad    | PATCH  | `/api/v1/crm/opportunities/:id/stage`        | OpportunityBoard         |
| Listar actividades             | GET    | `/api/v1/crm/activities`                     | ActivityTimeline         |
| Crear actividad                | POST   | `/api/v1/crm/activities`                     | ActivityForm             |
| Listar pipelines y fases       | GET    | `/api/v1/crm/pipelines`                      | PipelineSettings         |

---

## 🖥️ Pantallas y Funcionalidades

### 1. Listado de Clientes (`CustomerList.jsx`)

#### Funcionalidad

**Propósito**: Proporcionar una vista general de todos los clientes (leads y cuentas activas) con capacidades avanzadas de búsqueda, filtrado y segmentación.

**Características**:

- ✅ **Tabla Responsive** con columnas configurables
- ✅ **Búsqueda en Tiempo Real** por nombre, NIF/CIF, email, teléfono
- ✅ **Filtros Múltiples**:
  - Tipo (Lead / Cliente)
  - Estado comercial (activo, inactivo, potencial, perdido)
  - Sector
  - Responsable comercial
- ✅ **Segmentación Rápida** (chips o tabs): "Todos", "Mis clientes", "Leads", "Clientes activos"
- ✅ **Acciones Rápidas** por fila:
  - Ver detalle
  - Editar cliente
  - Crear oportunidad
  - Ver actividades
- ✅ **Resumen Superior**:
  - Número total de clientes
  - Número de leads activos
  - Clientes asignados al usuario conectado

**Permisos Requeridos**:
- `crm.customers.view` - Ver clientes
- `crm.customers.create` - Crear clientes
- `crm.customers.edit` - Editar clientes

**Navegación**:
- **Desde**: Menú lateral → CRM → Clientes
- **Hacia**:
  - CustomerDetail (clic en fila)
  - CustomerForm (botón "Nuevo Cliente")
  - OpportunityForm (acción "Nueva Oportunidad")

---

### 2. Detalle de Cliente (`CustomerDetail.jsx`)

#### Funcionalidad

**Propósito**: Mostrar información completa del cliente con una vista de 360° incluyendo contactos, oportunidades y actividades.

**Características**:

- **Cabecera del Cliente**:
  - Nombre comercial y razón social
  - Estado (Lead / Cliente) con badge
  - Responsable comercial asignado
  - Sector, tamaño, origen

- **Pestañas Principales**:
  - **Resumen**: Datos básicos, KPIs del cliente (oportunidades abiertas, valor ganado, actividades recientes)
  - **Contactos**: Listado y gestión de contactos asociados
  - **Oportunidades**: Oportunidades abiertas e históricas del cliente
  - **Actividades**: Timeline de llamadas, emails y reuniones
  - **Documentos** (si aplica): Contratos, propuestas, etc.

- **Acciones**:
  - Editar cliente
  - Crear nueva oportunidad
  - Crear nueva actividad (llamada, email, reunión)
  - Convertir Lead a Cliente (si aplica)

**Permisos Requeridos**:
- `crm.customers.view` - Ver detalle
- `crm.customers.edit` - Editar datos
- `crm.opportunities.create` - Crear oportunidades
- `crm.activities.create` - Crear actividades

---

### 3. Tablero de Oportunidades (`OpportunityBoard.jsx`)

#### Funcionalidad

**Propósito**: Visualizar y gestionar el pipeline de ventas mediante un tablero Kanban por fases.

**Características**:

- ✅ **Columnas por Fase** (configurables): Prospecto, Cualificación, Propuesta, Negociación, Cerrado Ganado/Perdido
- ✅ **Tarjetas de Oportunidad** con:
  - Nombre de la oportunidad
  - Cliente asociado
  - Importe estimado y probabilidad
  - Fecha estimada de cierre
  - Responsable comercial
- ✅ **Drag & Drop** para mover oportunidades entre fases
- ✅ **Cálculos Automáticos** por columna:
  - Número de oportunidades
  - Valor total y valor ponderado
- ✅ **Filtros Globales**:
  - Por pipeline
  - Por responsable comercial
  - Por rango de fechas de cierre

**Permisos Requeridos**:
- `crm.opportunities.view` - Ver oportunidades
- `crm.opportunities.edit` - Cambiar fase/propiedades
- `crm.opportunities.create` - Crear nuevas oportunidades

---

### 4. Gestión de Actividades (`ActivityTimeline.jsx` / `ActivityForm.jsx`)

#### Funcionalidad

**Propósito**: Registrar y consultar el historial de interacciones comerciales con clientes y oportunidades.

**Características**:

- **Timeline Cronológico** de actividades con iconos por tipo (llamada, email, reunión, tarea)
- **Formulario de Nueva Actividad**:
  - Tipo de actividad
  - Cliente y/o oportunidad asociada
  - Fecha y hora
  - Resultado o notas
  - Recordatorio (opcional)
- **Filtros** por tipo, usuario, rango de fechas
- **Integración** con las pantallas de detalle de cliente y oportunidad

**Permisos Requeridos**:
- `crm.activities.view` - Ver actividades
- `crm.activities.create` - Registrar nuevas

---

### 5. Conversión de Lead a Cliente (`LeadConversionWizard.jsx`)

#### Funcionalidad

**Propósito**: Guiar al usuario en el proceso de transformar un lead cualificado en un cliente activo, minimizando errores y duplicidades.

**Características**:

- **Wizard de varios pasos**:
  1. Confirmar datos del lead
  2. Completar datos obligatorios de cliente
  3. Opcional: crear oportunidad inicial
  4. Resumen y confirmación
- **Validaciones** para evitar duplicados (NIF/CIF, email principal)
- **Acciones automáticas** al finalizar:
  - Crear registro de cliente
  - Marcar lead como convertido
  - Crear oportunidad inicial (opcional)

**Permisos Requeridos**:
- `crm.leads.convert` - Ejecutar el proceso de conversión

---

### 6. Dashboard Comercial (`CRMDashboard.jsx`)

#### Funcionalidad

**Propósito**: Ofrecer una visión global del rendimiento comercial y del estado actual del pipeline.

**Características**:

- Gráficas de valor de pipeline por fase y por comercial
- Métricas de conversión lead → oportunidad → cliente
- Actividades realizadas en el periodo seleccionado
- Top clientes por valor ganado
- Filtros por periodo, equipo, usuario

**Permisos Requeridos**:
- `crm.dashboard.view` - Ver panel comercial

---

## 🎨 Guía de Estilos y UX del Módulo

- Uso consistente de **badges y chips** para estados (Lead, Cliente, Activo, Inactivo, Fase del pipeline).
- Diagramas Kanban claros para el tablero de oportunidades.
- Formularios con validaciones en tiempo real y mensajes de error claros.
- Uso de iconografía coherente para tipos de actividad.
- Diseño responsive, optimizado para desktop pero usable en tablets.

---

## 🔐 Permisos y Seguridad

El módulo CRM se integra con el sistema de autenticación y autorización del módulo CORE.

- Permisos a nivel de **módulo** (acceso al menú CRM).
- Permisos específicos por **dominio funcional**:
  - `crm.customers.*`
  - `crm.leads.*`
  - `crm.opportunities.*`
  - `crm.activities.*`
  - `crm.dashboard.*`
- Se puede aplicar seguridad a nivel de **propietario** (solo ver/editar mis clientes/oportunidades).

---

## 🧪 Testing y Calidad

- Tests unitarios de componentes críticos (tablero de oportunidades, formularios de cliente y lead).
- Tests de integración para flujos clave: creación de cliente, creación de oportunidad, conversión de lead.
- Validación de contratos con la API CRM del backend (tipado, esquemas, DTOs).

---