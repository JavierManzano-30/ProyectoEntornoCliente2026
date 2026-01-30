# Módulo CRM - Frontend

## 📋 Descripción

El módulo CRM (Customer Relationship Management) del frontend proporciona una interfaz completa para la gestión de la relación comercial con clientes actuales y potenciales.

## 🎯 Características Principales

### Gestión de Clientes
- Listado de clientes activos
- Estadísticas y métricas de clientes
- Visualización y edición de información del cliente
- Valor total por cliente

### Gestión de Leads
- Registro de clientes potenciales
- Clasificación por fuente y estado
- Conversión de leads a clientes
- Seguimiento del embudo de ventas

### Pipeline de Oportunidades
- Tablero Kanban visual por fases
- Gestión de oportunidades de venta
- Estimación de valor y probabilidad
- Priorización de oportunidades

### Actividades Comerciales
- Timeline de actividades
- Registro de llamadas, emails, reuniones
- Seguimiento de tareas pendientes
- Historial completo de interacciones

### Dashboard Comercial
- KPIs principales del área comercial
- Pipeline por fase
- Top oportunidades
- Actividades recientes

## 🗂️ Estructura del Módulo

```
crm/
├── components/          # Componentes React
│   ├── customers/      # Componentes de clientes
│   ├── leads/          # Componentes de leads
│   ├── opportunities/  # Componentes de oportunidades
│   ├── activities/     # Componentes de actividades
│   └── common/         # Componentes compartidos
├── pages/              # Páginas principales
│   ├── CustomerList.jsx
│   ├── LeadList.jsx
│   ├── OpportunityBoard.jsx
│   └── CRMDashboard.jsx
├── hooks/              # Custom hooks
│   ├── useCustomers.js
│   ├── useLeads.js
│   ├── useOpportunities.js
│   ├── useActivities.js
│   └── useCRMDashboard.js
├── services/           # Servicios de API
│   └── crmService.js
├── constants/          # Constantes y enums
│   ├── customerStatuses.js
│   ├── leadSources.js
│   ├── opportunityStages.js
│   └── activityTypes.js
├── utils/              # Funciones auxiliares
│   ├── customerHelpers.js
│   ├── leadHelpers.js
│   ├── opportunityHelpers.js
│   └── activityHelpers.js
├── data/               # Datos mock
│   └── mockData.js
└── index.js            # Exportaciones principales
```

## 🚀 Uso

### Importar Componentes

```javascript
import { 
  CustomerList, 
  LeadList, 
  OpportunityBoard,
  CRMDashboard 
} from '../modules/crm';
```

### Usar Hooks

```javascript
import { useCustomers, useOpportunities } from '../modules/crm';

function MiComponente() {
  const { customers, loading, error } = useCustomers();
  const { opportunities, groupedOpportunities } = useOpportunities();
  
  // ... tu lógica
}
```

### Usar Servicios Directamente

```javascript
import { crmService } from '../modules/crm';

async function obtenerClientes() {
  try {
    const clientes = await crmService.getCustomers({ estado: 'activo' });
    console.log(clientes);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## 🎨 Componentes Principales

### CustomerTable
Tabla de clientes con ordenamiento y acciones.

```javascript
<CustomerTable
  customers={customers}
  onView={handleView}
  onEdit={handleEdit}
  onDelete={handleDelete}
  sortBy="nombre"
  sortOrder="asc"
  onSort={handleSort}
/>
```

### LeadTable
Tabla de leads con funcionalidad de conversión.

```javascript
<LeadTable
  leads={leads}
  onView={handleView}
  onEdit={handleEdit}
  onConvert={handleConvert}
  sortBy="fechaCreacion"
  sortOrder="desc"
  onSort={handleSort}
/>
```

### OpportunityBoard
Tablero Kanban de oportunidades.

```javascript
<OpportunityBoard />
```

### ActivityTimeline
Timeline de actividades comerciales.

```javascript
<ActivityTimeline activities={activities} />
```

## 📊 Estados y Constantes

### Estados de Cliente
- `activo`: Cliente activo
- `inactivo`: Cliente inactivo
- `suspendido`: Cliente suspendido
- `prospecto`: Cliente prospecto

### Estados de Lead
- `nuevo`: Lead nuevo
- `contactado`: Lead contactado
- `calificado`: Lead calificado
- `descalificado`: Lead descalificado
- `convertido`: Lead convertido a cliente

### Fases de Oportunidad
- `prospecto`: Prospecto inicial
- `calificacion`: En calificación
- `propuesta`: Propuesta enviada
- `negociacion`: En negociación
- `ganada`: Oportunidad ganada
- `perdida`: Oportunidad perdida

### Tipos de Actividad
- `llamada`: Llamada telefónica
- `email`: Correo electrónico
- `reunion`: Reunión
- `tarea`: Tarea pendiente
- `nota`: Nota informativa
- `cita`: Cita programada

## 🔧 Modo Demo

Por defecto, el módulo funciona en modo demo con datos mockeados. Para conectar con el backend real:

1. Abre `services/crmService.js`
2. Cambia `DEMO_MODE = true` a `DEMO_MODE = false`
3. Asegúrate de que el backend esté corriendo

## 🔌 Integración con Backend

El módulo utiliza los siguientes endpoints (ver `config/api.js`):

- `GET /crm/clientes` - Listar clientes
- `GET /crm/clientes/:id` - Obtener cliente
- `POST /crm/clientes` - Crear cliente
- `PUT /crm/clientes/:id` - Actualizar cliente
- `DELETE /crm/clientes/:id` - Eliminar cliente
- `GET /crm/leads` - Listar leads
- `POST /crm/leads/:id/convertir` - Convertir lead
- `GET /crm/oportunidades` - Listar oportunidades
- `PATCH /crm/oportunidades/:id/fase` - Cambiar fase
- `GET /crm/actividades` - Listar actividades
- `GET /crm/dashboard` - Datos del dashboard

## 📝 Notas de Desarrollo

- Todos los componentes usan los componentes comunes de `components/common/`
- Los hooks encapsulan la lógica de negocio y llamadas a la API
- Los helpers proporcionan funciones de filtrado, ordenamiento y cálculo
- Los datos mock están en `data/mockData.js` para desarrollo sin backend

## 🚧 Pendientes

- [ ] Implementar formularios de creación/edición
- [ ] Añadir filtros avanzados
- [ ] Implementar búsqueda en tiempo real
- [ ] Añadir exportación a Excel/PDF
- [ ] Implementar drag & drop en el tablero Kanban
- [ ] Añadir notificaciones de cambios en tiempo real
