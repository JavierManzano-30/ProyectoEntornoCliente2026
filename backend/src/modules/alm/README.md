# ALM Backend - Guía rápida para Frontend

Este documento resume qué endpoints existen en el backend ALM y cómo consumirlos.

Base URL: `/api/v1/alm`  
Auth: `Authorization: Bearer <token>`

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
  "empresaId": "emp_1",
  "nombre": "Proyecto Atlas",
  "descripcion": "Migracion de CRM",
  "fechaInicio": "2026-01-10",
  "fechaFin": "2026-03-30",
  "responsableId": "usr_10",
  "estado": "planificacion",
  "presupuesto": 25000,
  "clienteId": "cli_5"
}
```

Ejemplo response (listado con `meta`):
```json
{
  "success": true,
  "data": [
    {
      "id": "proy_100",
      "empresaId": "emp_1",
      "nombre": "Proyecto Atlas",
      "descripcion": "Migracion de CRM",
      "fechaInicio": "2026-01-10",
      "fechaFin": "2026-03-30",
      "responsableId": "usr_10",
      "estado": "planificacion",
      "presupuesto": 25000,
      "clienteId": "cli_5",
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
  "empresaId": "emp_1",
  "proyectoId": "proy_100",
  "titulo": "Diseno de entidades",
  "descripcion": "Definir tablas y relaciones",
  "estado": "pendiente",
  "prioridad": "media",
  "asignadoA": "usr_10",
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
{ "asignadoA": "usr_20" }
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
  "empresaId": "emp_1",
  "tareaId": "tar_900",
  "usuarioId": "usr_10",
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
    "proyectoId": "proy_100",
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
