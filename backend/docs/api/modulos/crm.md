# 📘 Documentación API - Módulo CRM

Esta referencia describe los endpoints públicos del módulo CRM siguiendo las convenciones establecidas en [`docs/api/convenciones-api.md`](../convenciones-api.md).

**Base URL:** `/api/v1/crm`

---

## 1. Clientes (Accounts/Leads)

### `GET /api/v1/crm/clientes`
**Descripción:** Lista paginada de clientes y leads.

**Query Params:**
- `tipo` (opcional): `lead` | `cliente`
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 10, max: 100)
- `search` (opcional): Búsqueda por nombre o CIF
- `responsable_id` (opcional): Filtro por comercial asignado

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nombre": "Acme Corp",
      "cif": "B12345678",
      "tipo": "lead",
      "responsableId": "uuid",
      "createdAt": "2026-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalItems": 45,
    "totalPages": 5
  }
}
```

---

### `GET /api/v1/crm/clientes/:id`
**Descripción:** Obtiene el detalle completo de un cliente, incluyendo contactos y métricas.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nombre": "Acme Corp",
    "tipo": "cliente",
    "contactos": [...],
    "oportunidadesAbiertas": 3,
    "valorPipelineTotal": 150000
  }
}
```

---

### `POST /api/v1/crm/clientes`
**Descripción:** Crea un nuevo cliente o lead.

**Body:**
```json
{
  "nombre": "Nueva Empresa SL",
  "cif": "B87654321",
  "email": "contacto@empresa.com",
  "telefono": "+34912345678",
  "tipo": "lead",
  "responsableId": "uuid"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nombre": "Nueva Empresa SL",
    ...
  }
}
```

---

### `PUT /api/v1/crm/clientes/:id`
**Descripción:** Actualiza datos de un cliente (reemplazo completo).

---

### `POST /api/v1/crm/clientes/:id/convertir`
**Descripción:** Convierte un Lead en Cliente activo y sincroniza con ERP.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "tipo": "cliente",
    "sincronizadoConErp": true
  }
}
```

---

## 2. Contactos

### `GET /api/v1/crm/contactos`
**Descripción:** Lista de contactos asociados a clientes.

**Query Params:**
- `clienteId` (opcional): Filtra por cliente específico

---

### `POST /api/v1/crm/contactos`
**Descripción:** Crea un nuevo contacto vinculado a un cliente.

**Body:**
```json
{
  "clienteId": "uuid",
  "nombre": "Juan",
  "apellidos": "Pérez García",
  "cargo": "CTO",
  "email": "juan.perez@acme.com",
  "esDecisor": true
}
```

---

## 3. Oportunidades (Deals)

### `GET /api/v1/crm/oportunidades`
**Descripción:** Lista de oportunidades filtrables. Ideal para vistas Kanban.

**Query Params:**
- `pipelineId` (opcional)
- `faseId` (opcional)
- `responsableId` (opcional)

---

### `POST /api/v1/crm/oportunidades`
**Descripción:** Crea una nueva oportunidad comercial.

**Body:**
```json
{
  "clienteId": "uuid",
  "pipelineId": "uuid",
  "faseId": "uuid",
  "titulo": "Venta Software ERP",
  "valorEstimado": 50000,
  "moneda": "EUR",
  "probabilidad": 60,
  "fechaCierrePrevista": "2026-03-31T23:59:59Z",
  "responsableId": "uuid"
}
```

---

### `PATCH /api/v1/crm/oportunidades/:id/fase`
**Descripción:** Mueve una oportunidad a otra fase (drag & drop en Kanban).

**Body:**
```json
{
  "faseId": "uuid",
  "orden": 2
}
```

---

## 4. Actividades

### `GET /api/v1/crm/actividades`
**Descripción:** Historial de interacciones comerciales.

**Query Params:**
- `entidadTipo`: `cliente` | `oportunidad`
- `entidadId`: UUID de la entidad
- `estado`: `pendiente` | `completada`

---

### `POST /api/v1/crm/actividades`
**Descripción:** Registra una nueva actividad (llamada, email, reunión).

**Body:**
```json
{
  "tipo": "llamada",
  "asunto": "Primera toma de contacto",
  "descripcion": "Conversación inicial sobre necesidades...",
  "fechaVencimiento": "2026-01-20T15:00:00Z",
  "clienteId": "uuid",
  "oportunidadId": "uuid"
}
```

---

## 5. Configuración (Pipelines)

### `GET /api/v1/crm/config/pipelines`
**Descripción:** Configuración de pipelines y fases de venta.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nombre": "Venta Licencias",
      "fases": [
        {
          "id": "uuid",
          "nombre": "Cualificación",
          "orden": 1,
          "probabilidadDefecto": 20
        }
      ]
    }
  ]
}
```
