export const PERMISSIONS = {
  // Usuarios
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_EDIT: 'users.edit',
  USERS_DELETE: 'users.delete',
  
  // Empresas
  COMPANIES_VIEW: 'companies.view',
  COMPANIES_CREATE: 'companies.create',
  COMPANIES_EDIT: 'companies.edit',
  COMPANIES_DELETE: 'companies.delete',
  
  // Roles
  ROLES_VIEW: 'roles.view',
  ROLES_MANAGE: 'roles.manage',
  
  // Sistema
  SYSTEM_CONFIG: 'system.config',
  SYSTEM_LOGS: 'system.logs',
};

export const ROLE_PERMISSIONS = {
  admin: Object.values(PERMISSIONS),
  manager: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_EDIT,
    PERMISSIONS.COMPANIES_VIEW,
    PERMISSIONS.ROLES_VIEW,
  ],
  empleado: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.COMPANIES_VIEW,
  ],
};
