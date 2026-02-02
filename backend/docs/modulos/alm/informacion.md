# 📘 Módulo ALM – Descripción General

## 1. Finalidad del módulo
El módulo de **Application Lifecycle Management (ALM)** tiene como finalidad organizar, planificar y controlar el trabajo en proyectos, tareas y tiempos dentro de la empresa.

Actúa como un módulo operativo que conecta la estrategia (proyectos) con la ejecución (tareas), y se integra con otros módulos como **CORE, CRM y BI**.

Desde el backend, ALM aporta un modelo de datos estructurado para la gestión de proyectos y su avance, manteniendo trazabilidad y coherencia en entornos **multiempresa (multi-tenant)**.

---

## 2. Funcionalidades principales
1. Gestión completa de proyectos (creación, estado y seguimiento).  
2. Gestión de tareas asociadas a proyectos.  
3. Asignación de tareas a usuarios responsables.  
4. Consulta de tareas por proyecto y por estado.  
5. Registro básico de tiempos trabajados.  
6. Vínculo opcional con clientes (CRM) para proyectos externos.  
7. Exposición de datos de avance para BI.  

---

## 3. Usuarios que lo utilizan
- Administradores del sistema.  
- Managers / responsables de proyecto.  
- Usuarios asignados a tareas.  
- Dirección (seguimiento de avance y costes).  
- Sistemas internos (integraciones).  

---

## 4. Datos que gestiona
- **Proyectos:** planificación y estado del trabajo.  
  - Campos clave: `id`, `company_id`, `name`, `description`, `start_date`, `end_date`, `responsible_id`, `status`, `budget`, `client_id`, `created_at`, `updated_at`.  
- **Tareas:** unidades de ejecución dentro de proyectos.  
  - Campos clave: `id`, `company_id`, `project_id`, `title`, `description`, `status`, `priority`, `assigned_to`, `due_date`, `estimated_time`, `created_at`, `updated_at`.  
- **Registro de horas:** seguimiento básico de dedicación.  
  - Campos clave: `id`, `company_id`, `task_id`, `user_id`, `entry_date`, `hours`, `description`, `created_at`, `updated_at`.  

---

## 5. Problemas que resuelve
- Falta de visibilidad sobre el avance de proyectos.  
- Desorganización en la asignación de tareas.  
- Dificultad para relacionar trabajo con clientes.  
- Ausencia de trazabilidad en tiempos y responsabilidades.  

---

## 6. Métricas expuestas para BI
- Proyectos en curso por empresa.  
- Tareas completadas vs pendientes.  
- Tiempo estimado vs tiempo real.  
- Productividad por usuario/proyecto.  
- Proyectos por cliente.  

---

## 7. Rol del módulo ALM en la arquitectura global
ALM actúa como **módulo operativo y de ejecución**. Consume datos base de CORE (usuarios, empresas) y se integra con:

- **CORE:** usuarios disponibles para asignación.  
- **CRM:** proyectos asociados a clientes.  
- **BI:** métricas de productividad y avance.  

### Integraciones clave (consume/provee + FK)

| Módulo | Relación | Campo FK |
|---|---|---|
| CORE | ALM consume usuarios | `projects.responsible_id -> core_users.id` |
| CORE | ALM consume usuarios | `tasks.assigned_to -> core_users.id` |
| CRM | ALM consume clientes | `projects.client_id -> crm_clients.id` |
| CORE | ALM consume usuarios | `time_entries.user_id -> core_users.id` |
| BI | BI consume datos de ALM | `projects`, `tasks`, `time_entries` |

> Referencia del modelo completo: `docs/database/modelo-datos-backend.md`.
