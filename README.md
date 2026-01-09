# ProyectoEntornoCliente2026

Proyecto grupal de desarrollo de una **plataforma empresarial modular**, similar a herramientas como ERP/CRM/RRHH, organizada en **múltiples módulos integrados** (CORE, RRHH, CRM, BPM, ERP, ALM, Soporte y BI).

Durante el **Sprint 2.1** el equipo se centra en la **definición, organización y documentación del producto**, estableciendo:
- La visión global del sistema y sus módulos
- El modelo de datos común y las relaciones entre entidades
- Las integraciones entre módulos
- Un diseño de API a alto nivel
- La organización del equipo y la metodología de trabajo

En este sprint **no se desarrolla código funcional**, priorizando una base sólida y coherente antes de comenzar la implementación.

---

# Guia básica Trello  
Azul para Frontend
Morado para Backend
Rojo para Críticas/correciones
Verde para Base de Datos

**Nomenclatura**  
Un ejemplo de ticket puede ser FE - "Título de ticket".
Crear, seleccionar ticket, añadir etiqueta de color y añadir breve descripción.

**Progreso del ticket**  
<img width="1778" height="259" alt="image" src="https://github.com/user-attachments/assets/2b31a82b-c864-4747-a778-66d6ec1f1491" />  

- TO DO -> Listado completo con todos los tickets pendientes.
- PROGRESS -> Ticket que se está realizando en ese momento (solo un ticket por persona en PROGRESS).
- ON HOLD -> Listado de Tickets que están bloqueados por algún motivo, por ejemplo que tu ticket dependa de otro ticket.
- UNDER REVIEW -> Tickets que se ha realizado el contenido y se está revisando que funciona correctamente.
- DONE -> Cuando se ha dado por valido el funcionamiento y finalización del ticket.

## MODELADO PROVISIONAL DE BBDD

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

---

# Idea base frontend

## Paleta de colores
- Azul primario: #2867B2
- Verde acento: #27AE60
- Naranja acento: #FF9900
- Fondo: #F6F6F6
- Texto principal: #222
- Error: #FF4D4F

## Tipografía
- Fuente principal: Inter (Google Fonts)
- Alternativa: Roboto, Open Sans
- Tamaños: Títulos 24-32px, Texto 14-16px

## Componentes de UI principales
- Sidebar con iconos para navegación rápida
- Tablas para listados
- Formularios simples (inputs, selects, datepickers)
- Cards para resúmenes/detalles
- Botones azules (primario), grises (secundario)

## Pantallas mínimas por módulo
- CORE: Dashboard, Login, Lista Usuarios, Detalle Usuario, Alta/Edición Usuario, Lista Empresas, Detalle Empresa, Alta/Edición Empresa, Roles
- RRHH: Lista Empleados, Detalle Empleado, Alta/Edición Empleado, Vacaciones/ausencias (calendario, solicitud)
- CRM: Lista Clientes, Detalle Cliente, Alta/Edición Cliente, Oportunidades/interacciones
- BPM: Lista Procesos, Detalle Proceso, Crear/Edición, Seguimiento/Aprobación
- ERP: Lista Facturas, Detalle Factura, Crear/Edición Factura, Lista Productos, Detalle Producto
- ALM: Lista Proyectos, Detalle Proyecto, Crear/Edición Proyecto, Lista Tareas
- Soporte: Lista Tickets, Detalle Ticket, Crear/Edición Ticket, Chat
- BI: Dashboard, Vista informe

> *Total aproximado para MVP: 32-38 pantallas.*

---
