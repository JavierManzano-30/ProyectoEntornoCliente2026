# API - ALM

Este documento aplica las convenciones de `docs/api/convenciones-api.md` al modulo ALM.

## 1. URI y versionado
- Base URL: `/api/v1`
- Recursos en plural, `kebab-case` si aplica (preferir una sola palabra).
- Anidamiento maximo de 1 nivel.

## 2. Formato de respuesta (Envelope)

Respuesta exitosa:
```json
{
  "success": true,
  "data": { },
  "meta": { }
}
```

Respuesta de error:
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "El recurso con ID 55 no existe.",
    "details": []
  }
}
```

## 3. Metodos HTTP
- `GET`: leer recursos.
- `POST`: crear recursos.
- `PUT`: reemplazar un recurso completo.
- `PATCH`: modificacion parcial.
- `DELETE`: eliminar recursos.

## 4. Codigos de estado
- `200 OK` (GET, PUT, PATCH)
- `201 Created` (POST)
- `204 No Content` (DELETE)
- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
- `500 Internal Server Error`

## 5. Autenticacion y seguridad
- JWT en `Authorization: Bearer <token_jwt>`
- CORS restringido en produccion.

## 6. Paginacion
- `page` (empieza en 1)
- `limit` (defecto 10, max 100)

Meta de paginacion:
```json
{
  "page": 1,
  "limit": 10,
  "totalItems": 150,
  "totalPages": 15
}
```

## 7. Naming conventions (JSON)
- Propiedades en `camelCase`.
- Fechas en ISO 8601 UTC (`YYYY-MM-DDTHH:mm:ssZ`).

---

## Endpoints - ALM

Notas de esquema (synera-db.sql):
- IDs son UUID.
- `responsableId` corresponde a `responsable_employee_id` (empleado).
- `asignadoA` corresponde a `employee_id` (empleado).

### Proyectos
- `GET /alm/proyectos`
- `POST /alm/proyectos`
- `GET /alm/proyectos/{id}`
- `PUT /alm/proyectos/{id}`
- `DELETE /alm/proyectos/{id}`
- `GET /alm/proyectos/{id}/tareas`
- `GET /alm/proyectos/{id}/estadisticas`

Filtros y paginacion (listas):
- `page`, `limit`, `sort`
- `empresaId`, `estado`, `clienteId`, `responsableId`, `fechaInicio`, `fechaFin`

Ejemplo request (POST):
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

Ejemplo response (POST):
```json
{
  "success": true,
  "data": {
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
}
```

### Tareas
- `GET /alm/tareas`
- `POST /alm/tareas`
- `GET /alm/tareas/{id}`
- `PUT /alm/tareas/{id}`
- `DELETE /alm/tareas/{id}`
- `PATCH /alm/tareas/{id}/estado`
- `PATCH /alm/tareas/{id}/asignar`

Filtros y paginacion (listas):
- `page`, `limit`, `sort`
- `empresaId`, `estado`, `prioridad`, `proyectoId`, `asignadoA`, `fechaVencimiento`

Ejemplo request (POST):
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

Ejemplo response (POST):
```json
{
  "success": true,
  "data": {
    "id": "7b9d6a1e-9f2c-4c1a-8d7f-3a1b2c9d0e11",
    "empresaId": "7f1b9b7a-3a4a-4f1b-9b6a-7f6c2b9e1f10",
    "proyectoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "titulo": "Diseno de entidades",
    "descripcion": "Definir tablas y relaciones",
    "estado": "pendiente",
    "prioridad": "media",
    "asignadoA": "2c6d9f7b-1a4f-4a19-9d0a-5f3b7a1e9c33",
    "fechaVencimiento": "2026-01-31",
    "tiempoEstimado": 16,
    "createdAt": "2026-01-12T10:00:00Z",
    "updatedAt": "2026-01-12T10:00:00Z"
  }
}

### Tiempos
- `GET /alm/tiempos`
- `POST /alm/tiempos`
- `PUT /alm/tiempos/{id}`
- `DELETE /alm/tiempos/{id}`
- `GET /alm/tiempos/proyecto/{id}/resumen`
- `GET /alm/tiempos/usuario/{id}`
- `GET /alm/tiempos/tarea/{id}`

Filtros y paginacion (listas):
- `page`, `limit`
- `empresaId`, `tareaId`, `usuarioId`, `fecha`

Ejemplo request (POST):
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
```

## Enums
- `proyecto.estado`: `planificacion | en_curso | pausado | completado`
- `tarea.estado`: `pendiente | en_progreso | completada`
- `tarea.prioridad`: `baja | media | alta`

## Relaciones clave (para frontend)
- `proyectos.responsable_employee_id` -> `empleados.id` (RRHH)
- `proyectos.cliente_id` -> `clientes.id` (CRM)
- `tareas.employee_id` -> `empleados.id` (RRHH)
- `tareas.proyecto_id` -> `proyectos.id`
