# Endpoints - ALM

## Base

- Base URL: `/api/v1`
- Auth: `Authorization: Bearer <token>`

## Proyectos

- `GET /alm/proyectos`
- `POST /alm/proyectos`
- `GET /alm/proyectos/{id}`
- `PUT /alm/proyectos/{id}`
- `DELETE /alm/proyectos/{id}`
- `GET /alm/proyectos/{id}/tareas`

## Tareas

- `GET /alm/tareas`
- `POST /alm/tareas`
- `GET /alm/tareas/{id}`
- `PUT /alm/tareas/{id}`
- `DELETE /alm/tareas/{id}`

## Relaciones clave (para frontend)

- `proyectos.responsable_id` -> `usuarios.id`
- `proyectos.cliente_id` -> `clientes.id` (CRM)
- `tareas.asignado_a` -> `usuarios.id`
- `tareas.proyecto_id` -> `proyectos.id`
