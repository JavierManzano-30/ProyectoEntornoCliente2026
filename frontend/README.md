# Documentación Frontend — Plataforma Empresarial (Detalle de Módulos y Pantallas)

---

## 1. Visión General

La aplicación es una plataforma web modular para la gestión empresarial, diseñada con navegación clara, pantallas orientadas a la acción y componentes reutilizables. Cada módulo responde a necesidades concretas de áreas de negocio, permitiendo al usuario acceder, crear, editar y visualizar datos de forma sencilla, eficiente y segura.

### Principios clave en Frontend

- **Consistencia visual y de experiencia**
- **Componentización**: máxima reutilización y mantenimiento sencillo.
- **Feedback visual para acciones** (mensajes, loaders, errores).
- **Navegación directa, mínima profundidad de clics.**
- **Escalabilidad**: cada módulo puede crecer en funcionalidades.

---

## Listado de Pantallas Necesarias y Conexión Frontend-Backend por Módulo

---

## Listado de Pantallas por Módulo (con módulos mínimos de cada página)

### CORE (Usuarios, Empresas, Roles)
- **Login**
  - Módulos mínimos: Formulario de login, feedback/error.
- **Listado de usuarios**
  - Tabla de usuarios, búsqueda, filtro, paginación.
- **Detalle de usuario**
  - Visualización completa, acciones (editar, borrar, desactivar).
- **Alta de usuario**
  - Formulario de creación, validación.
- **Edición de usuario**
  - Formulario pre-llenado, validación.
- **Listado de empresas**
  - Tabla de empresas, búsqueda, filtro.
- **Detalle de empresa**
  - Datos corporativos, empleados asociados, editar.
- **Listado de roles**
  - Tabla, ver rol, editar rol, crear/eliminar.
- **Perfil de usuario**
  - Visualización y edición de datos personales.

---

### RRHH (Recursos Humanos)
- **Listado de empleados**
  - Tabla, búsqueda, filtros.
- **Detalle de empleado**
  - Ficha detallada y acciones (editar, baja, documentación, ausencias).
- **Alta empleado**
  - Formulario de datos.
- **Edición de empleado**
  - Formulario pre-llenado.
- **Gestión de ausencias/vacaciones**
  - Calendario, solicitud, aprobación/denegación.
- **Listado de nóminas/contratos**
  - Tabla, descarga.
- **Detalle de nómina/contrato** *(opcional para descarga/ver info completa)*

---

### CRM (Clientes, Oportunidades)
- **Listado de clientes**
  - Tabla, búsqueda, filtro.
- **Detalle de cliente**
  - Ficha, historial, oportunidades asociadas.
- **Alta cliente**
  - Formulario de datos.
- **Edición cliente**
  - Formulario pre-llenado.
- **Listado de contactos**
  - Tabla de contactos, búsqueda.
- **Listado/kanban de oportunidades**
  - Vista de pipeline, drag&drop etapas, nuevo/editar.
- **Detalle de oportunidad** *(opcional para desarrollos avanzados)*

---

### BPM (Procesos)
- **Listado de procesos**
  - Tabla, búsqueda, tipo y estado.
- **Detalle de proceso**
  - Visor de fases, historial.
- **Alta/edición de proceso**
  - Formulario/maqueta visual.
- **Seguimiento/aprobación**
  - Estado de instancia, aprobar, rechazar.

---

### ERP (Facturación, Inventario)
- **Listado de facturas**
  - Tabla, filtros, fecha y estado.
- **Detalle de factura**
  - Info completa, links a cliente/productos.
- **Alta/edición de factura**
  - Formulario.
- **Listado de productos**
  - Tabla, filtro, stock.
- **Detalle de producto**
  - Información, editar, histórico.

---

### ALM (Proyectos y Tareas)
- **Listado de proyectos**
  - Tabla, filtro, estado.
- **Detalle de proyecto**
  - Cronograma, milestones, equipo, tareas.
- **Alta/edición de proyecto**
  - Formulario.
- **Listado de tareas (por proyecto)**
  - Tabla/lista.
- **Detalle de tarea**
  - Ficha, comentarios, documentos.

---

### Soporte (Tickets)
- **Listado de tickets**
  - Tabla, prioridad, estado.
- **Detalle de ticket**
  - Historial, conversación.
- **Alta/edición de ticket**
  - Formulario.
- **Vista de conversación**
  - Chat/comentarios.

---

### BI (Business Intelligence)
- **Dashboard BI**
  - Tarjetas resumen, gráficas clave.
- **Listado de informes**
  - Tabla/list, filtro por módulo/fecha.
- **Detalle de informe**
  - Gráficas, exportar.

---

## Tabla Pantalla - Acción - Redirección

| Pantalla                | Acción                              | Redirección tras éxito               |
|-------------------------|-------------------------------------|--------------------------------------|
| Login                   | Iniciar sesión                      | Dashboard / Módulo principal         |
| Listado de <Entidad>    | Ver detalle, Crear, Editar, Eliminar| Detalle (Ver/Crear/Edit), Listado    |
| Detalle de <Entidad>    | Editar, Eliminar, Navegar a relacionado| Editar, Listado, Relacionado      |
| Alta de <Entidad>       | Guardar nuevo registro              | Detalle nuevo, Listado              |
| Edición de <Entidad>    | Guardar cambios                     | Detalle, Listado                    |
| Gestión vacaciones      | Solicitar, aprobar/denegar          | Listado ausencias, Detalle empleado  |
| Listado facturas        | Ver detalle, Descargar pdf          | Detalle factura, descarga           |
| Listado proyectos       | Ver detalle, Añadir proyecto        | Detalle, Listado                    |
| Kanban oportunidades    | Mover etapa, Crear/Editar Oportunidad| Kanban, Detalle oportunidad         |
| Detalle ticket          | Responder, cerrar/reabrir           | Detalle/Conversación, Listado       |
| Dashboard BI            | Acceso informe                      | Detalle informe                     |

*(<Entidad> = usuario, empleado, cliente, proyecto, etc.)*

---

## Relación de Pantallas-Backend (Rutas principales por operación)

| Página                       | Verb   | Endpoint                              | Descripción                                 |
|------------------------------|--------|---------------------------------------|---------------------------------------------|
| Login                        | POST   | /api/v1/auth/login                    | Login y obtener token                       |
| Listado usuarios             | GET    | /api/v1/users                         | Obtener usuarios con filtros/paginación     |
| Detalle usuario              | GET    | /api/v1/users/:id                     | Obtener usuario concreto                    |
| Alta/Edición usuario         | POST   | /api/v1/users                         | Crear usuario                               |
|                              | PATCH  | /api/v1/users/:id                     | Editar usuario                              |
| Eliminar usuario             | DELETE | /api/v1/users/:id                     | Eliminar usuario                            |
| Listado empleados            | GET    | /api/v1/employees                     | Obtener empleados                           |
| Detalle empleado             | GET    | /api/v1/employees/:id                 | Obtener detalle empleado                    |
| Alta/Edición empleado        | POST   | /api/v1/employees                     | Crear empleado                              |
|                              | PATCH  | /api/v1/employees/:id                 | Editar empleado                             |
| Listado ausencias            | GET    | /api/v1/vacations                     | Obtener ausencias/vacaciones                |
| Solicitud/gestión ausencia   | POST   | /api/v1/vacations                     | Crear nueva ausencia                        |
|                              | PATCH  | /api/v1/vacations/:id                 | Aprobar/Denegar                            |
| Listado nóminas              | GET    | /api/v1/employees/:id/payrolls        | Nóminas de empleado                        |
| Descargar nómina             | GET    | /api/v1/employees/:id/payrolls/:pid   | Descargar PDF nómina                        |
| Listado clientes/contactos   | GET    | /api/v1/clients                       | Obtener clientes                            |
| Detalle cliente              | GET    | /api/v1/clients/:id                   | Ficha cliente                               |
| Alta/Edición cliente         | POST   | /api/v1/clients                       | Crear cliente                               |
|                              | PATCH  | /api/v1/clients/:id                   | Editar cliente                              |
| Listado oportunidades        | GET    | /api/v1/opportunities                 | Kanban y oportunidades                      |
| Alta/Editar oportunidad      | POST   | /api/v1/opportunities                 | Crear oportunidad                           |
|                              | PATCH  | /api/v1/opportunities/:id             | Editar etapa o datos                        |
| Listado procesos             | GET    | /api/v1/processes                     | Procesos BPM                                |
| Detalle proceso              | GET    | /api/v1/processes/:id                 | Ficha BPM                                   |
| Alta/Editar proceso          | POST   | /api/v1/processes                     | Crear proceso                               |
|                              | PATCH  | /api/v1/processes/:id                 | Editar proceso                              |
| Seguimiento/aprobación       | PATCH  | /api/v1/processes/:id/approve         | Aprobar paso                                |
| Listado facturas             | GET    | /api/v1/invoices                      | Facturas ERP                                |
| Detalle factura              | GET    | /api/v1/invoices/:id                  | Ver factura                                 |
| Alta/Editar factura          | POST   | /api/v1/invoices                      | Crear factura                               |
|                              | PATCH  | /api/v1/invoices/:id                  | Editar factura                              |
| Descargar factura            | GET    | /api/v1/invoices/:id/pdf              | Descargar PDF                               |
| Listado productos            | GET    | /api/v1/products                      | Consulta productos                          |
| Detalle producto             | GET    | /api/v1/products/:id                  | Ficha producto                              |
| Listado proyectos            | GET    | /api/v1/projects                      | Proyectos ALM                               |
| Detalle proyecto             | GET    | /api/v1/projects/:id                  | Ver proyecto                                |
| Alta/Editar proyecto         | POST   | /api/v1/projects                      | Crear proyecto                              |
|                              | PATCH  | /api/v1/projects/:id                  | Editar proyecto                             |
| Listado tareas               | GET    | /api/v1/projects/:id/tasks            | Listar tareas de proyecto                   |
| Detalle tarea                | GET    | /api/v1/tasks/:id                     | Info tarea                                  |
| Alta/Editar tarea            | POST   | /api/v1/tasks                         | Crear tarea                                 |
|                              | PATCH  | /api/v1/tasks/:id                     | Editar tarea                                |
| Listado tickets soporte      | GET    | /api/v1/tickets                       | Tickets                                     |
| Detalle ticket               | GET    | /api/v1/tickets/:id                   | Ficha ticket                                |
| Alta/Editar ticket           | POST   | /api/v1/tickets                       | Crear ticket                                |
|                              | PATCH  | /api/v1/tickets/:id                   | Editar ticket                               |
| Conversación ticket          | POST   | /api/v1/tickets/:id/messages          | Enviar mensaje                              |
| Listado informes BI          | GET    | /api/v1/reports                       | Consulta informes BI                        |
| Detalle informe BI           | GET    | /api/v1/reports/:id                   | Ver gráfico/detalle                         |
| Dashboard BI                 | GET    | /api/v1/bi/kpis                       | KPIs y datos generales                      |

---

## 3. Detalle por Módulo

### A. CORE (Usuarios, Empresas, Roles)

#### 1. Listado de usuarios
- **Función:** Visualizar, buscar, filtrar y exportar usuarios del sistema.
- **Contenido:**
  - Tabla: nombre, email, empresa, rol, estado (activo/inactivo), fecha de creación
  - Acciones: Ver detalle, Editar, Eliminar, Crear nuevo usuario
  - Buscador por nombre/email, filtros por empresa/rol/estado
  - Exportación CSV/Excel

#### 2. Detalle de usuario
- **Función:** Ver toda la información relevante de un usuario y sus acciones principales.
- **Contenido:**
  - Datos completos del usuario: nombre, email, empresa, rol, estado, fecha de alta/modificación
  - Acciones: Editar usuario, Eliminar usuario, Resetear contraseña (si tiene permiso)
  - Historial de actividad/accesos recientes
  - Acceso directo a perfil o a empleado vinculado (si aplica)

#### 3. Alta de usuario
- **Función:** Dar de alta un nuevo usuario en el sistema.
- **Contenido:**
  - Formulario: nombre, apellidos, email, empresa (select), rol (select), estado, contraseña
  - Selectores de permisos extra si procede
  - Validaciones en tiempo real (email único, contraseña segura)
  - Botones: Guardar, Cancelar

#### 4. Edición de usuario
- **Función:** Modificar la información de un usuario ya existente.
- **Contenido:**
  - Formulario prellenado con los datos actuales del usuario
  - Posibilidad de cambiar campos editables: rol, empresa, estado, email, nombre
  - Guardar cambios o cancelar
  - Feedback de éxito/error al guardar

#### 5. Listado de empresas
- **Función:** Visualizar, buscar y gestionar empresas registradas en el sistema.
- **Contenido:**
  - Tabla: nombre legal, CIF, teléfono, dirección, número de empleados
  - Acciones: Ver detalle de empresa, Editar, Eliminar, Crear nueva empresa
  - Filtros por nombre, empleados, estado
  - Búsqueda por nombre o CIF

#### 6. Detalle de empresa
- **Función:** Mostrar todos los detalles de una empresa y acceso a sus registros vinculados.
- **Contenido:**
  - Datos generales: nombre legal, CIF, dirección, teléfono, email
  - Lista de empleados asociados
  - Historial de actividad de la empresa
  - Acciones: Editar empresa, Eliminar empresa
  - Acceso a módulos relacionados: RRHH, facturación

#### 7. Listado de roles
- **Función:** Visualizar y gestionar los roles y permisos disponibles en el sistema.
- **Contenido:**
  - Tabla: nombre de rol, descripción, módulos/acciones permitidas
  - Acciones: Crear nuevo rol, Editar rol, Eliminar rol
  - Buscador y filtro de roles

#### 8. Detalle/edición de rol
- **Función:** Consultar y modificar los permisos y descripciones de un rol.
- **Contenido:**
  - Nombre, descripción, listado de permisos (checkbox por módulo/acción)
  - Acciones: Guardar cambios, Eliminar rol, Volver atrás
  - Visualización de usuarios asociados a ese rol

#### 9. Perfil de usuario (propio)
- **Función:** Consultar y editar información personal y de acceso del usuario logueado.
- **Contenido:**
  - Datos personales: nombre, apellidos, email, teléfono, foto/avatar
  - Sección para cambiar contraseña, editar datos de contacto
  - Acciones: Guardar cambios, Cerrar sesión
  - Actividad reciente del usuario

---

### B. RRHH (Recursos Humanos)

#### 1. Listado de empleados
- **Función:** Visualizar, buscar y filtrar empleados de la empresa.
- **Contenido:**
  - Tabla: nombre, puesto, departamento, estado, fecha de incorporación
  - Acciones: Ver detalle, Editar, Eliminar, Crear nuevo empleado
  - Filtros por puesto, estado, departamento
  - Buscador por nombre o email

#### 2. Detalle de empleado
- **Función:** Ver la ficha completa de un empleado, gestionar acciones y acceder a información relacionada.
- **Contenido:**
  - Datos generales y laborales: nombre, cargo, departamento, supervisor, email, teléfono
  - Historial de puestos, evaluaciones, ausencias
  - Documentos asociados (contratos, nóminas, vacaciones)
  - Acciones: Editar empleado, Dar de baja, Generar certificado

#### 3. Alta empleado
- **Función:** Registrar un nuevo empleado en la empresa.
- **Contenido:**
  - Formulario: nombre, apellidos, email, puesto, departamento, fecha incorporación, tipo de contrato, salario
  - Adjuntar documentos iniciales (CV, contrato)
  - Botones: Guardar, Cancelar

#### 4. Edición empleado
- **Función:** Modificar los datos de un empleado existente.
- **Contenido:**
  - Formulario editable con los datos actuales del empleado
  - Modificar: puesto, departamento, salario, tipo de contrato, supervisor, datos personales
  - Guardar cambios, Cancelar

#### 5. Gestión de ausencias/vacaciones
- **Función:** Solicitar, aprobar y revisar ausencias y vacaciones.
- **Contenido:**
  - Calendario de ausencias por empleado o global
  - Solicitud de nueva ausencia, con motivo y fechas
  - Listado de ausencias por estado (pendiente, aprobada, denegada)
  - Acciones: Aprobar/denegar (si responsable), anular solicitud (si empleado)

#### 6. Listado de nóminas y contratos
- **Función:** Visualizar y descargar nóminas/contratos asociados al empleado.
- **Contenido:**
  - Tabla: nombre de documento, periodo, estado (firmado/pendiente), fecha de subida
  - Acciones: Descargar, Ver documento
  - Buscador por periodo/estado

---

### C. CRM (Clientes y Oportunidades)

#### 1. Listado de clientes
- **Función:** Visualizar y filtrar todos los clientes registrados.
- **Contenido:**
  - Tabla: nombre cliente, NIF, sector, responsable, fecha alta
  - Acciones: Ver detalle, Editar, Eliminar, Crear nuevo cliente
  - Buscador y filtros por sector/responsable

#### 2. Detalle de cliente
- **Función:** Consultar datos completos del cliente y su historial comercial.
- **Contenido:**
  - Datos fiscales y comerciales
  - Contactos asociados al cliente
  - Oportunidades y ventas relacionadas
  - Historial de actividades e interacciones
  - Acciones: Editar cliente, Ver/contactar responsable

#### 3. Alta de cliente
- **Función:** Añadir un nuevo cliente.
- **Contenido:**
  - Formulario: nombre, NIF, sector, datos de contacto, responsable asignado
  - Botones: Guardar, Cancelar

#### 4. Edición de cliente
- **Función:** Modificar información de un cliente.
- **Contenido:**
  - Formulario prellenado con datos actuales
  - Editar: datos de contacto, sector, responsable
  - Guardar cambios, Cancelar

#### 5. Listado de contactos
- **Función:** Ver y filtrar todos los contactos de clientes.
- **Contenido:**
  - Tabla: nombre, email, teléfono, cliente asociado, rol
  - Acciones: Ver, Editar, Eliminar, Añadir contacto
  - Filtros por cliente, rol, búsqueda por nombre/email

#### 6. Oportunidades comerciales (Kanban/pipeline)
- **Función:** Seguir, mover y crear oportunidades de negocio.
- **Contenido:**
  - Vista Kanban por etapas del pipeline
  - Cartas con nombre oportunidad, cliente, valor, fecha cierre, responsable
  - Acciones: Mover etapa (drag and drop), editar, borrar, ver detalle
  - Botón para nueva oportunidad

#### 7. Detalle de oportunidad
- **Función:** Consultar el detalle de una oportunidad de venta.
- **Contenido:**
  - Datos: cliente, valor, etapa, probabilidad, responsable, historial de interacciones
  - Acciones: Editar oportunidad, cambiar etapa, agregar nota/interacción

---

### D. BPM (Procesos)

#### 1. Listado de procesos
- **Función:** Ver todos los procesos empresariales modelados.
- **Contenido:**
  - Tabla: nombre, tipo, responsable, estado actual, fecha última ejecución
  - Acciones: Ver detalle, Editar, Eliminar, Crear proceso
  - Filtros por tipo/estado/responsable

#### 2. Detalle de proceso
- **Función:** Ver el flujo de fases, estado y progreso de un proceso.
- **Contenido:**
  - Diagrama de flujo/fases
  - Estado actual, historial de acciones, usuarios implicados
  - Acciones: Editar proceso, Aprobar/rechazar (si autorizado)

#### 3. Alta/Edición de proceso
- **Función:** Modelar un nuevo proceso o modificar uno existente.
- **Contenido:**
  - Formulario/maqueta visual: nombre, tipo, pasos, responsables por fase
  - Guardar cambios, Cancelar
  - Validación de coherencia de pasos y lógica de negocio

#### 4. Seguimiento/aprobación de procesos
- **Función:** Revisar y aprobar/rechazar procesos pendientes.
- **Contenido:**
  - Listado de procesos/instancias pendientes de acción, por usuario
  - Acciones: Aprobar, rechazar, ver historial
  - Filtro por estado/responsable

---

### E. ERP (Facturación, Inventario)

#### 1. Listado de facturas
- **Función:** Visualizar todas las facturas, ver estado y descargar.
- **Contenido:**
  - Tabla: número, cliente, fecha, importe, estado (pagado/pendiente), vencimiento
  - Acciones: Ver, Editar, Eliminar, Descargar PDF, Crear factura
  - Filtro por cliente, estado, fecha
  - Buscador por número/factura

#### 2. Detalle de factura
- **Función:** Ver completo de una factura.
- **Contenido:**
  - Todos los campos fiscales: cliente, conceptos, totales, impuestos, fecha, estado
  - Productos/servicios facturados
  - Documentos adjuntos
  - Acciones: Editar factura, Descargar PDF

#### 3. Alta/Edición de factura
- **Función:** Añadir nueva factura/modificar existente.
- **Contenido:**
  - Formulario: cliente, lista de productos/servicios, importes, fechas, impuestos, estado
  - Adjuntar documentos (presupuesto, justificante)
  - Guardar, Cancelar

#### 4. Listado de productos
- **Función:** Ver y gestionar productos disponibles.
- **Contenido:**
  - Tabla: nombre, SKU, categoría, stock actual, precio, proveedor
  - Acciones: Ver detalle de producto, Editar, Eliminar, Añadir producto
  - Filtros por categoría/proveedor

#### 5. Detalle/edición de producto
- **Función:** Consultar y modificar detalles del producto.
- **Contenido:**
  - Datos principales, histórico de movimientos/stock
  - Editar nombre, precio, proveedor, stock
  - Guardar cambios, Cancelar

---

### F. ALM (Proyectos y Tareas)

#### 1. Listado de proyectos
- **Función:** Ver y buscar proyectos de la empresa.
- **Contenido:**
  - Tabla: nombre, responsable, estado, % de avance, fechas importante
  - Acciones: Ver detalle, Editar, Eliminar, Crear nuevo proyecto
  - Filtros por estado, responsable, cliente

#### 2. Detalle de proyecto
- **Función:** Ver cronograma, tareas, equipo y documentos de un proyecto.
- **Contenido:**
  - Cronograma, milestones, tareas asociadas (tabla/lista)
  - Listado de miembros del proyecto
  - Documentos adjuntos, comentarios/interacciones
  - Acciones: Editar proyecto, Añadir tarea/comentario

#### 3. Alta/Edición de proyecto
- **Función:** Registrar nuevo proyecto o modificar datos de uno.
- **Contenido:**
  - Formulario: nombre, descripción, fechas, responsable, clientes vinculados
  - Adjuntar documentos de inicio/cierre
  - Guardar, Cancelar

#### 4. Listado de tareas (por proyecto)
- **Función:** Gestionar y hacer seguimiento de tareas del proyecto.
- **Contenido:**
  - Tabla: título, asignado, estado, prioridad, fecha entrega
  - Acciones: Ver detalle tarea, Editar, Completar, Crear tarea
  - Filtro por estado/prioridad/responsable

#### 5. Detalle de tarea
- **Función:** Consultar y actualizar información de una tarea específica.
- **Contenido:**
  - Datos: título, descripción, responsable, estado, fechas, subtareas
  - Comentarios, adjuntos
  - Acciones: Editar tarea, Cambiar estado/completada

---

### G. Soporte (Tickets)

#### 1. Listado de tickets
- **Función:** Visualizar, buscar y filtrar todos los tickets de soporte.
- **Contenido:**
  - Tabla: número, asunto, prioridad, estado, responsable, fecha creación
  - Acciones: Ver detalle, Editar, Eliminar, Crear ticket
  - Filtros por estado/prioridad/responsable

#### 2. Detalle de ticket
- **Función:** Consular toda la conversación, estado e historia del ticket.
- **Contenido:**
  - Datos principales, mensajes/conversaciones, adjuntos
  - Acciones: Responder, Cerrar, Reabrir, Editar ticket
  - Timeline de cambios

#### 3. Alta/Edición de ticket
- **Función:** Registrar y modificar un ticket de soporte.
- **Contenido:**
  - Formulario: asunto, descripción, prioridad, adjunto
  - Guardar, Cancelar

#### 4. Conversación de ticket (chat)
- **Función:** Conversar y dejar registro con el cliente o usuario.
- **Contenido:**
  - Mensajes, adjuntos
  - Botones de enviar, marcar como resuelto, escalar

---

### H. BI (Business Intelligence)

#### 1. Dashboard BI
- **Función:** Visualización de los principales KPIs y métricas globales.
- **Contenido:**
  - Tarjetas resumen (empleados activos, facturación, tickets abiertos, etc.)
  - Gráficas: líneas, barras, tarta, mapas de calor
  - Filtros por rango temporal/módulo

#### 2. Listado de informes
- **Función:** Consulta y filtrado de todos los informes generados.
- **Contenido:**
  - Tabla/lista de informes: nombre, módulo, periodo, responsable
  - Acciones: Ver detalle, Exportar, Borrar informe

#### 3. Detalle de informe
- **Función:** Ver el informe analítico en profundidad.
- **Contenido:**
  - Gráficos, tablas dinámicas, filtros adicionales
  - Exportación a PDF/Excel, compartir enlace
---

## 4. Consideraciones Comunes

- **Estados vacíos amigables**: mensajes inspiradores e iconos si no hay información.
- **Validación y feedback** en formularios y acciones (toasts, banners de error).
- **Cargas y skeletons**: placeholders visuales en pantallas con fetch de datos.
- **Accesibilidad básica** (etiquetas ARIA en formularios y botones importantes).

---

## 5. Conclusión y objetivos frontend

El desarrollo del frontend debe centrarse en la **claridad**, la **eficiencia** y la **usabilidad**. La plataforma permitirá a cualquier usuario con permisos resolver las necesidades clave de gestión, comunicación y análisis, con desplazamientos mínimos y una experiencia visual cuidada y moderna.

El éxito del frontend radica en entregar módulos completos pero intuitivos donde cada pantalla tenga sentido, facilite las tareas diarias y evolucione fácilmente hacia necesidades futuras.

---

## 6. Comunicación Frontend - Backend

### Objetivo

Permitir que la interfaz de usuario (frontend) interactúe en tiempo real y de forma segura con la lógica de negocio y los datos almacenados en el servidor (backend), garantizando la mejor experiencia, integridad y trazabilidad en la gestión empresarial.

---

### Arquitectura

- **Modelo Cliente-Servidor:** El frontend (SPA en React, Vue, etc.) consume datos y servicios expuestos por el backend a través de APIs RESTful o GraphQL.
- **Comunicación asíncrona:** Todas las operaciones de fetch, creación, edición, y borrado son asincrónicas usando `fetch`, `axios` u otra librería HTTP.
- **Seguridad:** La comunicación estará protegida mediante HTTPS. El acceso a los endpoints privados requiere autenticación (token JWT o similar).

---

### Flujo General

1. **Inicio de sesión (login):**
   - El usuario envía sus credenciales al endpoint `/api/auth/login`.
   - El backend responde con un token de acceso (JWT) si la autenticación es correcta.
   - El frontend almacena el token (en memoria o almacenamiento seguro tipo HttpOnly cookies).

2. **Consumo del API:**
   - Cada petición a endpoints protegidos incluye el token en el header `Authorization: Bearer <token>`.
   - Requests típicos:  
     - GET `/api/users` — Obtener listado de usuarios.
     - POST `/api/employees` — Crear empleado.
     - PATCH `/api/projects/{id}` — Editar proyecto.
     - DELETE `/api/tickets/{id}` — Borrar ticket.
     - etc.

3. **Gestión de estados y feedback:**
   - Loading: pantalla/campo de carga mientras se esperan respuestas.
   - Errores: capturados y mostrados claramente al usuario.
   - Exito: resaltar acciones correctamente ejecutadas mediante toasts/dialogs.

4. **Sincronización y actualización de datos:**
   - Tras un alta/edición/borrado, el frontend refresca la información del módulo correspondiente (re-fetch).
   - El estado global puede gestionarse con contextos, Redux, Vuex, etc.

---

### Ejemplo de endpoints por módulo

- **CORE:**
  - `GET /api/users`
  - `POST /api/users`
  - `GET /api/companies`
  - `PATCH /api/roles/{id}`
- **RRHH:**
  - `GET /api/employees`
  - `POST /api/employees`
  - `GET /api/vacations`
  - `PUT /api/absences/{id}`
- **CRM:**
  - `GET /api/clients`
  - `POST /api/clients`
  - `POST /api/interactions`
- **BPM:**
  - `GET /api/processes`
  - `GET /api/processes/{id}/instances`
  - `PATCH /api/processes/{id}/approve`
- **ERP:**
  - `GET /api/invoices`
  - `GET /api/products`
  - `POST /api/invoices`
- **ALM:**
  - `GET /api/projects`
  - `GET /api/projects/{id}/tasks`
  - `POST /api/tasks`
- **Soporte:**
  - `GET /api/tickets`
  - `PATCH /api/tickets/{id}/reply`
- **BI:**
  - `GET /api/reports`
  - `GET /api/bi/kpis`

---

### Consideraciones prácticas

- **Versionado:** todas las rutas de la API comienzan por `/api/v1/` para permitir futuras versiones sin romper el cliente.
- **Manejo de errores y expiración de sesión:**  
  - Códigos HTTP claros.  
  - Si el backend devuelve 401/403, redirigir al login automáticamente.
- **Paginación, filtros y orden:**  
  - Soportados mediante query params: `/api/employees?page=2&limit=10&sort=asc&filter=apellido:martinez`
- **Subida y descarga de archivos:**  
  - Usar endpoints tipo `POST /api/employees/{id}/documents` y devolver URLs seguras.
- **Notificaciones y actualizaciones en tiempo real:**  
  - Opcionalmente, integrar Websockets para tickets, tareas, mensajes de soporte o dashboards BI, o utilizar polling.

---

### Resumen

La capa frontend y la backend se comunican de forma segura, estructurada y documentada mediante una API común, lo que posibilita que la experiencia del usuario sea reactiva, coherente y confiable, independientemente del módulo o flujo particular que utilice.

---

### Estructura

# Estructura de Carpetas Frontend — Plataforma Empresarial

Una estructura modular, clara y escalable es fundamental para un desarrollo ordenado y colaborativo.  
Puedes adaptar la siguiente propuesta a frameworks como React o Vue, pero es válida para la mayoría de aplicaciones SPA modernas:

```
/src
  /assets               # Recursos estáticos (imágenes, logos, iconos, fuentes, estilos globales)
    /images
    /icons
    /fonts
    /styles
      global.css
      variables.css

  /components           # Componentes UI reutilizables (Botones, Tablas, Formularios, Cards, Dialogs)
    Button.jsx
    Table.jsx
    Modal.jsx
    InputField.jsx
    ...
  
  /layouts              # Layouts generales (Sidebar, Header, Footer, PageWrapper, etc.)
    MainLayout.jsx
    AuthLayout.jsx

  /modules              # Un folder por módulo funcional, cada uno con sus propias pantallas
    /core
      UserList.jsx
      UserDetail.jsx
      UserForm.jsx
      CompanyList.jsx
      RoleList.jsx
      ...
    /rrhh
      EmployeeList.jsx
      EmployeeDetail.jsx
      EmployeeForm.jsx
      AbsenceCalendar.jsx
      PayrollList.jsx
      ...
    /crm
      ClientList.jsx
      ClientDetail.jsx
      ClientForm.jsx
      OpportunityBoard.jsx
      ...
    /bpm
      ProcessList.jsx
      ProcessDetail.jsx
      ProcessForm.jsx
      Approvals.jsx
      ...
    /erp
      InvoiceList.jsx
      InvoiceDetail.jsx
      InvoiceForm.jsx
      ProductList.jsx
      ...
    /alm
      ProjectList.jsx
      ProjectDetail.jsx
      ProjectForm.jsx
      TaskList.jsx
      TaskDetail.jsx
      ...
    /soporte
      TicketList.jsx
      TicketDetail.jsx
      TicketForm.jsx
      Chat.jsx
      ...
    /bi
      DashboardBI.jsx
      ReportList.jsx
      ReportDetail.jsx

  /services             # Lógica de acceso a API, requests (típicamente un archivo por módulo)
    api.js
    coreService.js
    rrhhService.js
    crmService.js
    bpmService.js
    erpService.js
    almService.js
    soporteService.js
    biService.js

  /contexts             # Contextos de autenticación, usuario, tema, global state (React Context o equivalente)
    AuthContext.jsx
    ThemeContext.jsx
    UserContext.jsx

  /hooks                # Custom hooks reutilizables (cargar datos, validación, etc.)
    useFetch.js
    useForm.js
    useAuth.js

  /routes               # Definición de rutas y navegación de la app
    AppRoutes.jsx

  /utils                # Utilidades auxiliares, helpers, validaciones, formateadores
    dateUtils.js
    validations.js
    fileUtils.js
    ...

  /i18n                 # Internacionalización, traducciones
    es.json
    en.json

  /pages                # Páginas globales (Login, Registro, Error 404, Landing, Perfil)
    Login.jsx
    NotFound.jsx
    Profile.jsx
    Home.jsx

/index.js               # Entry point de la app
/App.js                 # Componente raíz
```

### Consejos:
- **Cada módulo** debería poder crecer sin interferir con otros; por eso tiene su propia carpeta y componentes.
- **Styles** generales en `/assets/styles` y específicos en los módulos.
- **Servicios** centralizan la lógica de petición al backend, separando UI y datos.
- **Componentes reutilizables** se apartan de los específicos de módulo.
- Puedes añadir `/tests` en cada módulo o un `/__tests__/` global para los tests unitarios y de integración.
- Si usas TypeScript, cambia `.js`/`.jsx` por `.ts`/`.tsx`.

> Esta estructura es un punto de partida profesional y escalable, flexible para crecer y reorganizar según la evolución del proyecto y las decisiones del equipo.

# Ejemplos de tickets para Trello — Reparto Frontend Plataforma Empresarial

Aquí tienes ejemplos realistas de tarjetas (tickets) para un tablero Trello que podéis usar para organizar y repartir el trabajo.  
Incluyen definición clara, entregables y breve criterio de aceptación.

---

## 1. Estructura base y elementos transversales

**[TICKET] Inicializar repositorio Frontend y estructura de carpetas**
- Descripción: Crear repo en GitHub, setear estructura básica de carpetas y subcarpetas (assets, components, layouts, modules...).
- Criterio de aceptación: El proyecto arranca correctamente, estructura visible en el repo.

**[TICKET] Implementar sistema de rutas y navegación general**
- Descripción: Definir la navegación entre páginas principales con React Router (o Vue Router).
- Criterio de aceptación: Menú permite ir de Login a Dashboard y a cada módulo.

---

## 2. CORE (Usuarios, Empresas, Roles)

**[TICKET] Pantalla listado de usuarios**
- Descripción: Crear componente que muestre una tabla de usuarios con paginación, búsqueda y botones de acciones (ver, editar, eliminar, crear).
- Criterio de aceptación: Se ve la tabla, busca y filtra correctamente.

**[TICKET] Pantalla detalle de usuario**
- Descripción: Mostrar información completa del usuario seleccionado, opción de editar o eliminar.
- Criterio de aceptación: Se ven todos los campos del usuario, enlaza a editar correctamente.

**[TICKET] Formulario alta/edición de usuario**
- Descripción: Crear formulario con validaciones; aprovecha componentes comunes.
- Criterio de aceptación: Se valida y guarda (mock/front) un usuario nuevo o editado.

**[TICKET] Pantalla gestión de empresas**
- Descripción: Listado de empresas, permite ver, añadir y editar empresas clientes.

**[TICKET] Gestión de roles y permisos**
- Descripción: Listar roles, crear/editar roles, asignar permisos sobre módulos.

---

## 3. RRHH (Recursos Humanos)

**[TICKET] Pantalla listado de empleados**
- Descripción: Tabla de empleados con búsqueda, filtros por estado/puesto/dep.
- Criterio de aceptación: La lista es navegable y responde a filtros.

**[TICKET] Detalle de empleado**
- Descripción: Vista "ficha", incluye datos personales, historial, ausencias.
- Criterio de aceptación: Se navega desde lista y muestra todos los datos.

**[TICKET] Alta/edición de empleado**
- Descripción: Formulario con campos (ver documentación), validaciones.

**[TICKET] Gestión de vacaciones/ausencias**
- Descripción: Vista calendario, permite solicitud, aprobación y visualización global.

**[TICKET] Listado/descarga de nóminas**
- Descripción: Tabla de documentos vinculados al usuario, con botón de descarga.

---

## 4. CRM (Clientes)

**[TICKET] Listado de clientes y contactos**
- Descripción: Tabla con búsqueda, filtro y acceso a detalle.

**[TICKET] Detalle de cliente/contacto**
- Descripción: Tarjeta con todos los datos + actividades, oportunidades asociadas, historial.

**[TICKET] Formulario alta/edición de cliente/contacto**

**[TICKET] Oportunidades comerciales**
- Descripción: Tablero Kanban de oportunidades, con etapas, drag & drop y registro de actividades.

---

## 5. BPM

**[TICKET] Listado de procesos**
- Descripción: Tabla de procesos, botón ver/crear/duplicar proceso.

**[TICKET] Detalle de proceso**
- Descripción: Resumen (por fases), estado, historial, responsables.

**[TICKET] Editor/alta proceso**
- Descripción: Prototipo visual editable (aunque sea wireframe).

**[TICKET] Seguimiento/aprobación de instancias**
- Descripción: Tabla de instancias, con acciones rápidas por estado.

---

## 6. ERP

**[TICKET] Listado de facturas**
- Descripción: Tabla de facturas emitidas/recibidas, filtro por estado, fechas.

**[TICKET] Detalle de factura**
- Descripción: Todos los campos, relación con cliente/producto.

**[TICKET] Alta/edición de factura**

**[TICKET] Listado y gestión de productos**
- Descripción: Tabla de productos (nombre, SKU, stock), alta/editar productos.

---

## 7. ALM (Proyectos)

**[TICKET] Listado de proyectos**
- Descripción: Tabla, filtro, estado y acceso a tareas asociadas.

**[TICKET] Detalle de proyecto**

**[TICKET] Alta/edición de proyecto**

**[TICKET] Gestión de tareas**
- Descripción: Tabla/Listado, asignación, detalle, marcar como terminada.

---

## 8. Soporte (Tickets)

**[TICKET] Listado de tickets**
- Descripción: Tabla, filtros por prioridad/estado, acceso a detalle.

**[TICKET] Detalle de ticket y conversación**
- Descripción: Historial, mensajes con comentarios y adjuntos.

**[TICKET] Alta/edición de ticket**

---

## 9. BI (Informes)

**[TICKET] Dashboard BI**
- Descripción: Vista con tarjetas claves (KPIs), gráficas básicas.

**[TICKET] Listado de informes**
- Descripción: Tabla de informes generados, acceso a detalle.

**[TICKET] Detalle de informe**
- Descripción: Gráficas, filtros dinámicos, exportación.

---

## 10. Orquestación y validación

**[TICKET] Página de Login**
- Descripción: Login visual, validaciones mock y protección de rutas privadas.

**[TICKET] Perfil de usuario**
- Descripción: Resumen editable de datos personales, preferencias.

**[TICKET] Página de error 404**

---

### Sugerencias:
- Añade etiquetas por módulo o tipo: `core`, `rrhh`, `crm`...
- Subdivide tickets grandes en tareas menores si el scope es amplio.
- Usa checklist en cada ticket para subtareas.
- Revisa la documentación y mockups al crear cada tarjeta.

---

Ejemplo con código y comentarios
Supongamos Listado y Edición de usuarios (Core):

```
// Ejemplo usando React y axios

// 1. Listado de usuarios
useEffect(() => {
  axios
    .get('/api/users', { params: { page:1, perPage:10 } })
    .then(resp => setUserList(resp.data.data))
    .catch(err => showToast("Error al cargar usuarios", "error"));
}, []);

// 2. Detalle de usuario
const fetchUser = (id) => {
  axios.get(`/api/users/${id}`).then(resp => setUser(resp.data.data));
}

// 3. Edición
const handleSubmit = (formData) => {
  axios.patch(`/api/users/${userId}`, formData)
    .then(() => {
        showToast("Usuario editado correctamente", "success");
        navigate(`/users/${userId}`);
        // Opcional: context global update
    })
    .catch(err => showToast("Error al editar", "error"));
};
```
## 11. Prototipado en Figma

A continuación se muestra la paleta de colores provisional para el frontend de la web así como imágenes del prototipado de las principales vistas de la web.

---

### 11.1. Pantallas

#### 1. Pantalla de Login

![login de la web](/frontend/images/Login.png)

---

#### 2. Pantalla de recuperar contraseña

![recuperar contraseña](/frontend/images/RecuperarContrasenia.png)

---

#### 3. Pantalla de registro de nuevo usuario

![registro](/frontend/images/RegistrarNuevoUsuario.png)

---

#### 4. Web de inicio

![web de inicio](/frontend/images/WebInicio.png)

---

### 11.2. Gif de navegación

![recorrido](/frontend/images/recorrido1.gif)



