# CRM Backend API - Guía para Frontend

## 📋 Información General

**Base URL**: `http://localhost:3001/api/v1/crm`  
**Autenticación**: `Authorization: Bearer <token>` (requerido en todos los endpoints)  
**Base de Datos**: Supabase (PostgreSQL con UUIDs auto-generados)  
**Puerto**: 3001 (development)

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

```bash
# PowerShell
$token = "YOUR_JWT_TOKEN"
$headers = @{'Authorization' = "Bearer $token"; 'Content-Type' = 'application/json'}
$body = @{
  name = "Acme Corporation"
  taxId = "B12345678"
  email = "contact@acme.com"
  phone = "+34912345678"
  address = "Calle Mayor 1"
  city = "Madrid"
  responsibleId = "usr_10"
  type = "lead"
  notes = "Interesado en solución ERP"
} | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/crm/clientes' -Method POST -Headers $headers -Body $body
```

```bash
# curl
curl -X POST http://localhost:3001/api/v1/crm/clientes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corporation",
    "taxId": "B12345678",
    "email": "contact@acme.com",
    "phone": "+34912345678",
    "address": "Calle Mayor 1",
    "city": "Madrid",
    "responsibleId": "usr_10",
    "type": "lead",
    "notes": "Interesado en solución ERP"
  }'
```

**Request Body**:
```json
{
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

> ⚠️ **Nota**: `companyId` se obtiene automáticamente del token JWT, no debe enviarse en el body.

**Response 201**:
```json
{
  "success": true,
  "data": {
    "id": "e6fad568-990e-495a-955a-51b64533b51e",
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
    "createdAt": "2026-02-06T19:26:33.489Z",
    "updatedAt": "2026-02-06T19:26:33.489Z"
  }
}
```

**GET /clientes?type=lead&limit=5** - Listar leads:

```bash
# PowerShell
$token = "YOUR_JWT_TOKEN"
$headers = @{'Authorization' = "Bearer $token"}
Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/crm/clientes?type=lead&limit=5' -Method GET -Headers $headers
```

```bash
# curl
curl -X GET "http://localhost:3001/api/v1/crm/clientes?type=lead&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response 200**:
```json
{
  "success": true,
  "data": [
    {
      "id": "e6fad568-990e-495a-955a-51b64533b51e",
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
      "createdAt": "2026-02-06T19:26:33.489Z",
      "updatedAt": "2026-02-06T19:26:33.489Z"
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

```bash
# PowerShell
$token = "YOUR_JWT_TOKEN"
$headers = @{'Authorization' = "Bearer $token"}
$clientId = "e6fad568-990e-495a-955a-51b64533b51e"
Invoke-RestMethod -Uri "http://localhost:3001/api/v1/crm/clientes/$clientId" -Method GET -Headers $headers
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": "e6fad568-990e-495a-955a-51b64533b51e",
    "companyId": "11111111-1111-1111-1111-111111111111",
    "name": "Acme Corporation",
    "type": "customer",
    "contacts": [
      {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
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

```bash
# PowerShell
$token = "YOUR_JWT_TOKEN"
$headers = @{'Authorization' = "Bearer $token"; 'Content-Type' = 'application/json'}
$clientId = "e6fad568-990e-495a-955a-51b64533b51e"
Invoke-RestMethod -Uri "http://localhost:3001/api/v1/crm/clientes/$clientId/convertir" -Method POST -Headers $headers
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": "e6fad568-990e-495a-955a-51b64533b51e",
    "type": "customer",
    "updatedAt": "2026-02-06T19:30:00.489Z"
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

```bash
# PowerShell
$token = "YOUR_JWT_TOKEN"
$headers = @{'Authorization' = "Bearer $token"; 'Content-Type' = 'application/json'}
$body = @{
  clientId = "e6fad568-990e-495a-955a-51b64533b51e"
  name = "Juan"
  lastName = "Pérez García"
  jobTitle = "CTO"
  email = "juan.perez@acme.com"
  phone = "+34600111222"
  isDecisionMaker = $true
} | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/crm/contactos' -Method POST -Headers $headers -Body $body
```

**Request Body** (companyId viene del token):
```json
{
  "clientId": "e6fad568-990e-495a-955a-51b64533b51e",
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
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "companyId": "11111111-1111-1111-1111-111111111111",
    "clientId": "e6fad568-990e-495a-955a-51b64533b51e",
    "name": "Juan",
    "lastName": "Pérez García",
    "jobTitle": "CTO",
    "email": "juan.perez@acme.com",
    "phone": "+34600111222",
    "isDecisionMaker": true,
    "createdAt": "2026-02-06T19:26:33.489Z",
    "updatedAt": "2026-02-06T19:26:33.489Z"
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
| PATCH | `/oportunidades/:id/stage` | Cambiar stage/fase (Kanban) |

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

```bash
# PowerShell
$token = "YOUR_JWT_TOKEN"
$headers = @{'Authorization' = "Bearer $token"; 'Content-Type' = 'application/json'}
$body = @{
  clientId = "e6fad568-990e-495a-955a-51b64533b51e"
  pipelineId = "adb3ae84-7e80-4112-ac2c-a7b874fa1d19"
  stageId = "aae15ef8-3960-4a59-8932-aa0edba533cc"
  title = "Venta Software ERP"
  description = "Implementación completa del módulo ERP"
  estimatedValue = 50000
  currency = "EUR"
  probability = 60
  expectedCloseDate = "2026-03-31"
  responsibleId = "usr_10"
  sortOrder = 0
} | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/crm/oportunidades' -Method POST -Headers $headers -Body $body
```

**Request Body** (companyId viene del token):
```json
{
  "clientId": "e6fad568-990e-495a-955a-51b64533b51e",
  "pipelineId": "adb3ae84-7e80-4112-ac2c-a7b874fa1d19",
  "stageId": "aae15ef8-3960-4a59-8932-aa0edba533cc",
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

**PATCH /oportunidades/:id/stage** - Mover en Kanban:

```bash
# PowerShell
$token = "YOUR_JWT_TOKEN"
$headers = @{'Authorization' = "Bearer $token"; 'Content-Type' = 'application/json'}
$opportunityId = "f1e2d3c4-b5a6-7890-cdef-123456789abc"
$body = @{
  stageId = "aae15ef8-3960-4a59-8932-aa0edba533cc"
  sortOrder = 2
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3001/api/v1/crm/oportunidades/$opportunityId/stage" -Method PATCH -Headers $headers -Body $body
```

**Request Body**:
```json
{
  "stageId": "aae15ef8-3960-4a59-8932-aa0edba533cc",
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

```bash
# PowerShell
$token = "YOUR_JWT_TOKEN"
$headers = @{'Authorization' = "Bearer $token"; 'Content-Type' = 'application/json'}
$body = @{
  userId = "usr_10"
  clientId = "e6fad568-990e-495a-955a-51b64533b51e"
  opportunityId = "f1e2d3c4-b5a6-7890-cdef-123456789abc"
  type = "call"
  subject = "Primera toma de contacto"
  description = "Conversación inicial sobre necesidades del cliente"
  activityAt = "2026-02-05T10:00:00.000Z"
  dueDate = "2026-02-05T15:00:00.000Z"
  completed = $false
} | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/crm/actividades' -Method POST -Headers $headers -Body $body
```

**Request Body** (companyId viene del token):
```json
{
  "userId": "usr_10",
  "clientId": "e6fad568-990e-495a-955a-51b64533b51e",
  "opportunityId": "f1e2d3c4-b5a6-7890-cdef-123456789abc",
  "type": "call",
  "subject": "Primera toma de contacto",
  "description": "Conversación inicial sobre necesidades del cliente",
  "activityAt": "2026-02-05T10:00:00.000Z",
  "dueDate": "2026-02-05T15:00:00.000Z",
  "completed": false
}
```

**PATCH /actividades/:id/completar** - Marcar como completada:

```bash
# PowerShell
$token = "YOUR_JWT_TOKEN"
$headers = @{'Authorization' = "Bearer $token"; 'Content-Type' = 'application/json'}
$activityId = "b1c2d3e4-f5a6-7890-bcde-f123456789ab"
Invoke-RestMethod -Uri "http://localhost:3001/api/v1/crm/actividades/$activityId/completar" -Method PATCH -Headers $headers
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": "b1c2d3e4-f5a6-7890-bcde-f123456789ab",
    "completed": true,
    "updatedAt": "2026-02-06T19:30:00.489Z"
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

```bash
# PowerShell
$token = "YOUR_JWT_TOKEN"
$headers = @{'Authorization' = "Bearer $token"; 'Content-Type' = 'application/json'}
$body = @{
  name = "Venta de Licencias"
  description = "Pipeline para venta de software"
  isActive = $true
} | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/crm/config/pipelines' -Method POST -Headers $headers -Body $body
```

**Request Body** (companyId viene del token):
```json
{
  "name": "Venta de Licencias",
  "description": "Pipeline para venta de software",
  "isActive": true
}
```

**GET /config/pipelines** - Listar con stages anidados:

```bash
# PowerShell
$token = "YOUR_JWT_TOKEN"
$headers = @{'Authorization' = "Bearer $token"}
Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/crm/config/pipelines' -Method GET -Headers $headers
```

**Response 200**:
```json
{
  "success": true,
  "data": [
    {
      "id": "adb3ae84-7e80-4112-ac2c-a7b874fa1d19",
      "companyId": "11111111-1111-1111-1111-111111111111",
      "name": "Venta de Licencias",
      "description": "Pipeline para venta de software",
      "isActive": true,
      "stages": [
        {
          "id": "aae15ef8-3960-4a59-8932-aa0edba533cc",
          "companyId": "11111111-1111-1111-1111-111111111111",
          "pipelineId": "adb3ae84-7e80-4112-ac2c-a7b874fa1d19",
          "name": "Cualificación",
          "sortOrder": 1,
          "defaultProbability": 20,
          "createdAt": "2026-02-06T19:25:00.123Z",
          "updatedAt": "2026-02-06T19:25:00.123Z"
        },
        {
          "id": "bcd4ef89-4abc-5678-9def-0123456789ab",
          "companyId": "11111111-1111-1111-1111-111111111111",
          "pipelineId": "adb3ae84-7e80-4112-ac2c-a7b874fa1d19",
          "name": "Propuesta",
          "sortOrder": 2,
          "defaultProbability": 40,
          "createdAt": "2026-02-06T19:25:05.456Z",
          "updatedAt": "2026-02-06T19:25:05.456Z"
        }
      ],
      "createdAt": "2026-02-06T19:24:30.789Z",
      "updatedAt": "2026-02-06T19:24:30.789Z"
    }
  ]
}
```

**POST /config/stages** - Crear stage:

```bash
# PowerShell
$token = "YOUR_JWT_TOKEN"
$headers = @{'Authorization' = "Bearer $token"; 'Content-Type' = 'application/json'}
$body = @{
  pipelineId = "adb3ae84-7e80-4112-ac2c-a7b874fa1d19"
  name = "Negociación"
  sortOrder = 3
  defaultProbability = 70
} | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/crm/config/stages' -Method POST -Headers $headers -Body $body
```

**Request Body** (companyId viene del token):
```json
{
  "pipelineId": "adb3ae84-7e80-4112-ac2c-a7b874fa1d19",
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
   - Generados automáticamente por Supabase como UUIDs v4
   - Formato: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
   - Ejemplo: `e6fad568-990e-495a-955a-51b64533b51e`
   - No envíes IDs en el body al crear recursos (POST)

6. **companyId**:
   - Se obtiene automáticamente del token JWT
   - **No debe enviarse** en el body de las peticiones POST/PUT
   - El middleware `requireAuth` lo inyecta en `req.user.companyId`

7. **Validación**:
   - El backend retorna detalles específicos en `error.details[]`
   - Mostrar mensajes de campo específicos al usuario

8. **Generación de Token JWT**:
   ```bash
   # En el directorio backend
   node scripts/setup_crm_test_data.js
   ```
   - Genera un token válido usando una company existente
   - Token válido por 24 horas
   - No inserta datos en la base de datos

---

## 🔗 Enlaces Útiles

- [Documentación completa API](../../../docs/api/)
- [Convenciones API](../../../docs/api/convenciones-api.md)
- [Base de datos](../../../docs/database/modelo-datos-backend.md)
- [Funcionalidades CRM](../../../docs/modulos/crm/funcionalidades.md)
