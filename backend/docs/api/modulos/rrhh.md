# Endpoints - RRHH

## Base

- Base URL: `/api/v1`
- Auth: `Authorization: Bearer <token>`

---

## Empleados

- `GET /rrhh/empleados`
- `POST /rrhh/empleados`
- `GET /rrhh/empleados/{id}`
- `PUT /rrhh/empleados/{id}`
- `DELETE /rrhh/empleados/{id}`

### Sub-recurso (máximo 1 nivel)
- `GET /rrhh/empleados/{id}/contratos`
- `GET /rrhh/empleados/{id}/ausencias`
- `GET /rrhh/empleados/{id}/nominas`
- `GET /rrhh/empleados/{id}/evaluaciones`

---

## Departamentos

- `GET /rrhh/departamentos`
- `POST /rrhh/departamentos`
- `GET /rrhh/departamentos/{id}`
- `PUT /rrhh/departamentos/{id}`
- `DELETE /rrhh/departamentos/{id}`

---

## Contratos

- `GET /rrhh/contratos`
- `POST /rrhh/contratos`
- `GET /rrhh/contratos/{id}`
- `PUT /rrhh/contratos/{id}`
- `DELETE /rrhh/contratos/{id}`

---

## Ausencias

- `GET /rrhh/ausencias`
- `POST /rrhh/ausencias`
- `GET /rrhh/ausencias/{id}`
- `PUT /rrhh/ausencias/{id}`
- `DELETE /rrhh/ausencias/{id}`

---

## Nóminas

- `GET /rrhh/nominas`
- `POST /rrhh/nominas`
- `GET /rrhh/nominas/{id}`
- `PUT /rrhh/nominas/{id}`
- `DELETE /rrhh/nominas/{id}`

---

## Evaluaciones de desempeño

- `GET /rrhh/evaluaciones`
- `POST /rrhh/evaluaciones`
- `GET /rrhh/evaluaciones/{id}`
- `PUT /rrhh/evaluaciones/{id}`
- `DELETE /rrhh/evaluaciones/{id}`

---

## Relaciones clave (para frontend)

- `empleados.empresa_id` -> `empresas.id` (CORE)
- `empleados.user_id` -> `usuarios.id` (CORE)

- `empleados.department_id` -> `departamentos.id` (RRHH)

- `contratos.employee_id` -> `empleados.id` (RRHH)
- `ausencias.employee_id` -> `empleados.id` (RRHH)
- `nominas.employee_id` -> `empleados.id` (RRHH)
- `evaluaciones.employee_id` -> `empleados.id` (RRHH)

- `ausencias` -> aprobación mediante BPM (flujo externo)
- `empleados.id` -> usado en ALM para asignación de tareas y proyectos
- `empleados.id` -> usado en Soporte para asignación/identificación de tickets
- `nominas.id` -> usado en ERP para contabilidad / costes salariales

---
