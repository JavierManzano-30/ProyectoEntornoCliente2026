# MODELADO PROVISIONAL DE BBDD

##  CORE

### **Empresas**

Entidad raíz del sistema (multi-tenant).

* **id**: identificador único
* **nombre**: nombre comercial
* **cif**: identificador fiscal
* **email**
* **telefono**
* **logo_url**
* **created_at**
* **updated_at**

---

### **Usuarios**

Usuarios con acceso a la plataforma.

* **id**
* **empresa_id** → Empresa propietaria
* **email** (único)
* **password_hash**
* **nombre**
* **apellidos**
* **rol**: admin | manager | empleado
* **avatar_url**
* **estado**: activo | inactivo
* **created_at**
* **updated_at**

Relaciones:

* Pertenece a una empresa
* Puede ser responsable de departamentos, clientes, proyectos, etc.

---

### **Departamentos**

Estructura organizativa interna.

* **id**
* **empresa_id**
* **nombre**
* **responsable_id** → Usuario responsable
* **created_at**
* **updated_at**

---

### **Notificaciones**

Sistema interno de avisos a usuarios.

* **id**
* **usuario_id**
* **mensaje**
* **leida** (true / false)
* **tipo**: info | warning | success
* **enlace**
* **created_at**

---

##  MÓDULO RRHH

### **Empleados**

Registro laboral (puede existir sin usuario).

* **id**
* **empresa_id**
* **usuario_id** (opcional)
* **numero_empleado**
* **nombre**
* **apellidos**
* **email**
* **telefono**
* **departamento_id**
* **puesto**
* **fecha_inicio**
* **manager_id** → otro empleado
* **salario**
* **estado**: activo | baja
* **foto_url**
* **created_at**
* **updated_at**

---

### **Ausencias**

Gestión de vacaciones y permisos.

* **id**
* **empresa_id**
* **empleado_id**
* **tipo**: vacaciones | enfermedad | permiso
* **fecha_inicio**
* **fecha_fin**
* **dias_totales**
* **motivo**
* **estado**: pendiente | aprobada | rechazada
* **aprobador_id** → usuario
* **created_at**
* **updated_at**

---

##  MÓDULO CRM

### **Clientes**

Leads y clientes finales.

* **id**
* **empresa_id**
* **nombre**
* **email**
* **telefono**
* **direccion**
* **ciudad**
* **responsable_id** → usuario asignado
* **tipo**: lead | cliente
* **notas**
* **created_at**
* **updated_at**

---

### **Oportunidades**

Pipeline comercial.

* **id**
* **empresa_id**
* **cliente_id**
* **titulo**
* **descripcion**
* **valor**
* **fase**: contacto | propuesta | negociacion | ganada | perdida
* **probabilidad**
* **fecha_cierre_estimada**
* **responsable_id**
* **created_at**
* **updated_at**

---

### **Actividades**

Historial de interacciones comerciales.

* **id**
* **empresa_id**
* **usuario_id**
* **cliente_id** (opcional)
* **oportunidad_id** (opcional)
* **tipo**: llamada | email | reunion | nota
* **asunto**
* **descripcion**
* **fecha**
* **completada**
* **created_at**
* **updated_at**

---

##  MÓDULO ALM / PROYECTOS

### **Proyectos**

Gestión de proyectos internos o para clientes.

* **id**
* **empresa_id**
* **nombre**
* **descripcion**
* **fecha_inicio**
* **fecha_fin**
* **responsable_id**
* **estado**: planificacion | en_curso | pausado | completado
* **presupuesto**
* **cliente_id** (opcional)
* **created_at**
* **updated_at**

---

### **Tareas**

Unidades de trabajo dentro de proyectos.

* **id**
* **empresa_id**
* **proyecto_id**
* **titulo**
* **descripcion**
* **estado**: pendiente | en_progreso | completada
* **prioridad**: baja | media | alta
* **asignado_a** → usuario
* **fecha_vencimiento**
* **tiempo_estimado** (horas)
* **created_at**
* **updated_at**

---

### **Registro de Horas**

Timesheet por tarea.

* **id**
* **empresa_id**
* **tarea_id**
* **usuario_id**
* **fecha**
* **horas**
* **descripcion**
* **created_at**

---

##  MÓDULO SOPORTE

### **Tickets**

Gestión de incidencias y soporte.

* **id**
* **empresa_id**
* **titulo**
* **descripcion**
* **categoria**: tecnico | facturacion | otro
* **prioridad**: baja | media | alta | urgente
* **estado**: abierto | en_progreso | resuelto | cerrado
* **creador_id**
* **asignado_a**
* **created_at**
* **updated_at**

---

### **Comentarios de Ticket**

Conversación asociada a un ticket.

* **id**
* **ticket_id**
* **usuario_id**
* **comentario**
* **created_at**

---

## 🔗 Relaciones Clave (Resumen)

* Todo pertenece a **Empresa**
* **Usuario ≠ Empleado** (relación opcional)
* CRM ↔ Proyectos (cliente opcional)
* Proyectos → Tareas → Registro de horas
* Soporte completamente integrado con usuarios


## Diagrama Entidad Relación

<img src = "./media/Entidad-Relacion.png">