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

## 2. Diagrama de Navegación General

Ya incluido en el documento anterior ([ver aquí](#2-diagrama-de-flujo-general-de-navegacion)).

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
- **Función:** Mostrar información individual y acceso rápido a edición.
- **Contenido:**  
  - Foto/avatar, datos completos, rol, empresa
  - Acciones: Editar, Desactivar/Eliminar
  - Historial de accesos o acciones recientes
  - Password reset (si el usuario es admin)

#### 3. Formulario de alta/edición de usuario
- **Función:** Crear o editar usuarios con validaciones.
- **Contenido:**  
  - Inputs: nombre, apellidos, correo, empresa (dropdown), rol, estado, contraseña
  - Validaciones: campos obligatorios, unicidad de email, fuerza de contraseña
  - Botones: Guardar, Cancelar
  - Avisos de éxito/error en operaciones

#### 4. Listado/gestión de empresas
- **Función:** Visualización y gestión de empresas clientes.
- **Contenido:**  
  - Tabla: nombre legal, CIF, contacto principal, número de empleados
  - Acciones: Ver detalle de empresa, Editar, Eliminar, Crear nueva
  - Filtro/búsqueda por nombre

#### 5. Gestión de roles
- **Función:** Definición de roles de acceso y sus permisos.
- **Contenido:**  
  - Tabla o card: nombre de rol, descripción, módulos permitidos
  - Acciones: crear nuevo rol, editar permisos de rol, eliminar rol

#### **Resultado esperado:**
- Acceso centralizado al core de usuarios/empresas.
- Flujos claros y seguros para administrar acceso y permisos.
---

### B. RRHH (Recursos Humanos)

#### 1. Listado de empleados
- **Función:** Visualizar todo el personal de una empresa.
- **Contenido:**  
  - Tabla: nombre, puesto, estado, departamento, fecha de incorporación
  - Fotos/avatars
  - Acciones: ver detalle, filtrar/buscar, alta nuevo empleado

#### 2. Detalle de empleado
- **Función:** Brindar una “ficha” completa del empleado.
- **Contenido:**  
  - Foto, datos personales y laborales, historial de puestos, supervisor, contacto
  - Últimas evaluaciones, historial de ausencias, archivos/documentos asociados
  - Acciones: editar empleado, baja, generar documento/certificado laboral

#### 3. Alta/edición de empleado
- **Función:** Alta y actualización de empleados, con validaciones de empresa/duplicados.
- **Contenido:**  
  - Formulario: nombre, apellidos, fecha nacimiento, email, puesto, supervisor, salario, tipo contrato, fecha inicio/fin
  - Selección de documentos adjuntos (CV, etc)
  - Botones: Guardar, Cancelar

#### 4. Gestión de vacaciones/ausencias
- **Función:** Solicitar, aprobar y revisar ausencias.
- **Contenido:**  
  - Calendario de ausencias (individual/global)
  - Solicitudes nuevas, aprobar/denegar solucitudes (según rol)
  - Estado de ausencias (pendiente, aprobada, rechazada), motivos
  - Límites y advertencias de días disponibles

#### 5. Listado/descarga de nóminas y contratos
- **Función:** Facilitar al empleado y RRHH el acceso a su historial documental.
- **Contenido:**  
  - Tabla/listado: nombre documento, fecha, estado (firmado/pendiente)
  - Descargas y subida de documentos

#### **Resultado esperado:**
- Un módulo robusto para el seguimiento del talento y la gestión documental, útil tanto para RRHH como para empleados.
---

### C. CRM (Gestión de Clientes)

#### 1. Listado de clientes/contactos
- **Función:** Consulta y exploración de la base de clientes.
- **Contenido:**  
  - Tabla: nombre cliente, NIF, responsable, estatus, sector, fecha alta
  - Filtros altamente configurables, por sector/responsable/conversiones

#### 2. Detalle de cliente/contacto
- **Función:** Ver toda la información y el historial operativo del cliente.
- **Contenido:**  
  - Datos generales, dirección, responsable, contactos asociados
  - Resumen de oportunidades activas/históricas, ventas
  - Historial de llamadas, emails, reuniones, comentarios de equipo
  - Acceso rápido a editar o agregar interacción

#### 3. Alta/edición de cliente/contacto
- **Función:** Añadir o modificar una cuenta/contacto.
- **Contenido:**  
  - Datos reglamentarios, empresa asociada, responsable, canales de contacto
  - Estado (potencial, activo, inactivo)
  - Campos personalizados (observaciones, notas)

#### 4. Oportunidades/interacciones
- **Función:** Seguir el pipeline comercial y concertar/sumar actividades.
- **Contenido:**  
  - Embudo de oportunidades (Kanban), etapa/valor/probabilidad
  - Registro rápido de follow-up, email/call, próximas acciones

#### **Resultado esperado:**
- Control comercial ágil, pipeline y trazabilidad de negocio optimizados.

---

### D. BPM (Gestión de Procesos)

#### 1. Listado de procesos
- **Función:** Ver procesos modelados internos de la empresa.
- **Contenido:**  
  - Tabla: nombre, tipo, estado, responsable, fecha de inicio
  - Acciones: ver detalle, modelo nuevo, duplicar

#### 2. Detalle de proceso
- **Función:** Seguir el estado de una instancia o proceso.
- **Contenido:**  
  - Diagrama visual (fases/estados)
  - Estado actual, responsables de cada fase, historial de cambios
  - Acciones según permiso (aprobar, avanzar, pausar, cancelar)

#### 3. Alta/edición/modelado de procesos
- **Función:** Crear/ajustar un flujo empresarial.
- **Contenido:**  
  - Formulario con campos de nombre, pasos, responsables
  - Editor visual sencillo (prototipo/maqueta)
  - Validaciones de consistencia

#### 4. Seguimiento/aprobación
- **Función:** Revisar/aprobar/concluir procesos.
- **Contenido:**  
  - Panel de instancias pendientes/aprobadas
  - Acciones rápidas
  - Filtros por estado

#### **Resultado esperado:**
- Visibilidad clara sobre los procesos empresariales y su ciclo de vida.

---

### E. ERP (Facturación, Compras, Inventario)

#### 1. Listado de facturas
- **Función:** Controlar el flujo de facturas (emitidas/recibidas).
- **Contenido:**  
  - Tabla: número, cliente, fecha, importe, estado (pagada/pendiente/vencida)
  - Acciones: ver detalle, crear, editar, borrar, descargar PDF

#### 2. Detalle de factura
- **Función:** Información completa y links a clientes/productos asociados.
- **Contenido:**  
  - Datos fiscales, facturador, descripción servicios/productos
  - Estado de cobro/pago, notas

#### 3. Alta/edición de factura
- **Función:** Crear/modificar factura.
- **Contenido:**  
  - Campos: cliente, concepto, líneas de producto/servicio, precio, impuestos
  - Adjuntos (contratos, justificantes)
  - Validación en tiempo real de datos

#### 4. Listado y detalle de productos
- **Función:** Gestión sencilla del inventario.
- **Contenido:**  
  - Tabla: nombre, SKU, stock, precio/unidad, proveedor
  - Acciones: ver, añadir, editar producto

#### **Resultado esperado:**
- Flujo económico e inventario perfectamente documentados y consultables.

---

### F. ALM (Proyectos y Tareas)

#### 1. Listado de proyectos
- **Función:** Exploración y búsqueda de los proyectos en activo o históricos.
- **Contenido:**  
  - Tabla: nombre, responsable, fecha inicio/fin, estado, % de avance

#### 2. Detalle de proyecto
- **Función:** Seguimiento y control del proyecto.
- **Contenido:**  
  - Cronograma, milestones, tareas asociadas, equipo involucrado, files
  - Acciones: archivar, pausar, editar, añadir tarea

#### 3. Alta/edición de proyecto
- **Función:** Nueva entrada proyecto o ajustes sobre existentes.
- **Contenido:**
  - Formulario con campos: nombre, descripción, fechas, participantes, etc.

#### 4. Listado y detalle de tareas
- **Función:** Asignación, estado y edición de tareas dentro de proyectos.
- **Contenido:**  
  - Tabla: título, responsable, estado, prioritario, fecha entrega
  - Detalle: descripción, subtareas, comentarios, archivos adjuntos
  - Acciones: marcar completada, editar, reasignar

#### **Resultado esperado:**
- Seguimiento ágil y control eficiente de proyectos y tareas.

---

### G. Soporte / Tickets

#### 1. Listado de tickets
- **Función:** Consulta + filtro rápido de todos los tickets (internos/externos).
- **Contenido:**  
  - Tabla: número, asunto, estado, prioridad, responsable, fecha creación

#### 2. Detalle de ticket
- **Función:** Ver el historial completo y toma de acción rápida.
- **Contenido:**  
  - Mensajes/actividad, estado, archivos adjuntos
  - Acciones: responder, cerrar, reabrir, reasignar
  - Línea temporal (timeline) de actualizaciones

#### 3. Alta/edición de ticket
- **Función:** Reportar un nuevo problema o actualizar uno existente.
- **Contenido:**  
  - Formulario: asunto, descripción, prioridad, adjunto opcional
  - Validación rápida, feedback inmediato

#### 4. Conversación/mensajería
- **Función:** Comunicación con el soporte/usuario.
- **Contenido:**  
  - Mensajería tipo chat o comentarios
  - Marcadores (resuelto, pendiente, escalado)

#### **Resultado esperado:**
- Registro claro y trazabilidad total del soporte recibido y gestionado.

---

### H. BI (Business Intelligence)

#### 1. Dashboard principal
- **Función:** Vista de alto nivel de los KPIs clave y datos agregados de la empresa.
- **Contenido:**  
  - Tarjetas de resumen (total ventas, empleados, tickets, proyectos activos, etc.)
  - Gráficas (tendencias, ranking, comparativas)

#### 2. Listado de informes
- **Función:** Acceso a reportes generados o personalizables.
- **Contenido:**  
  - Tabla/list: nombre, módulo fuente, fecha creación, filtros guardados

#### 3. Detalle de informe
- **Función:** Visualización y exportación de datos analíticos.
- **Contenido:**  
  - Gráficos y tablas, filtros dinámicos, selección de fechas
  - Botones para exportar (PDF/Excel)

#### **Resultado esperado:**
- Soporte a la toma de decisiones estratégica y operación basada en datos.

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
