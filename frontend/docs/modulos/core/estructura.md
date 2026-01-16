
# Módulo CORE Frontend - Estructura y Código (React)

## 📁 Estructura de Carpetas Completa

```
src/
└── modules/
    └── core/
        ├── components/                      # Componentes específicos del módulo
        │   ├── auth/
        │   │   ├── LoginForm.jsx            # Formulario de login con validaciones y feedback
        │   │   ├── PasswordResetForm.jsx    # Formulario de recuperación de contraseña
        │   │   └── CompanySelector.jsx      # Selector de empresa con cards y búsqueda
        │   ├── users/
        │   │   ├── UserTable.jsx            # Tabla de usuarios con acciones rápidas
        │   │   ├── UserForm.jsx             # Formulario de alta/edición de usuario (pestañas)
        │   │   ├── UserStatusBadge.jsx      # Badge de estado (activo, bloqueado)
        │   │   └── UserDetailTabs.jsx       # Tabs: Datos, Roles, Historial
        │   ├── roles/
        │   │   ├── RoleTable.jsx            # Tabla de roles
        │   │   ├── RoleForm.jsx             # Formulario de rol (pestañas: datos, permisos, usuarios)
        │   │   └── RoleBadge.jsx            # Badge de tipo de rol
        │   ├── permissions/
        │   │   ├── PermissionList.jsx       # Listado de permisos agrupados
        │   │   └── PermissionBadge.jsx      # Chip/badge de permiso
        │   ├── audit/
        │   │   └── AuditLogTable.jsx        # Tabla de logs de auditoría
        │   └── common/
        │       ├── ProtectedLayout.jsx      # Layout protegido por permisos
        │       ├── CoreHeader.jsx           # Header global con usuario, empresa, logout
        │       └── ConfirmModal.jsx         # Modal de confirmación para acciones críticas
        │
        ├── pages/                           # Páginas principales del módulo
        │   ├── LoginPage.jsx
        │   ├── CompanySelector.jsx
        │   ├── UserManagement.jsx
        │   ├── UserForm.jsx
        │   ├── UserDetail.jsx
        │   ├── RoleManagement.jsx
        │   ├── RoleForm.jsx
        │   ├── PermissionList.jsx
        │   └── AuditLog.jsx
        │
        ├── hooks/                           # Custom hooks del módulo
        │   ├── useAuth.js                   # Login, logout, sesión
        │   ├── useUsers.js                  # CRUD de usuarios, filtros
        │   ├── useUser.js                   # Detalle y acciones de usuario
        │   ├── useRoles.js                  # CRUD de roles
        │   ├── usePermissions.js            # Listado y consulta de permisos
        │   └── useCompany.js                # Contexto y cambio de empresa
        │
        ├── context/                         # Contexto específico del módulo
        │   ├── AuthContext.jsx
        │   ├── AuthProvider.jsx
        │   ├── CompanyContext.jsx
        │   └── CompanyProvider.jsx
        │
        ├── services/                        # Servicios de comunicación con API
        │   └── coreService.js               # Lógica de llamadas a endpoints CORE
        │
        ├── utils/                           # Utilidades específicas del módulo
        │   ├── authHelpers.js
        │   ├── permissionHelpers.js
        │   ├── companyHelpers.js
        │   └── validationSchemas.js         # Esquemas de validación (Yup, Zod)
        │
        ├── constants/                       # Constantes del módulo
        │   ├── roleTypes.js
        │   ├── permissionTypes.js
        │   ├── userStatuses.js
        │   └── auditActions.js
        │
        ├── styles/                          # Estilos específicos del módulo
        │   ├── core.module.css
        │   ├── users.module.css
        │   ├── roles.module.css
        │   ├── permissions.module.css
        │   └── audit.module.css
        │
        └── __tests__/                       # Tests del módulo
            ├── pages/
            │   ├── LoginPage.test.jsx
            │   ├── UserManagement.test.jsx
            │   ├── UserForm.test.jsx
            │   ├── RoleManagement.test.jsx
            │   └── AuditLog.test.jsx
            ├── components/
            │   ├── LoginForm.test.jsx
            │   ├── UserTable.test.jsx
            │   └── AuditLogTable.test.jsx
            ├── hooks/
            │   ├── useAuth.test.js
            │   ├── useUsers.test.js
            │   └── useRoles.test.js
            └── services/
                └── coreService.test.js
```

---

## 📄 Ejemplos de Código y Flujos

### 1. Página: Login

```jsx
// pages/LoginPage.jsx
import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import styles from '../styles/core.module.css';

const LoginPage = () => (
  <div className={styles.loginPageContainer}>
    <LoginForm />
  </div>
);

export default LoginPage;
```

**LoginForm.jsx**
```jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../utils/validationSchemas';
import { useAuth } from '../../hooks/useAuth';
import InputField from '@/components/common/InputField';
import Button from '@/components/common/Button';
import ErrorMessage from '@/components/common/ErrorMessage';

const LoginForm = () => {
  const { login, loading, error } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema)
  });

  const onSubmit = (data) => login(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputField label="Email" {...register('email')} error={errors.email?.message} />
      <InputField label="Contraseña" type="password" {...register('password')} error={errors.password?.message} />
      {error && <ErrorMessage message={error} />}
      <Button type="submit" loading={loading}>
        Acceder
      </Button>
    </form>
  );
};
export default LoginForm;
```

---

### 2. Página: Gestión de Usuarios

```jsx
// pages/UserManagement.jsx
import React from 'react';
import { useUsers } from '../hooks/useUsers';
import UserTable from '../components/users/UserTable';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import PageHeader from '@/components/common/PageHeader';
import styles from '../styles/users.module.css';

const UserManagement = () => {
  const {
    users,
    loading,
    error,
    refetch
  } = useUsers();

  const handleCreateUser = () => {
    // Navegación a formulario de alta de usuario
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className={styles.userManagementContainer}>
      <PageHeader
        title="Gestión de Usuarios"
        subtitle="Administra los usuarios de la plataforma"
        actions={
          <Button 
            variant="primary" 
            onClick={handleCreateUser}
            icon="plus"
          >
            Nuevo Usuario
          </Button>
        }
      />

      <UserTable users={users} />
    </div>
  );
};
export default UserManagement;
```

**UserForm.jsx**
```jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { userSchema } from '../../utils/validationSchemas';
import InputField from '@/components/common/InputField';
import SelectField from '@/components/common/SelectField';
import Button from '@/components/common/Button';
import Tabs from '@/components/common/Tabs';
import styles from '../styles/users.module.css';

const UserForm = ({ initialData, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData,
    resolver: yupResolver(userSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.userForm}>
      <Tabs tabs={["Datos Generales", "Roles y Permisos"]}>
        <div label="Datos Generales">
          <InputField label="Nombre" {...register('nombre')} error={errors.nombre?.message} />
          <InputField label="Email" {...register('email')} error={errors.email?.message} />
          <SelectField label="Empresa" {...register('empresaId')} options={/* ... */} error={errors.empresaId?.message} />
        </div>
        <div label="Roles y Permisos">
          <SelectField label="Roles" {...register('roles')} options={/* ... */} multiple error={errors.roles?.message} />
        </div>
      </Tabs>
      <Button type="submit">Guardar</Button>
    </form>
  );
};
export default UserForm;
```

---

### 3. Hook de Autenticación

```js
// hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => useContext(AuthContext);
```

---

### 4. Layout Protegido

```jsx
// components/common/ProtectedLayout.jsx
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const ProtectedLayout = ({ children, requiredPermission }) => {
  const { user, hasPermission } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (requiredPermission && !hasPermission(requiredPermission)) return <div>No tienes permiso</div>;
  return <>{children}</>;
};
export default ProtectedLayout;
```

---

### 5. Ejemplo de Servicio API

```js
// services/coreService.js
import axios from 'axios';

export const coreService = {
  login: (data) => axios.post('/api/v1/core/auth/login', data),
  getUsers: () => axios.get('/api/v1/core/users'),
  createUser: (data) => axios.post('/api/v1/core/users', data),
  // ...otros métodos
};
```
