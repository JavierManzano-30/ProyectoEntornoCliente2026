export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYEE: 'empleado',
};

export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Administrador',
  [USER_ROLES.MANAGER]: 'Manager',
  [USER_ROLES.EMPLOYEE]: 'Empleado',
};

export const USER_ROLE_COLORS = {
  [USER_ROLES.ADMIN]: 'red',
  [USER_ROLES.MANAGER]: 'blue',
  [USER_ROLES.EMPLOYEE]: 'gray',
};

export const USER_ROLE_DESCRIPTIONS = {
  [USER_ROLES.ADMIN]: 'Acceso total al sistema',
  [USER_ROLES.MANAGER]: 'Gestión de equipos y recursos',
  [USER_ROLES.EMPLOYEE]: 'Acceso básico',
};
