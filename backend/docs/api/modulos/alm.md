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

### Proyectos
- `GET /alm/proyectos`
- `POST /alm/proyectos`
- `GET /alm/proyectos/{id}`
- `PUT /alm/proyectos/{id}`
- `DELETE /alm/proyectos/{id}`
- `GET /alm/proyectos/{id}/tareas`

Filtros y paginacion (listas):
- `page`, `limit`, `sort`
- `estado`, `clienteId`, `responsableId`, `fechaInicio`, `fechaFin`

Ejemplo request (POST):
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

Ejemplo response (POST):
```json
{
  "success": true,
  "data": {
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
}
```

### Tareas
- `GET /alm/tareas`
- `POST /alm/tareas`
- `GET /alm/tareas/{id}`
- `PUT /alm/tareas/{id}`
- `DELETE /alm/tareas/{id}`

Filtros y paginacion (listas):
- `page`, `limit`, `sort`
- `estado`, `prioridad`, `proyectoId`, `asignadoA`, `fechaVencimiento`

Ejemplo request (POST):
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

Ejemplo response (POST):
```json
{
  "success": true,
  "data": {
    "id": "tar_900",
    "empresaId": "emp_1",
    "proyectoId": "proy_100",
    "titulo": "Diseno de entidades",
    "descripcion": "Definir tablas y relaciones",
    "estado": "pendiente",
    "prioridad": "media",
    "asignadoA": "usr_10",
    "fechaVencimiento": "2026-01-31",
    "tiempoEstimado": 16,
    "createdAt": "2026-01-12T10:00:00Z",
    "updatedAt": "2026-01-12T10:00:00Z"
  }
}
```

## Enums
- `proyecto.estado`: `planificacion | en_curso | pausado | completado`
- `tarea.estado`: `pendiente | en_progreso | completada`
- `tarea.prioridad`: `baja | media | alta`

## Relaciones clave (para frontend)
- `proyectos.responsable_id` -> `usuarios.id`
- `proyectos.cliente_id` -> `clientes.id` (CRM)
- `tareas.asignado_a` -> `usuarios.id`
- `tareas.proyecto_id` -> `proyectos.id`
