/**
 * Obtiene el nombre amigable del permiso
 */
export const getPermissionLabel = (permission) => {
  const labels = {
    'users.view': 'Ver usuarios',
    'users.create': 'Crear usuarios',
    'users.edit': 'Editar usuarios',
    'users.delete': 'Eliminar usuarios',
    'companies.view': 'Ver empresas',
    'companies.create': 'Crear empresas',
    'companies.edit': 'Editar empresas',
    'companies.delete': 'Eliminar empresas',
    'roles.view': 'Ver roles',
    'roles.manage': 'Gestionar roles',
    'system.config': 'Configuración del sistema',
    'system.logs': 'Ver logs del sistema',
    'all': 'Todos los permisos',
  };
  
  return labels[permission] || permission;
};

/**
 * Agrupa permisos por categoría
 */
export const groupPermissionsByCategory = (permissions) => {
  const groups = {
    users: [],
    companies: [],
    roles: [],
    system: [],
    other: [],
  };
  
  permissions.forEach(permission => {
    if (permission === 'all') {
      groups.system.push(permission);
    } else if (permission.startsWith('users.')) {
      groups.users.push(permission);
    } else if (permission.startsWith('companies.')) {
      groups.companies.push(permission);
    } else if (permission.startsWith('roles.')) {
      groups.roles.push(permission);
    } else if (permission.startsWith('system.')) {
      groups.system.push(permission);
    } else {
      groups.other.push(permission);
    }
  });
  
  return groups;
};

/**
 * Filtra roles según criterios
 */
export const filterRoles = (roles, filters) => {
  return roles.filter(role => {
    // Filtro por búsqueda
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const nombre = role.nombre.toLowerCase();
      const descripcion = (role.descripcion || '').toLowerCase();
      if (!nombre.includes(search) && !descripcion.includes(search)) {
        return false;
      }
    }
    
    // Filtro por editabilidad
    if (filters.editable !== undefined && role.editable !== filters.editable) {
      return false;
    }
    
    return true;
  });
};

/**
 * Ordena roles
 */
export const sortRoles = (roles, sortBy, sortOrder = 'asc') => {
  return [...roles].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'nombre':
        aValue = a.nombre.toLowerCase();
        bValue = b.nombre.toLowerCase();
        break;
      case 'usuariosAsignados':
        aValue = a.usuariosAsignados || 0;
        bValue = b.usuariosAsignados || 0;
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Verifica si un rol tiene un permiso específico
 */
export const hasPermission = (role, permission) => {
  if (!role || !role.permisos) return false;
  if (role.permisos.includes('all')) return true;
  return role.permisos.includes(permission);
};

/**
 * Calcula estadísticas de roles
 */
export const calculateRoleStats = (roles) => {
  const total = roles.length;
  const editable = roles.filter(r => r.editable).length;
  const totalAssignments = roles.reduce((sum, r) => sum + (r.usuariosAsignados || 0), 0);
  const totalPermissions = roles.reduce((sum, r) => sum + (r.permisos?.length || 0), 0);
  
  return {
    total,
    editable,
    totalAssignments,
    totalRoles: total,
    rolesEditables: editable,
    totalUsuarios: totalAssignments,
    permisosTotales: totalPermissions,
  };
};
