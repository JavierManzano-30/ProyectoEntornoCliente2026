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
