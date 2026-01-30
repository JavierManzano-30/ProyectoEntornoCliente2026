# Módulo CORE - Frontend

Módulo de gestión central del sistema BizHub que incluye autenticación, dashboard, gestión de usuarios, empresas y roles.

## 📁 Estructura

```
core/
├── components/          # Componentes reutilizables específicos del módulo
│   ├── users/          # Componentes relacionados con usuarios
│   │   ├── UserCard.jsx
│   │   └── UserCard.css
│   ├── companies/      # Componentes relacionados con empresas
│   │   ├── CompanyCard.jsx
│   │   └── CompanyCard.css
│   └── roles/          # Componentes relacionados con roles
│       ├── RoleCard.jsx
│       └── RoleCard.css
├── pages/              # Páginas del módulo
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── UserList.jsx
│   ├── UserDetail.jsx
│   ├── UserForm.jsx
│   ├── CompanyList.jsx
│   ├── CompanyDetail.jsx
│   ├── CompanyForm.jsx
│   └── RoleManagement.jsx
├── hooks/              # Custom hooks para lógica del módulo
│   ├── useUsers.js
│   ├── useUser.js
│   ├── useCompanies.js
│   ├── useCompany.js
│   ├── useRoles.js
│   └── useDashboard.js
├── services/           # Servicios para comunicación con API
│   └── coreService.js
├── utils/              # Funciones auxiliares
│   ├── userHelpers.js
│   ├── companyHelpers.js
│   └── roleHelpers.js
├── constants/          # Constantes y configuraciones
│   ├── userRoles.js
│   ├── userStatus.js
│   └── permissions.js
├── data/               # Mock data para desarrollo
│   └── mockData.js
└── index.js            # Punto de entrada del módulo
```

## 🎯 Funcionalidades Implementadas

### Autenticación
- ✅ Login con email/contraseña
- ✅ Gestión de sesión con JWT
- ✅ Credenciales demo para desarrollo

### Dashboard
- ✅ Métricas principales del sistema
- ✅ Feed de actividad reciente
- ✅ Acciones rápidas

### Gestión de Usuarios
- ✅ Lista de usuarios con filtros y búsqueda
- ✅ Detalle completo de usuario
- ✅ Formulario de alta/edición
- ✅ Estados y roles de usuario
- ✅ Gestión de permisos

### Gestión de Empresas
- ✅ Lista de empresas (vista grid/list)
- ✅ Detalle completo de empresa
- ✅ Formulario de alta/edición
- ✅ Métricas y estadísticas

### Gestión de Roles
- ✅ Visualización de roles del sistema
- ✅ Permisos y asignaciones
- ✅ Estadísticas de uso

## 🚀 Configuración

### 1. Modo Mock (Desarrollo sin Backend)

Por defecto, el módulo funciona con datos de prueba:

```javascript
// En src/modules/core/services/coreService.js
const USE_MOCK_DATA = true; // Cambiar a false para usar API real
```

### 2. Datos de Prueba

**Login:**
- Email: `admin@bizhub.com`
- Password: `admin123`

**Usuarios de Prueba:**
- Ana García (Administrador)
- Carlos Ruiz (Manager)
- María López (Empleado)

**Empresas de Prueba:**
- Tech Solutions SA
- Digital Commerce SL
- Innovate Corp

### 3. Configuración de Rutas

Añadir al archivo principal de rutas (App.jsx):

```javascript
import {
  Login,
  Dashboard,
  UserList,
  UserDetail,
  UserForm,
  CompanyList,
  CompanyDetail,
  CompanyForm,
  RoleManagement
} from './modules/core';

// Rutas públicas
<Route path="/login" element={<Login />} />

// Rutas protegidas
<Route path="/core" element={<Dashboard />} />
<Route path="/core/usuarios" element={<UserList />} />
<Route path="/core/usuarios/:id" element={<UserDetail />} />
<Route path="/core/usuarios/:id/editar" element={<UserForm />} />
<Route path="/core/usuarios/nuevo" element={<UserForm />} />
<Route path="/core/empresas" element={<CompanyList />} />
<Route path="/core/empresas/:id" element={<CompanyDetail />} />
<Route path="/core/empresas/:id/editar" element={<CompanyForm />} />
<Route path="/core/empresas/nuevo" element={<CompanyForm />} />
<Route path="/core/roles" element={<RoleManagement />} />
```

## 📋 API Endpoints

### Autenticación
```
POST   /api/core/login      - Iniciar sesión
POST   /api/core/logout     - Cerrar sesión
GET    /api/core/me         - Obtener usuario actual
```

### Usuarios
```
GET    /api/core/users              - Listar usuarios
GET    /api/core/users/:id          - Obtener usuario
POST   /api/core/users              - Crear usuario
PUT    /api/core/users/:id          - Actualizar usuario
DELETE /api/core/users/:id          - Eliminar usuario
```

### Empresas
```
GET    /api/core/companies          - Listar empresas
GET    /api/core/companies/:id      - Obtener empresa
POST   /api/core/companies          - Crear empresa
PUT    /api/core/companies/:id      - Actualizar empresa
DELETE /api/core/companies/:id      - Eliminar empresa
```

### Roles
```
GET    /api/core/roles              - Listar roles
GET    /api/core/roles/:id          - Obtener rol
POST   /api/core/roles              - Crear rol
PUT    /api/core/roles/:id          - Actualizar rol
DELETE /api/core/roles/:id          - Eliminar rol
```

### Dashboard
```
GET    /api/core/dashboard/stats    - Estadísticas del dashboard
```

## 🎨 Componentes Comunes Utilizados

- `PageHeader` - Encabezado de página
- `Card` - Contenedor estilizado
- `Button` - Botones con variantes
- `Badge` - Etiquetas de estado
- `LoadingSpinner` - Indicador de carga
- `ErrorMessage` - Mensajes de error
- `MainLayout` - Layout principal
- `Navbar` - Barra de navegación

## 🔧 Utilidades

### userHelpers.js
- `getFullName()` - Nombre completo del usuario
- `getInitials()` - Iniciales para avatar
- `formatLastAccess()` - Formato de último acceso
- `filterUsers()` - Filtrar usuarios
- `sortUsers()` - Ordenar usuarios
- `isValidEmail()` - Validación de email

### companyHelpers.js
- `formatEmployeeCount()` - Formato de número de empleados
- `getCompanyInitials()` - Iniciales de empresa
- `formatAddress()` - Formato de dirección completa
- `filterCompanies()` - Filtrar empresas
- `sortCompanies()` - Ordenar empresas
- `isValidCIF()` - Validación de CIF

### roleHelpers.js
- `getPermissionLabel()` - Etiqueta de permiso
- `groupPermissionsByCategory()` - Agrupar permisos
- `hasPermission()` - Verificar permiso
- `filterRoles()` - Filtrar roles
- `sortRoles()` - Ordenar roles

## 🎯 Próximos Pasos

1. **Integración con Backend**
   - Cambiar `USE_MOCK_DATA` a `false`
   - Configurar endpoints reales en `api.js`
   - Implementar manejo de errores de API

2. **Autenticación Avanzada**
   - Recuperación de contraseña
   - Verificación de email
   - Autenticación de dos factores

3. **Permisos Detallados**
   - Implementar verificación de permisos en componentes
   - Crear HOC para rutas protegidas
   - Gestión granular de accesos

4. **Mejoras UI/UX**
   - Animaciones de transición
   - Feedback visual mejorado
   - Modo oscuro

## 📝 Convenciones de Código

- **Nombres de archivos**: PascalCase para componentes, camelCase para utilidades
- **Estilos**: CSS Modules con clases kebab-case
- **Hooks**: Prefijo `use` (useUsers, useUser, etc.)
- **Servicios**: Sufijo `Service` (coreService.js)
- **Constantes**: UPPER_SNAKE_CASE

## 🐛 Debugging

Para activar logs detallados en servicios:

```javascript
// En coreService.js
const DEBUG = true; // Mostrar logs en consola
```

## 📄 Licencia

Proyecto privado - BizHub 2024
