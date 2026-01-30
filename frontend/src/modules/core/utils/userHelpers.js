/**
 * Obtiene el nombre completo del usuario
 */
export const getFullName = (user) => {
  if (!user) return '';
  return `${user.nombre || ''} ${user.apellidos || ''}`.trim();
};

/**
 * Obtiene las iniciales del usuario para el avatar
 */
export const getInitials = (user) => {
  if (!user) return '??';
  const nombre = user.nombre?.[0] || '';
  const apellido = user.apellidos?.[0] || '';
  return `${nombre}${apellido}`.toUpperCase();
};

/**
 * Formatea la fecha del último acceso
 */
export const formatLastAccess = (dateString) => {
  if (!dateString) return 'Nunca';
  
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Ahora mismo';
  if (minutes < 60) return `Hace ${minutes} min`;
  if (hours < 24) return `Hace ${hours} h`;
  if (days < 7) return `Hace ${days} días`;
  
  return date.toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
};

/**
 * Filtra usuarios según criterios
 */
export const filterUsers = (users, filters) => {
  return users.filter(user => {
    // Filtro por búsqueda (nombre, email)
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const fullName = getFullName(user).toLowerCase();
      const email = user.email.toLowerCase();
      if (!fullName.includes(search) && !email.includes(search)) {
        return false;
      }
    }
    
    // Filtro por rol
    if (filters.rol && user.rol !== filters.rol) {
      return false;
    }
    
    // Filtro por estado
    if (filters.estado && user.estado !== filters.estado) {
      return false;
    }
    
    // Filtro por departamento
    if (filters.departamento && user.departamento !== filters.departamento) {
      return false;
    }
    
    return true;
  });
};

/**
 * Ordena usuarios según campo y dirección
 */
export const sortUsers = (users, sortBy, sortOrder = 'asc') => {
  return [...users].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = getFullName(a).toLowerCase();
        bValue = getFullName(b).toLowerCase();
        break;
      case 'email':
        aValue = a.email.toLowerCase();
        bValue = b.email.toLowerCase();
        break;
      case 'rol':
        aValue = a.rol;
        bValue = b.rol;
        break;
      case 'estado':
        aValue = a.estado;
        bValue = b.estado;
        break;
      case 'ultimoAcceso':
        aValue = new Date(a.ultimoAcceso || 0);
        bValue = new Date(b.ultimoAcceso || 0);
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
 * Calcula estadísticas de usuarios
 */
export const calculateUserStats = (users) => {
  const total = users.length;
  const active = users.filter(u => u.estado === 'activo').length;
  const byRole = users.reduce((acc, user) => {
    acc[user.rol] = (acc[user.rol] || 0) + 1;
    return acc;
  }, {});
  
  const now = new Date();
  const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const newThisMonth = users.filter(u => new Date(u.createdAt) > monthAgo).length;
  
  return {
    total,
    active,
    byRole,
    newThisMonth,
  };
};

/**
 * Valida email
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Genera un password temporal
 */
export const generateTempPassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};
