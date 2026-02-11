# Informe Tecnico - Modulo RRHH (Backend)

## 1. Objetivo de este documento
Este documento resume lo implementado en el modulo `RRHH` dentro del backend, como se conecto la capa de datos, que endpoints quedaron operativos, que pruebas se realizaron y cual es el estado final para que el resto del equipo pueda continuar sin bloqueos.

## 2. Alcance realizado
Se trabajo exclusivamente dentro de `src/modules/rrhh`.

Incluye:
- Estructura completa por capas (`routes`, `controllers`, `services`).
- Implementacion funcional de los recursos principales de RRHH:
  - departamentos
  - empleados
  - contratos
  - ausencias
  - nominas
  - evaluaciones
- Validaciones de negocio clave:
  - aislamiento por empresa (`company_id`) segun token
  - validacion de fechas (`start_date <= end_date`)
  - control de solape en contratos activos
  - control de solape en ausencias pendientes/aprobadas
- Flujos de baja logica:
  - empleado -> `status = inactive`
  - contrato -> `active = false` y cierre de `end_date` si aplica
  - ausencia -> `status = rejected`

## 3. Arquitectura final del modulo RRHH
### 3.1 Rutas
Archivo: `src/modules/rrhh/routes/index.js`

Base URL del modulo:
- `/api/v1/rrhh`

Todas las rutas (excepto health) pasan por `requireAuth`.

### 3.2 Controladores
Carpeta: `src/modules/rrhh/controllers`

Controladores implementados:
- `department-controller.js`
- `employee-controller.js`
- `contract-controller.js`
- `absence-controller.js`
- `payroll-controller.js`
- `evaluation-controller.js`

### 3.3 Servicios
Carpeta: `src/modules/rrhh/services`

Servicios implementados:
- `department-service.js`
- `employee-service.js`
- `contract-service.js`
- `absence-service.js`
- `payroll-service.js`
- `evaluation-service.js`
- `hr-shared-service.js`
- `supabase-service-utils.js`

## 4. Conexion a datos (punto importante)
### 4.1 Como quedo conectado RRHH
El modulo RRHH quedo funcionando contra Supabase usando key de API (sin depender de password local de Postgres para este modulo).

Variables usadas:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

En el proyecto, el cliente se resuelve en:
- `src/config/supabase.js`

### 4.2 Motivo tecnico
La conexion inicial via `pg` (DB_HOST/DB_USER/DB_PASSWORD/DB_NAME) fallaba por credenciales de Postgres local.
Para desbloquear desarrollo y pruebas, RRHH se adapto a consultas mediante cliente Supabase (`supabase.from(...)`) usando la `Anon Key`.

### 4.3 Resultado
- Se pudo consultar y operar datos reales en tablas `hr_*`.
- Se validaron endpoints RRHH del backend con `200/201/204` en los casos esperados.

## 5. Endpoints disponibles en RRHH
### 5.1 Departamentos
- `GET /rrhh/departamentos`
- `POST /rrhh/departamentos`
- `GET /rrhh/departamentos/:id`
- `PUT /rrhh/departamentos/:id`
- `DELETE /rrhh/departamentos/:id` (fisico)

### 5.2 Empleados
- `GET /rrhh/empleados`
- `POST /rrhh/empleados`
- `GET /rrhh/empleados/:id`
- `GET /rrhh/empleados/:id/resumen`
- `PUT /rrhh/empleados/:id`
- `DELETE /rrhh/empleados/:id` (baja logica -> inactive)

### 5.3 Contratos
- `GET /rrhh/contratos`
- `POST /rrhh/contratos`
- `GET /rrhh/contratos/:id`
- `PUT /rrhh/contratos/:id`
- `DELETE /rrhh/contratos/:id` (desactivacion logica)

### 5.4 Ausencias
- `GET /rrhh/ausencias`
- `POST /rrhh/ausencias`
- `GET /rrhh/ausencias/:id`
- `PUT /rrhh/ausencias/:id`
- `DELETE /rrhh/ausencias/:id` (rechazo logico)
- `PATCH /rrhh/ausencias/:id/aprobar`
- `PATCH /rrhh/ausencias/:id/rechazar`

### 5.5 Nominas
- `GET /rrhh/nominas`
- `POST /rrhh/nominas`
- `GET /rrhh/nominas/:id`

### 5.6 Evaluaciones
- `GET /rrhh/evaluaciones`
- `POST /rrhh/evaluaciones`
- `GET /rrhh/evaluaciones/:id`

## 6. Formato de payload (acordado)
En RRHH se estandarizo request/response alineado con columnas de BD (`snake_case`), por ejemplo:
- `company_id`
- `employee_id`
- `start_date`
- `end_date`
- `review_date`
- `gross_amount`
- `net_amount`

## 7. Pruebas realizadas
Se validaron pruebas manuales completas con:
- `src/modules/rrhh/rrhh.http` (backend RRHH)
- `src/modules/rrhh/supabase-rrhh.http` (consulta directa Supabase REST)

Ejecucion de pruebas:
- Todas las comprobaciones funcionales se realizaron desde archivos `.http` (REST Client).
- El flujo probado desde `rrhh.http` incluyo login, listados, altas, consultas por ID, actualizaciones y bajas logicas.
- El flujo probado desde `supabase-rrhh.http` valido conexion y lectura directa de tablas `hr_*` mediante `SUPABASE_ANON_KEY`.

Resultados observados:
- Login correcto (`200`).
- CRUD de RRHH operativo.
- Estados finales coherentes:
  - empleado inactivo tras delete logico
  - contrato inactivo tras delete logico
  - ausencia rechazada tras delete/rechazo
- Sin errores 5xx en el flujo probado.

## 8. Relaciones con otros modulos
RRHH esta integrado de forma transversal por dise�o:
- `CORE`: auth JWT, empresa (`company_id`), relacion opcional con `core_users` via `user_id`.
- `ALM`, `BPM`, `ERP`, `BI`, `Soporte`: consumen o pueden consumir datos RRHH para asignaciones, procesos, coste laboral y analitica.

Nota: la integracion de consumo en esos modulos depende de implementaciones de cada equipo; RRHH ya expone su API para ello.

## 9. Estado actual
Estado: `OPERATIVO` para desarrollo y consumo desde frontend.

## 10. Archivos clave de esta entrega
- `src/modules/rrhh/routes/index.js`
- `src/modules/rrhh/controllers/*.js`
- `src/modules/rrhh/services/*.js`
- `src/modules/rrhh/rrhh.http`
- `src/modules/rrhh/supabase-rrhh.http`

---
