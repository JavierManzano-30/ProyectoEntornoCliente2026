# Documentación Técnica - Módulo CORE Frontend

---

## 🎯 Visión General

### Propósito del Módulo

El módulo **CORE** del frontend es el núcleo de la plataforma, responsable de la gestión de identidad, contexto multiempresa y seguridad. Proporciona la base para que todos los demás módulos funcionen de forma integrada, segura y coherente.

Este módulo actúa como **punto central de identidad y permisos**, permitiendo a los usuarios autenticarse, seleccionar empresa, gestionar usuarios, roles y permisos, y garantizando que cada acción en la plataforma esté correctamente autorizada y trazada.

### Objetivos Principales

1. **Gestión de Identidad y Acceso**
   - Login y logout de usuarios
   - Selección de empresa activa (multiempresa)
   - Recuperación y cambio de contraseña
   - Autenticación segura y persistente

2. **Gestión de Usuarios**
   - Alta, consulta, edición y baja de usuarios
   - Asignación de roles y empresas
   - Visualización de usuarios y sus permisos
   - Gestión de estado de usuario (activo/inactivo, bloqueo, restablecimiento)

3. **Gestión de Roles y Permisos**
   - Creación y edición de roles
   - Asignación de permisos a roles
   - Visualización de permisos por usuario y rol
   - Gestión granular de acciones permitidas

4. **Contexto Global y Seguridad**
   - Proveer contexto de usuario y empresa a todos los módulos
   - Validar permisos antes de mostrar acciones o rutas
   - Integración con el sistema de rutas protegidas y layouts

5. **Datos Comunes y Utilidades**
   - Exponer datos de empresa, usuario, timestamps comunes
   - Proveer helpers para validación de permisos y roles
   - Sincronización de contexto global (empresa, usuario, rol activo)

6. **Auditoría y Trazabilidad**
   - Registro de acciones críticas (login, cambios de rol, permisos, etc.)
   - Visualización de logs de actividad de usuarios

---

## 🏗️ Arquitectura del Módulo

### Principios de Diseño

El módulo CORE Frontend está diseñado siguiendo estos principios arquitectónicos:

#### 1. **Separación de Responsabilidades**

```
┌─────────────────────────────────────────┐
│          CAPA DE PRESENTACIÓN           │
│  (Páginas y Componentes Visuales)       │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         CAPA DE LÓGICA DE NEGOCIO       │
│    (Custom Hooks y Context)             │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         CAPA DE SERVICIOS               │
│    (Comunicación con API CORE)          │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│           BACKEND API                   │
│      (Endpoints RESTful CORE)           │
└─────────────────────────────────────────┘
```

#### 2. **Composición de Componentes**

- **Componentes Atómicos**: Inputs, botones, badges, selectores, tooltips
- **Componentes Moleculares**: Formularios de login, tablas de usuarios, selectores de empresa, chips de permisos
- **Componentes Organismos**: Layouts protegidos, paneles de gestión, modales de confirmación
- **Páginas**: Login, gestión de usuarios, roles, permisos, selector de empresa, logs de auditoría

#### 3. **Gestión de Estado Predictible**

- **Estado Local**: `useState` para formularios y componentes
- **Estado Compartido**: Context API para usuario, empresa y permisos
- **Estado de Servidor**: Custom hooks (`useAuth`, `useUsers`, `useRoles`, etc.) con caché y refetch

#### 4. **Code Splitting y Lazy Loading**

```javascript
// Ejemplo de carga bajo demanda
const UserManagement = lazy(() => import('./pages/UserManagement'));
const RoleManagement = lazy(() => import('./pages/RoleManagement'));
const AuditLog = lazy(() => import('./pages/AuditLog'));
```

---

## 🔗 Integración con Backend

El frontend CORE está **completamente alineado** con la API y modelo de datos del backend CORE:

#### Entidades Gestionadas

| Entidad Backend | Representación Frontend | Pantallas Asociadas |
|-----------------|------------------------|---------------------|
| Empresa         | Company Object         | CompanySelector, CompanyForm |
| Usuario         | User Object            | UserManagement, UserForm |
| Rol             | Role Object            | RoleManagement, RoleForm |
| Permiso         | Permission Object      | PermissionList, RoleForm |
| Log Auditoría   | AuditLog Object        | AuditLog            |

#### Mapeo de Endpoints (Ejemplo)

| Operación                  | Método | Endpoint aproximado              | Pantalla Frontend        |
|----------------------------|--------|----------------------------------|--------------------------|
| Login                      | POST   | `/api/v1/core/auth/login`        | LoginPage                |
| Logout                     | POST   | `/api/v1/core/auth/logout`       | (acción global)          |
| Listar empresas            | GET    | `/api/v1/core/companies`         | CompanySelector          |
| Listar usuarios            | GET    | `/api/v1/core/users`             | UserManagement           |
| Crear usuario              | POST   | `/api/v1/core/users`             | UserForm                 |
| Editar usuario             | PATCH  | `/api/v1/core/users/:id`         | UserForm                 |
| Bloquear usuario           | PATCH  | `/api/v1/core/users/:id/block`   | UserManagement           |
| Restablecer contraseña     | POST   | `/api/v1/core/users/:id/reset-password` | UserManagement   |
| Listar roles               | GET    | `/api/v1/core/roles`             | RoleManagement           |
| Crear rol                  | POST   | `/api/v1/core/roles`             | RoleForm                 |
| Asignar permisos a rol     | PATCH  | `/api/v1/core/roles/:id/permissions` | RoleForm             |
| Listar permisos            | GET    | `/api/v1/core/permissions`       | PermissionList           |
| Listar logs de auditoría   | GET    | `/api/v1/core/audit-logs`        | AuditLog                 |

---


## 🖥️ Pantallas y Funcionalidades

### 1. Login (`LoginPage.jsx`)

**Propósito**: Permitir el acceso seguro a la plataforma.

**Estructura y Flujos**:
- Formulario con campos: Email (input), Contraseña (input tipo password), botón "Acceder".
- Enlace "¿Olvidaste tu contraseña?" que abre modal de recuperación.
- Checkbox "Recordar sesión" (opcional).
- Mensajes de error claros bajo cada campo y en la cabecera del formulario.

**Validaciones en Tiempo Real**:
- Email válido y obligatorio (formato y existencia).
- Contraseña obligatoria (mínimo 8 caracteres).
- Feedback inmediato en campos y en submit.

**Acciones**:
- Al enviar, muestra spinner de carga y deshabilita el botón.
- Si credenciales incorrectas, muestra error destacado.
- Si login correcto y multiempresa, redirige a selector de empresa.
- Si login correcto y una sola empresa, entra directo al layout principal.

**Permisos**: Público (no requiere sesión).

---

### 2. Selector de Empresa (`CompanySelector.jsx`)

**Propósito**: Seleccionar el contexto empresarial activo para el usuario.

**Estructura y Flujos**:
- Lista de empresas disponibles (cards o tabla con nombre, CIF, logo, estado).
- Botón "Seleccionar" en cada empresa.
- Visualización de empresa activa actual.
- Si solo hay una empresa, selección automática.

**Validaciones y Comportamiento**:
- Solo empresas a las que el usuario tiene acceso.
- Feedback si no hay empresas disponibles (mensaje y contacto soporte).
- Cambio de empresa activa desde menú de usuario en cualquier momento.

**Acciones**:
- Al seleccionar empresa, refresca el contexto global y recarga menús y permisos.
- Muestra toast de confirmación de cambio de empresa.

**Permisos**: Requiere sesión.

---

### 3. Gestión de Usuarios (`UserManagement.jsx`)

**Propósito**: Administrar usuarios de la plataforma y sus permisos.

**Estructura de la Pantalla**:
- Tabla principal con columnas: Nombre, Email, Empresa, Roles, Estado, Último acceso, Acciones.
- Filtros laterales: Empresa, Estado (activo/inactivo/bloqueado), Rol, búsqueda por nombre/email.
- Botón "Nuevo Usuario" (abre modal o navega a formulario).

**Acciones Rápidas por Fila**:
- Ver detalle (icono ojo): abre modal o navega a UserForm.
- Editar usuario (icono lápiz).
- Bloquear/desbloquear usuario (icono candado).
- Restablecer contraseña (icono llave).
- Eliminar usuario (icono papelera, con confirmación).

**Pestañas/Secciones en Detalle de Usuario**:
1. **Datos Generales**: Nombre, email, empresa, estado, fecha de alta, último acceso.
2. **Roles y Permisos**: Lista de roles asignados, permisos efectivos (con chips/badges), historial de cambios de rol.
3. **Historial de Acciones**: Últimos accesos, bloqueos, cambios de contraseña, auditoría.

**Validaciones en Tiempo Real**:
- Email único y formato válido.
- Roles y empresa obligatorios.
- Confirmación antes de eliminar/bloquear.

**Comportamiento**:
- Feedback visual de éxito/error en todas las acciones.
- Redirección automática tras crear/editar usuario.
- Exportación de usuarios a CSV/Excel.

**Permisos Requeridos**:
- `core.users.view` - Ver usuarios
- `core.users.create` - Crear usuarios
- `core.users.edit` - Editar usuarios
- `core.users.delete` - Eliminar usuarios
- `core.users.block` - Bloquear usuarios

---

### 4. Gestión de Roles y Permisos (`RoleManagement.jsx`, `PermissionList.jsx`)

**Propósito**: Definir y administrar los roles y permisos de la plataforma.

**Estructura de la Pantalla**:
- Tabla de roles con columnas: Nombre, Descripción, Permisos asignados, Nº de usuarios, Acciones.
- Botón "Nuevo Rol" (abre modal o formulario).
- Filtros por tipo de permiso, búsqueda por nombre.

**Acciones por Rol**:
- Editar rol (icono lápiz): abre formulario con pestañas.
- Eliminar rol (icono papelera, con confirmación).
- Asignar permisos (UI de checkboxes o chips agrupados por dominio funcional).

**Pestañas en Formulario de Rol**:
1. **Datos Básicos**: Nombre, descripción.
2. **Permisos**: Lista de permisos disponibles, checkboxes para asignar/quitar.
3. **Usuarios Asignados**: Listado de usuarios con ese rol.

**Validaciones**:
- Nombre de rol único y obligatorio.
- Al menos un permiso por rol.

**Comportamiento**:
- Feedback visual de éxito/error en todas las acciones.
- Redirección automática tras crear/editar rol.

**Permisos Requeridos**:
- `core.roles.view` - Ver roles
- `core.roles.create` - Crear roles
- `core.roles.edit` - Editar roles
- `core.roles.delete` - Eliminar roles
- `core.permissions.view` - Ver permisos

---

### 5. Layout y Seguridad (`ProtectedLayout.jsx`)

**Propósito**: Proteger el acceso a las rutas y páginas de la plataforma.

**Estructura y Comportamiento**:
- Layout global que valida autenticación y permisos antes de renderizar hijos.
- Redirección automática si no hay sesión o permisos insuficientes.
- Visualización de nombre de usuario, empresa y rol activo en header.
- Menú lateral dinámico según permisos y empresa activa.
- Breadcrumbs y rutas protegidas.

**Acciones**:
- Logout desde menú de usuario.
- Cambio de empresa desde header.

**Permisos**: Requiere sesión.

---

### 6. Logs de Auditoría (`AuditLog.jsx`)

**Propósito**: Visualizar el historial de acciones críticas realizadas en la plataforma.

**Estructura de la Pantalla**:
- Tabla cronológica de eventos: Fecha/hora, Usuario, Acción, Entidad afectada, Detalle.
- Filtros por usuario, tipo de acción, fecha.
- Búsqueda por palabra clave.
- Botón de exportación de logs.

**Detalle de Evento**:
- Modal con información ampliada: datos previos y posteriores, IP, navegador, etc.

**Permisos Requeridos**:
- `core.audit.view` - Ver logs de auditoría

---

## 🎨 Guía de Estilos y UX del Módulo

- Formularios claros y accesibles, con validaciones en tiempo real
- Mensajes de error y validación visibles y comprensibles
- Layouts protegidos y navegación segura
- Diseño responsive y preparado para i18n
- Uso de badges y chips para estados de usuario, roles y permisos
- Modales de confirmación para acciones críticas

---

## 🔐 Permisos y Seguridad

- Integración total con el sistema de autenticación y autorización
- Permisos a nivel de módulo y acción
- Seguridad en rutas y componentes (solo accesibles si el usuario tiene permiso)
- Control de sesión y expiración automática
- Logs de acceso y cambios críticos

---

## 🧪 Testing y Calidad

- Tests unitarios de componentes críticos (login, gestión de usuarios, roles)
- Tests de integración para flujos clave (login, cambio de empresa, asignación de roles, logs)
- Validación de contratos con la API CORE (tipado, esquemas, DTOs)
- Pruebas de seguridad en formularios y rutas protegidas