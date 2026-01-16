# 📌 Funcionalidades Principales del Módulo ALM

El módulo de **Application Lifecycle Management (ALM)** proporciona las funcionalidades necesarias para planificar, organizar y ejecutar el trabajo en proyectos y tareas.  
Actúa como un módulo operativo y transversal, conectando equipos, responsables y tiempos con el resto del sistema.

Cada funcionalidad está diseñada teniendo en cuenta su integración directa con otros módulos, evitando duplicidad de información y garantizando coherencia global.

---

## 1. 🗂️ Gestión de proyectos
ALM gestiona la **entidad proyecto** como núcleo de planificación y seguimiento.

### Esta funcionalidad permite:
- Crear, actualizar y consultar proyectos.
- Definir estado del proyecto (planificacion, en_curso, pausado, completado).
- Asociar responsable del proyecto (usuario).
- Vincular proyectos a clientes (CRM) cuando aplica.
- Mantener histórico y trazabilidad de cambios.

### 🔗 Integración con otros módulos
- **CORE:** Consume usuarios y empresas para responsables y permisos.
- **CRM:** Vincula proyectos con clientes.
- **BI:** Consume estados y avance de proyectos para métricas.

---

## 2. ✅ Gestión de tareas asociadas a proyectos
ALM organiza el trabajo en **tareas** vinculadas a un proyecto.

### Esta funcionalidad permite:
- Crear y asignar tareas a usuarios.
- Gestionar estados (pendiente, en_progreso, completada).
- Priorizar tareas (baja, media, alta).
- Consultar tareas por proyecto y por estado.
- Mantener trazabilidad de modificaciones.

### 🔗 Integración con otros módulos
- **CORE:** Identidad de usuarios asignados.
- **RRHH:** Referencia para disponibilidad de recursos.
- **BI:** Métricas de productividad y cumplimiento.

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
- **Soporte:** Posible conversión de tickets a tareas.
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

