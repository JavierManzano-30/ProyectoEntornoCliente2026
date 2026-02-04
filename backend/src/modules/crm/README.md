# CRM Backend API - Guía para Frontend

## 📋 Información General

**Base URL**: `/api/v1/crm`  
**Autenticación**: `Authorization: Bearer <token>`  
**Base de Datos**: Supabase (PostgreSQL)

### Convenciones de la API

Este módulo sigue las convenciones definidas en `backend/docs/api/convenciones-api.md`:

- ✅ **Envelope obligatorio** en todas las respuestas
- ✅ **JSON en camelCase** para requests/responses
- ✅ **Fechas en ISO 8601 UTC** (`YYYY-MM-DDTHH:mm:ss.sssZ`)
- ✅ **Paginación estándar** con `page` y `limit`

### Formato de Respuestas

**Éxito**:
```json
{
  "success": true,
  "data": { /* ... */ },
  "meta": { /* opcional, para listas paginadas */ }
}
```

**Error**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descripción del error",
    "details": []
  }
}
```

---

## 🏢 Clientes

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/clientes` | Listar clientes (paginado) |
| POST | `/clientes` | Crear cliente |
| GET | `/clientes/:id` | Obtener cliente por ID |
| PUT | `/clientes/:id` | Actualizar cliente |
| DELETE | `/clientes/:id` | Eliminar cliente |
| POST | `/clientes/:id/convertir` | Convertir lead a customer |

### Query Parameters (GET /clientes)

- `type` - Filtrar por tipo: `lead` | `customer`
- `responsibleId` - Filtrar por responsable
- `search` - Búsqueda en nombre o taxId
- `page` - Número de página (default: 1)
- `limit` - Items por página (default: 10)
- `sort` - Ordenamiento: `name`, `type`, `city`, `createdAt` (prefijo `-` para DESC)

### Ejemplos

**POST /clientes** - Crear cliente:
```json
{
  "companyId": "11111111-1111-1111-1111-111111111111",
  "name": "Acme Corporation",
  "taxId": "B12345678",
  "email": "contact@acme.com",
  "phone": "+34912345678",
  "address": "Calle Mayor 1",
  "city": "Madrid",
  "responsibleId": "usr_10",
  "type": "lead",
  "notes": "Interesado en solución ERP"
}
```

**Response 201**:
```json
{
  "success": true,
  "data": {
    "id": "cli_1234567890",
    "companyId": "11111111-1111-1111-1111-111111111111",
    "name": "Acme Corporation",
    "taxId": "B12345678",
    "email": "contact@acme.com",
    "phone": "+34912345678",
    "address": "Calle Mayor 1",
    "city": "Madrid",
    "responsibleId": "usr_10",
    "type": "lead",
    "notes": "Interesado en solución ERP",
    "createdAt": "2026-02-04T12:00:00.000Z",
    "updatedAt": "2026-02-04T12:00:00.000Z"
  }
}
```

**GET /clientes?type=lead&limit=5** - Listar leads:
```json
{
  "success": true,
  "data": [
    {
      "id": "cli_1234567890",
      "companyId": "11111111-1111-1111-1111-111111111111",
      "name": "Acme Corporation",
      "taxId": "B12345678",
      "email": "contact@acme.com",
      "phone": "+34912345678",
      "address": "Calle Mayor 1",
      "city": "Madrid",
      "responsibleId": "usr_10",
      "type": "lead",
      "notes": "Interesado en solución ERP",
      "createdAt": "2026-02-04T12:00:00.000Z",
      "updatedAt": "2026-02-04T12:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 5,
    "totalItems": 15,
    "totalPages": 3
  }
}
```

**GET /clientes/:id** - Detalle completo con relaciones:
```json
{
  "success": true,
  "data": {
    "id": "cli_1234567890",
    "companyId": "11111111-1111-1111-1111-111111111111",
    "name": "Acme Corporation",
    "type": "customer",
    "contacts": [
      {
        "id": "cont_9876543210",
        "name": "Juan",
        "lastName": "Pérez García",
        "jobTitle": "CTO",
        "email": "juan.perez@acme.com",
        "phone": "+34600111222",
        "isDecisionMaker": true
      }
    ],
    "openOpportunities": 3,
    "totalPipelineValue": 150000
  }
}
```

**POST /clientes/:id/convertir** - Convertir lead a customer:
```json
{
  "success": true,
  "data": {
    "id": "cli_1234567890",
    "type": "customer",
    "syncedWithErp": true,
    "updatedAt": "2026-02-04T12:30:00.000Z"
  }
}
```

---

## 👤 Contactos

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/contactos` | Listar contactos (paginado) |
| POST | `/contactos` | Crear contacto |
| GET | `/contactos/:id` | Obtener contacto por ID |
| PUT | `/contactos/:id` | Actualizar contacto |
| DELETE | `/contactos/:id` | Eliminar contacto |

### Query Parameters (GET /contactos)

- `clientId` - Filtrar por cliente
- `companyId` - Filtrar por empresa
- `page` - Número de página (default: 1)
- `limit` - Items por página (default: 10)

### Ejemplos

**POST /contactos** - Crear contacto:
```json
{
  "companyId": "11111111-1111-1111-1111-111111111111",
  "clientId": "cli_1234567890",
  "name": "Juan",
  "lastName": "Pérez García",
  "jobTitle": "CTO",
  "email": "juan.perez@acme.com",
  "phone": "+34600111222",
  "isDecisionMaker": true
}
```

**Response 201**:
```json
{
  "success": true,
  "data": {
    "id": "cont_9876543210",
    "companyId": "11111111-1111-1111-1111-111111111111",
    "clientId": "cli_1234567890",
    "name": "Juan",
    "lastName": "Pérez García",
    "jobTitle": "CTO",
    "email": "juan.perez@acme.com",
    "phone": "+34600111222",
    "isDecisionMaker": true,
    "createdAt": "2026-02-04T12:00:00.000Z",
    "updatedAt": "2026-02-04T12:00:00.000Z"
  }
}
```

---

## 💼 Oportunidades

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/oportunidades` | Listar oportunidades (paginado) |
| POST | `/oportunidades` | Crear oportunidad |
| GET | `/oportunidades/:id` | Obtener oportunidad por ID |
| PUT | `/oportunidades/:id` | Actualizar oportunidad |
| DELETE | `/oportunidades/:id` | Eliminar oportunidad |
| PATCH | `/oportunidades/:id/fase` | Cambiar fase (Kanban) |

### Query Parameters (GET /oportunidades)

- `companyId` - Filtrar por empresa
- `pipelineId` - Filtrar por pipeline
- `stageId` - Filtrar por fase/stage
- `responsibleId` - Filtrar por responsable
- `clientId` - Filtrar por cliente
- `page` - Número de página (default: 1)
- `limit` - Items por página (default: 10)
- `sort` - Ordenamiento: `title`, `estimatedValue`, `probability`, `expectedCloseDate`, `createdAt` (prefijo `-` para DESC)

### Ejemplos

**POST /oportunidades** - Crear oportunidad:
```json
{
  "companyId": "11111111-1111-1111-1111-111111111111",
  "clientId": "cli_1234567890",
  "pipelineId": "pipe_1111111111",
  "stageId": "stage_2222222222",
  "title": "Venta Software ERP",
  "description": "Implementación completa del módulo ERP",
  "estimatedValue": 50000,
  "currency": "EUR",
  "probability": 60,
  "expectedCloseDate": "2026-03-31",
  "responsibleId": "usr_10",
  "sortOrder": 0
}
```

**PATCH /oportunidades/:id/fase** - Mover en Kanban:
```json
{
  "stageId": "stage_3333333333",
  "sortOrder": 2
}
```

---

## 📅 Actividades

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/actividades` | Listar actividades (paginado) |
| POST | `/actividades` | Crear actividad |
| GET | `/actividades/:id` | Obtener actividad por ID |
| PUT | `/actividades/:id` | Actualizar actividad |
| DELETE | `/actividades/:id` | Eliminar actividad |
| PATCH | `/actividades/:id/completar` | Marcar como completada |

### Query Parameters (GET /actividades)

- `companyId` - Filtrar por empresa
- `userId` - Filtrar por usuario
- `clientId` - Filtrar por cliente
- `opportunityId` - Filtrar por oportunidad
- `type` - Filtrar por tipo: `call` | `email` | `meeting` | `note`
- `estado` - Filtrar por estado: `pendiente` | `completada`
- `page` - Número de página (default: 1)
- `limit` - Items por página (default: 10)
- `sort` - Ordenamiento: `activityAt`, `dueDate`, `type`, `completed`, `createdAt` (prefijo `-` para DESC)

### Ejemplos

**POST /actividades** - Crear actividad:
```json
{
  "companyId": "11111111-1111-1111-1111-111111111111",
  "userId": "usr_10",
  "clientId": "cli_1234567890",
  "opportunityId": "opor_5555555555",
  "type": "call",
  "subject": "Primera toma de contacto",
  "description": "Conversación inicial sobre necesidades del cliente",
  "activityAt": "2026-02-05T10:00:00.000Z",
  "dueDate": "2026-02-05T15:00:00.000Z",
  "completed": false
}
```

**PATCH /actividades/:id/completar** - Marcar como completada:
```json
{
  "success": true,
  "data": {
    "id": "act_7777777777",
    "completed": true,
    "updatedAt": "2026-02-04T14:30:00.000Z"
  }
}
```

---

## ⚙️ Configuración - Pipelines y Stages

### Pipelines

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/config/pipelines` | Listar pipelines (con stages) |
| POST | `/config/pipelines` | Crear pipeline |
| GET | `/config/pipelines/:id` | Obtener pipeline por ID |
| PUT | `/config/pipelines/:id` | Actualizar pipeline |
| DELETE | `/config/pipelines/:id` | Eliminar pipeline |

### Stages (Fases)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/config/stages` | Crear stage/fase |
| PUT | `/config/stages/:id` | Actualizar stage |
| DELETE | `/config/stages/:id` | Eliminar stage |

### Ejemplos

**POST /config/pipelines** - Crear pipeline:
```json
{
  "companyId": "11111111-1111-1111-1111-111111111111",
  "name": "Venta de Licencias",
  "description": "Pipeline para venta de software",
  "isActive": true
}
```

**GET /config/pipelines** - Listar con stages anidados:
```json
{
  "success": true,
  "data": [
    {
      "id": "pipe_1111111111",
      "companyId": "11111111-1111-1111-1111-111111111111",
      "name": "Venta de Licencias",
      "description": "Pipeline para venta de software",
      "isActive": true,
      "stages": [
        {
          "id": "stage_2222222222",
          "pipelineId": "pipe_1111111111",
          "name": "Cualificación",
          "sortOrder": 1,
          "defaultProbability": 20,
          "createdAt": "2026-02-04T10:00:00.000Z",
          "updatedAt": "2026-02-04T10:00:00.000Z"
        },
        {
          "id": "stage_3333333333",
          "pipelineId": "pipe_1111111111",
          "name": "Propuesta",
          "sortOrder": 2,
          "defaultProbability": 40,
          "createdAt": "2026-02-04T10:00:00.000Z",
          "updatedAt": "2026-02-04T10:00:00.000Z"
        }
      ],
      "createdAt": "2026-02-04T10:00:00.000Z",
      "updatedAt": "2026-02-04T10:00:00.000Z"
    }
  ]
}
```

**POST /config/stages** - Crear stage:
```json
{
  "companyId": "11111111-1111-1111-1111-111111111111",
  "pipelineId": "pipe_1111111111",
  "name": "Negociación",
  "sortOrder": 3,
  "defaultProbability": 70
}
```

---

## 🔧 Tipos de Datos (TypeScript Reference)

```typescript
type ClientType = 'lead' | 'customer';

type ActivityType = 'call' | 'email' | 'meeting' | 'note';

interface Client {
  id: string;
  companyId: string;
  name: string;
  taxId: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  responsibleId: string | null;
  type: ClientType;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Contact {
  id: string;
  companyId: string;
  clientId: string;
  name: string;
  lastName: string | null;
  jobTitle: string | null;
  email: string | null;
  phone: string | null;
  isDecisionMaker: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Opportunity {
  id: string;
  companyId: string;
  clientId: string;
  pipelineId: string;
  stageId: string;
  title: string;
  description: string | null;
  estimatedValue: number;
  currency: string;
  probability: number;
  expectedCloseDate: string | null;
  responsibleId: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface Activity {
  id: string;
  companyId: string;
  userId: string;
  clientId: string | null;
  opportunityId: string | null;
  type: ActivityType;
  subject: string;
  description: string | null;
  activityAt: string;
  dueDate: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Pipeline {
  id: string;
  companyId: string;
  name: string;
  description: string | null;
  isActive: boolean;
  stages?: Stage[];
  createdAt: string;
  updatedAt: string;
}

interface Stage {
  id: string;
  companyId: string;
  pipelineId: string;
  name: string;
  sortOrder: number;
  defaultProbability: number;
  createdAt: string;
  updatedAt: string;
}
```

---

## ❌ Códigos de Error

| Código | Status | Descripción |
|--------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Datos inválidos en la petición |
| `UNAUTHORIZED` | 401 | Token no válido o ausente |
| `RESOURCE_NOT_FOUND` | 404 | Recurso no encontrado |
| `INTERNAL_ERROR` | 500 | Error interno del servidor |

**Ejemplo de error de validación**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Datos invalidos",
    "details": [
      {
        "field": "type",
        "message": "Must be one of: lead, customer"
      },
      {
        "field": "name",
        "message": "Field is required"
      }
    ]
  }
}
```

---

## 📊 Tablas de Base de Datos (Referencia)

- `crm_clients` - Clientes y leads
- `crm_contacts` - Contactos de clientes
- `crm_pipelines` - Pipelines de ventas
- `crm_stages` - Fases/stages de pipelines
- `crm_opportunities` - Oportunidades de venta
- `crm_activities` - Actividades (llamadas, emails, reuniones, notas)

---

## 🚀 Estado de Implementación

| Módulo | Estado | Notas |
|--------|--------|-------|
| Clientes | ✅ Completo | Totalmente funcional con Supabase |
| Contactos | ✅ Completo | Totalmente funcional con Supabase |
| Oportunidades | ✅ Completo | Totalmente funcional con Supabase |
| Actividades | ✅ Completo | Totalmente funcional con Supabase |
| Configuración | ✅ Completo | Pipelines y Stages funcionales con Supabase |

---

## 💡 Notas para Frontend

1. **Autenticación**: Todos los endpoints requieren JWT token válido en el header `Authorization: Bearer <token>`

2. **Paginación**: 
   - Por defecto: `page=1`, `limit=10`
   - Máximo recomendado: `limit=100`

3. **Ordenamiento**:
   - Ascendente: `?sort=name`
   - Descendente: `?sort=-name`

4. **Fechas**: 
   - Siempre en formato ISO 8601 UTC
   - Al enviar: `"2026-02-04T12:00:00.000Z"`
   - Al recibir: Parsear con `new Date(dateString)`

5. **IDs**: 
   - Generados por el backend con prefijos:
     - `cli_` - Clientes
     - `cont_` - Contactos
     - `opor_` - Oportunidades
     - `act_` - Actividades
     - `pipe_` - Pipelines
     - `stage_` - Stages

6. **Validación**:
   - El backend retorna detalles específicos en `error.details[]`
   - Mostrar mensajes de campo específicos al usuario

---

## 🔗 Enlaces Útiles

- [Documentación completa API](../../../docs/api/)
- [Convenciones API](../../../docs/api/convenciones-api.md)
- [Base de datos](../../../docs/database/modelo-datos-backend.md)
- [Funcionalidades CRM](../../../docs/modulos/crm/funcionalidades.md)
