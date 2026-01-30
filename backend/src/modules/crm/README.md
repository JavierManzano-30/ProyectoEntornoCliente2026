# CRM Backend - Guía rápida para Frontend

Este documento resume qué endpoints existen en el backend CRM y cómo consumirlos.

Base URL: `/api/v1/crm`  
Auth: `Authorization: Bearer <token>`

Este módulo sigue las convenciones de `backend/docs/api/convenciones-api.md`:
- Envelope obligatorio (`success`, `data`, `meta/error`)
- JSON en `camelCase`
- Fechas en ISO 8601 UTC (`YYYY-MM-DDTHH:mm:ssZ`)
- Paginación con `page` y `limit`

## Clientes

- `GET /clientes`
- `POST /clientes`
- `GET /clientes/{id}`
- `PUT /clientes/{id}`
- `DELETE /clientes/{id}`
- `POST /clientes/{id}/convertir`

Filtros en listado:
- `tipo`, `responsableId`, `search`
- `page`, `limit`, `sort`

`sort` soporta: `nombre`, `tipo`, `ciudad`, `createdAt` (prefijo `-` para DESC).

Ejemplo POST `/clientes`:
```json
{
  "empresaId": "emp_1",
  "nombre": "Acme Corp",
  "cif": "B12345678",
  "email": "contacto@acme.com",
  "telefono": "+34912345678",
  "direccion": "Calle Mayor 1",
  "ciudad": "Madrid",
  "responsableId": "usr_10",
  "tipo": "lead",
  "notas": "Interesado en ERP"
}
```

Ejemplo response (listado con `meta`):
```json
{
  "success": true,
  "data": [
    {
      "id": "cli_100",
      "empresaId": "emp_1",
      "nombre": "Acme Corp",
      "cif": "B12345678",
      "email": "contacto@acme.com",
      "telefono": "+34912345678",
      "direccion": "Calle Mayor 1",
      "ciudad": "Madrid",
      "responsableId": "usr_10",
      "tipo": "lead",
      "notas": "Interesado en ERP",
      "createdAt": "2026-01-15T10:30:00Z",
      "updatedAt": "2026-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalItems": 1,
    "totalPages": 1
  }
}
```

Respuesta `GET /clientes/{id}` (detalle completo):
```json
{
  "success": true,
  "data": {
    "id": "cli_100",
    "nombre": "Acme Corp",
    "tipo": "cliente",
    "contactos": [
      {
        "id": "cont_500",
        "nombre": "Juan",
        "apellidos": "Pérez García",
        "cargo": "CTO",
        "email": "juan.perez@acme.com",
        "esDecisor": true
      }
    ],
    "oportunidadesAbiertas": 3,
    "valorPipelineTotal": 150000
  }
}
```

Ejemplo POST `/clientes/{id}/convertir` (Lead → Cliente):
```json
{
  "success": true,
  "data": {
    "id": "cli_100",
    "tipo": "cliente",
    "sincronizadoConErp": true
  }
}
```

## Contactos

- `GET /contactos`
- `POST /contactos`
- `GET /contactos/{id}`
- `PUT /contactos/{id}`
- `DELETE /contactos/{id}`

Filtros en listado:
- `clienteId`, `empresaId`
- `page`, `limit`

Ejemplo POST `/contactos`:
```json
{
  "empresaId": "emp_1",
  "clienteId": "cli_100",
  "nombre": "Juan",
  "apellidos": "Pérez García",
  "cargo": "CTO",
  "email": "juan.perez@acme.com",
  "telefono": "+34600111222",
  "esDecisor": true
}
```

## Oportunidades

- `GET /oportunidades`
- `POST /oportunidades`
- `GET /oportunidades/{id}`
- `PUT /oportunidades/{id}`
- `DELETE /oportunidades/{id}`
- `PATCH /oportunidades/{id}/fase`

Filtros en listado:
- `empresaId`, `pipelineId`, `faseId`, `responsableId`, `clienteId`
- `page`, `limit`, `sort`

`sort` soporta: `titulo`, `valorEstimado`, `probabilidad`, `fechaCierrePrevista`, `createdAt` (prefijo `-` para DESC).

Ejemplo POST `/oportunidades`:
```json
{
  "empresaId": "emp_1",
  "clienteId": "cli_100",
  "pipelineId": "pipe_1",
  "faseId": "fase_10",
  "titulo": "Venta Software ERP",
  "descripcion": "Implementación completa del ERP",
  "valorEstimado": 50000,
  "moneda": "EUR",
  "probabilidad": 60,
  "fechaCierrePrevista": "2026-03-31",
  "responsableId": "usr_10",
  "orden": 0
}
```

Ejemplo PATCH `/oportunidades/{id}/fase` (Kanban drag & drop):
```json
{
  "faseId": "fase_20",
  "orden": 2
}
```

## Actividades

- `GET /actividades`
- `POST /actividades`
- `GET /actividades/{id}`
- `PUT /actividades/{id}`
- `DELETE /actividades/{id}`
- `PATCH /actividades/{id}/completar`

Filtros en listado:
- `empresaId`, `usuarioId`, `clienteId`, `oportunidadId`, `tipo`, `estado`
- `entidadTipo` + `entidadId` (para filtrar por cliente u oportunidad)
- `page`, `limit`, `sort`

`sort` soporta: `fecha`, `fechaVencimiento`, `tipo`, `completada`, `createdAt` (prefijo `-` para DESC).

Ejemplo POST `/actividades`:
```json
{
  "empresaId": "emp_1",
  "usuarioId": "usr_10",
  "clienteId": "cli_100",
  "oportunidadId": "opor_200",
  "tipo": "llamada",
  "asunto": "Primera toma de contacto",
  "descripcion": "Conversación inicial sobre necesidades...",
  "fecha": "2026-01-20T10:00:00Z",
  "fechaVencimiento": "2026-01-20T15:00:00Z",
  "completada": false
}
```

Ejemplo PATCH `/actividades/{id}/completar`:
```json
{
  "success": true,
  "data": {
    "id": "act_300",
    "completada": true
  }
}
```

## Configuración - Pipelines

- `GET /config/pipelines`
- `POST /config/pipelines`
- `GET /config/pipelines/{id}`
- `PUT /config/pipelines/{id}`
- `DELETE /config/pipelines/{id}`

Filtros en listado:
- `empresaId`, `activo`

Ejemplo POST `/config/pipelines`:
```json
{
  "empresaId": "emp_1",
  "nombre": "Venta Licencias",
  "descripcion": "Pipeline para venta de software",
  "activo": true
}
```

Respuesta `GET /config/pipelines` (con fases anidadas):
```json
{
  "success": true,
  "data": [
    {
      "id": "pipe_1",
      "empresaId": "emp_1",
      "nombre": "Venta Licencias",
      "descripcion": "Pipeline para venta de software",
      "activo": true,
      "fases": [
        {
          "id": "fase_10",
          "pipelineId": "pipe_1",
          "nombre": "Cualificación",
          "orden": 1,
          "probabilidadDefecto": 20
        },
        {
          "id": "fase_20",
          "pipelineId": "pipe_1",
          "nombre": "Propuesta",
          "orden": 2,
          "probabilidadDefecto": 40
        }
      ]
    }
  ]
}
```

## Configuración - Fases

- `POST /config/fases`
- `PUT /config/fases/{id}`
- `DELETE /config/fases/{id}`

Ejemplo POST `/config/fases`:
```json
{
  "empresaId": "emp_1",
  "pipelineId": "pipe_1",
  "nombre": "Negociación",
  "orden": 3,
  "probabilidadDefecto": 70
}
```

## Errores (formato estándar)
Ejemplo `400` (validación):
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Datos invalidos",
    "details": [
      { "field": "tipo", "message": "Debe ser uno de: lead, cliente" }
    ]
  }
}
```

Ejemplo `404`:
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Cliente no encontrado",
    "details": []
  }
}
```

## Enums
- `cliente.tipo`: `lead | cliente`
- `actividad.tipo`: `llamada | email | reunion | nota`
- `actividad.estado`: `pendiente | completada` (filtro, no campo de BD)

## Tablas (referencia DB)
- `crm_clientes`
- `crm_contactos`
- `crm_pipelines`
- `crm_fases`
- `crm_oportunidades`
- `crm_actividades`
