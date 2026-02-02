# ALM Backend - Guía rápida para Frontend

Este documento resume qué endpoints existen en el backend ALM y cómo consumirlos.

Base URL: `/api/v1/alm`  
Auth: `Authorization: Bearer <token>`

Notas de esquema (synera-db.sql):
- IDs son UUID.
- `responsableId` corresponde a `responsable_employee_id` (empleado).
- `asignadoA` corresponde a `employee_id` (empleado).

Este módulo sigue las convenciones de `backend/docs/api/convenciones-api.md`:
- Envelope obligatorio (`success`, `data`, `meta/error`)
- JSON en `camelCase`
- Fechas en ISO 8601 UTC (`YYYY-MM-DDTHH:mm:ssZ`)
- Paginación con `page` y `limit`

## Proyectos

- `GET /proyectos`
- `POST /proyectos`
- `GET /proyectos/{id}`
- `PUT /proyectos/{id}`
- `DELETE /proyectos/{id}`
- `GET /proyectos/{id}/tareas`
- `GET /proyectos/{id}/estadisticas`

Filtros en listado:
- `empresaId`, `estado`, `clienteId`, `responsableId`, `fechaInicio`, `fechaFin`
- `page`, `limit`, `sort`

`sort` soporta: `nombre`, `fechaInicio`, `fechaFin`, `estado`, `createdAt` (prefijo `-` para DESC).

Ejemplo POST `/proyectos`:
```json
{
  "empresaId": "7f1b9b7a-3a4a-4f1b-9b6a-7f6c2b9e1f10",
  "nombre": "Proyecto Atlas",
  "descripcion": "Migracion de CRM",
  "fechaInicio": "2026-01-10",
  "fechaFin": "2026-03-30",
  "responsableId": "2c6d9f7b-1a4f-4a19-9d0a-5f3b7a1e9c33",
  "estado": "planificacion",
  "presupuesto": 25000,
  "clienteId": "c0a1a9d2-4a6f-4e2a-9b0f-1a6d8b0c4f55"
}
```

Ejemplo response (listado con `meta`):
```json
{
  "success": true,
  "data": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "empresaId": "7f1b9b7a-3a4a-4f1b-9b6a-7f6c2b9e1f10",
      "nombre": "Proyecto Atlas",
      "descripcion": "Migracion de CRM",
      "fechaInicio": "2026-01-10",
      "fechaFin": "2026-03-30",
      "responsableId": "2c6d9f7b-1a4f-4a19-9d0a-5f3b7a1e9c33",
      "estado": "planificacion",
      "presupuesto": 25000,
      "clienteId": "c0a1a9d2-4a6f-4e2a-9b0f-1a6d8b0c4f55",
      "createdAt": "2026-01-10T09:00:00Z",
      "updatedAt": "2026-01-10T09:00:00Z"
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

Respuesta `GET /proyectos/{id}/estadisticas`:
```json
{
  "success": true,
  "data": {
    "totalTareas": 12,
    "pendientes": 4,
    "enProgreso": 6,
    "completadas": 2,
    "porcentajeCompletado": 17,
    "horasEstimadas": 80,
    "horasReales": 24
  }
}
```

## Tareas

- `GET /tareas`
- `POST /tareas`
- `GET /tareas/{id}`
- `PUT /tareas/{id}`
- `DELETE /tareas/{id}`
- `PATCH /tareas/{id}/estado`
- `PATCH /tareas/{id}/asignar`

Filtros en listado:
- `empresaId`, `estado`, `prioridad`, `proyectoId`, `asignadoA`, `fechaVencimiento`
- `page`, `limit`, `sort`

`sort` soporta: `titulo`, `estado`, `prioridad`, `fechaVencimiento`, `createdAt` (prefijo `-` para DESC).

Ejemplo POST `/tareas`:
```json
{
  "empresaId": "7f1b9b7a-3a4a-4f1b-9b6a-7f6c2b9e1f10",
  "proyectoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "titulo": "Diseno de entidades",
  "descripcion": "Definir tablas y relaciones",
  "estado": "pendiente",
  "prioridad": "media",
  "asignadoA": "2c6d9f7b-1a4f-4a19-9d0a-5f3b7a1e9c33",
  "fechaVencimiento": "2026-01-31",
  "tiempoEstimado": 16
}
```

Ejemplo PATCH `/tareas/{id}/estado`:
```json
{ "estado": "en_progreso" }
```

Ejemplo PATCH `/tareas/{id}/asignar`:
```json
{ "asignadoA": "b8d3b1f9-6f1b-4b76-9e10-6c8f3b2f0a90" }
```

## Tiempos (registro de horas)

- `GET /tiempos`
- `POST /tiempos`
- `PUT /tiempos/{id}`
- `DELETE /tiempos/{id}`
- `GET /tiempos/proyecto/{id}/resumen`
- `GET /tiempos/usuario/{id}`
- `GET /tiempos/tarea/{id}`

Filtros en listado:
- `empresaId`, `tareaId`, `usuarioId`, `fecha`
- `page`, `limit`

Ejemplo POST `/tiempos`:
```json
{
  "empresaId": "7f1b9b7a-3a4a-4f1b-9b6a-7f6c2b9e1f10",
  "tareaId": "7b9d6a1e-9f2c-4c1a-8d7f-3a1b2c9d0e11",
  "usuarioId": "5f2a9d7b-3c1e-4f5a-8b9c-1d2e3f4a5b6c",
  "fecha": "2026-01-15",
  "horas": 3.5,
  "descripcion": "Reunion + avance"
}
```

Respuesta `GET /tiempos/proyecto/{id}/resumen`:
```json
{
  "success": true,
  "data": {
    "proyectoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "registros": 8,
    "horasTotales": 24
  }
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
      { "field": "estado", "message": "Debe ser uno de: planificacion, en_curso, pausado, completado" }
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
    "message": "Proyecto no encontrado",
    "details": []
  }
}
```

## Enums
- `proyecto.estado`: `planificacion | en_curso | pausado | completado`
- `tarea.estado`: `pendiente | en_progreso | completada`
- `tarea.prioridad`: `baja | media | alta`

## Tablas (referencia DB)
- `alm_proyectos`
- `alm_tareas`
- `alm_registro_horas`
