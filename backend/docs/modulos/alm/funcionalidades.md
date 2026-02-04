# 📌 Funcionalidades Principales del Módulo ALM

El módulo de **Application Lifecycle Management (ALM)** proporciona las funcionalidades necesarias para planificar, organizar y ejecutar el trabajo en proyectos y tareas.  
Actúa como un módulo operativo y transversal, conectando equipos, responsables y tiempos con el resto del sistema.

Cada funcionalidad está diseñada teniendo en cuenta su integración directa con otros módulos, evitando duplicidad de información y garantizando coherencia global.

---

## 1. 🗂️ Gestión de proyectos
ALM gestiona la **entidad proyecto** como núcleo de planificación y seguimiento.

### Esta funcionalidad permite:
- Crear, actualizar y consultar proyectos.
- Definir estado del proyecto (planned, in_progress, paused, completed).
- Asociar responsable del proyecto (usuario).
- Vincular proyectos a clientes (CRM) cuando aplica.
- Mantener histórico y trazabilidad de cambios.

### 🔗 Integración con otros módulos
- **CORE:** Consume usuarios para responsables y equipos.
- **CRM:** Vincula proyectos con clientes.
- **BI:** Consume estados y avance de proyectos para métricas.

---

## 2. ✅ Gestión de tareas asociadas a proyectos
ALM organiza el trabajo en **tareas** vinculadas a un proyecto.

### Esta funcionalidad permite:
- Crear y asignar tareas a usuarios.
- Gestionar estados (pending, in_progress, completed).
- Priorizar tareas (low, medium, high).
- Consultar tareas por proyecto y por estado.
- Mantener trazabilidad de modificaciones.

### 🔗 Integración con otros módulos
- **CORE:** Identidad y disponibilidad de usuarios asignados.
- **BI:** Métricas de productividad y cumplimiento.

---

## 2.1 🔑 Relaciones y claves foráneas
- `projects.responsible_id -> core_users.id` (CORE)
- `projects.client_id -> crm_clients.id` (CRM)
- `tasks.assigned_to -> core_users.id` (CORE)
- `tasks.project_id -> projects.id` (ALM)
- `time_entries.user_id -> core_users.id` (CORE)
- `time_entries.task_id -> tasks.id` (ALM)

---

## 3. ⏱️ Registro de tiempos
ALM permite registrar **tiempos dedicados** a tareas para control y seguimiento.

### Esta funcionalidad permite:
- Registrar horas trabajadas por usuario y tarea.
- Consultar dedicacion por proyecto o usuario.
- Comparar tiempo estimado vs real.

### 🔗 Integración con otros módulos
- **BI:** Analisis de esfuerzo y desviaciones.
- **ERP:** Costes asociados a dedicacion (si aplica).

---

## 4. 🔄 Exposición de datos para modulos transversales
ALM actua como **proveedor de informacion operativa**, publicando datos de avance y esfuerzo.

### 🔗 Integración con otros módulos
- **BI:** KPIs de productividad y avance.
- **BPM:** Coordinación con procesos de aprobacion.

Toda la exposición respeta el aislamiento multiempresa y los controles de acceso.

---

## 5. 🛡️ Trazabilidad y auditoría
Las entidades principales incluyen campos de auditoria y control de cambios.

### Se garantiza:
- Registro de autor y fecha de cada cambio.
- Conservacion del historico de estados.
- Control de acceso basado en roles.

### 🔗 Integración con otros módulos
- **CORE:** Roles y permisos.
- **BI:** Informes de control y auditoria.
