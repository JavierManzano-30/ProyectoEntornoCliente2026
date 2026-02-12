import api from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../config/api';

const toArray = (value) => (Array.isArray(value) ? value : []);

const capitalize = (value = '') =>
  value
    .toString()
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');

const splitNameFromEmail = (email = '') => {
  const localPart = String(email).split('@')[0] || '';
  const parts = localPart.split(/[._-]+/).filter(Boolean);
  return {
    nombre: capitalize(parts[0] || 'Usuario'),
    apellidos: capitalize(parts.slice(1).join(' ')),
  };
};

const normalizeUserRole = (value = '') => {
  const normalized = String(value).toLowerCase();
  if (normalized.includes('admin')) return 'admin';
  if (normalized.includes('manager') || normalized.includes('gestor')) return 'manager';
  return 'empleado';
};

const normalizeUserStatus = (status) => {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'active' || normalized === 'activo') return 'activo';
  if (normalized === 'inactive' || normalized === 'inactivo') return 'inactivo';
  if (normalized === 'pending' || normalized === 'pendiente') return 'pendiente';
  if (normalized === 'suspended' || normalized === 'suspendido') return 'suspendido';
  return 'activo';
};

const mapUser = (user = {}) => {
  const fallbackName = splitNameFromEmail(user.email);
  const nombre = user.first_name || user.nombre || fallbackName.nombre;
  const apellidos = user.last_name || user.apellidos || fallbackName.apellidos;

  return {
    id: user.id,
    nombre,
    apellidos,
    email: user.email || '',
    telefono: user.phone || user.telefono || '',
    rol: normalizeUserRole(user.role || user.role_name),
    estado:
      typeof user.is_active === 'boolean'
        ? (user.is_active ? 'activo' : 'inactivo')
        : normalizeUserStatus(user.status),
    departamento: user.department_name || user.department || '',
    ultimoAcceso: user.last_login_at || null,
    createdAt: user.created_at || null,
    updatedAt: user.updated_at || null,
  };
};

const mapRole = (role = {}) => {
  const permisos = Array.isArray(role.permissions)
    ? role.permissions
    : role.permissions && typeof role.permissions === 'object'
      ? Object.keys(role.permissions).filter((key) => role.permissions[key])
      : [];

  return {
    id: role.id,
    nombre: role.name || '',
    descripcion: role.description || '',
    permisos,
    usuariosAsignados: role.user_count || 0,
    editable: !role.is_system,
    createdAt: role.created_at || null,
    updatedAt: role.updated_at || null,
  };
};

const mapCompany = (company = {}) => {
  const settings = company.settings && typeof company.settings === 'object' ? company.settings : {};
  return {
    id: company.id,
    nombre: company.name || '',
    cif: company.tax_id || '',
    email: settings.email || '',
    telefono: settings.telefono || '',
    direccion: settings.direccion || '',
    ciudad: settings.ciudad || '',
    codigoPostal: settings.codigoPostal || '',
    pais: settings.pais || '',
    sector: settings.sector || '',
    numeroEmpleados: Number(settings.numeroEmpleados || 0),
    estado: company.is_active ? 'activa' : 'inactiva',
    logoUrl: settings.logoUrl || '',
    fechaCreacion: company.created_at || null,
    updatedAt: company.updated_at || null,
  };
};

const mapCompanyPayload = (data = {}) => ({
  name: data.nombre,
  tax_id: data.cif,
  domain: data.domain || null,
  is_active: data.estado !== 'inactiva',
  settings: {
    email: data.email || '',
    telefono: data.telefono || '',
    direccion: data.direccion || '',
    ciudad: data.ciudad || '',
    codigoPostal: data.codigoPostal || '',
    pais: data.pais || '',
    sector: data.sector || '',
    numeroEmpleados: Number(data.numeroEmpleados || 0),
    logoUrl: data.logoUrl || '',
  },
});

export const getUsers = async () => {
  const response = await api.get('/hr/employees');
  return toArray(response.data).map(mapUser);
};

export const getUser = async (id) => {
  const response = await api.get(`/hr/employees/${id}`);
  return mapUser(response.data);
};

export const createUser = async (data) => {
  const payload = {
    email: data.email,
    password: data.password || 'TempPass123!',
    first_name: data.nombre,
    last_name: data.apellidos,
    is_active: data.estado !== 'inactivo',
  };

  const response = await api.post(API_ENDPOINTS.core.users, payload);
  return mapUser(response.data);
};

export const updateUser = async (id, data) => {
  const payload = {
    email: data.email,
    first_name: data.nombre,
    last_name: data.apellidos,
    is_active: data.estado !== 'inactivo',
  };
  const response = await api.patch(API_ENDPOINTS.core.userById(id), payload);
  return mapUser(response.data);
};

export const deleteUser = async (id) => {
  await api.delete(API_ENDPOINTS.core.userById(id));
  return { success: true };
};

export const activateUser = async (id) => updateUser(id, { estado: 'activo' });
export const deactivateUser = async (id) => updateUser(id, { estado: 'inactivo' });
export const resetPassword = async () => {
  throw new Error('Reset de contrasena no implementado en backend');
};

export const getCompanies = async () => {
  const response = await api.get(API_ENDPOINTS.core.companies);
  return toArray(response.data).map(mapCompany);
};

export const getCompany = async (id) => {
  const response = await api.get(API_ENDPOINTS.core.companyById(id));
  return mapCompany(response.data);
};

export const createCompany = async (data) => {
  const response = await api.post(API_ENDPOINTS.core.companies, mapCompanyPayload(data));
  return mapCompany(response.data);
};

export const updateCompany = async (id, data) => {
  const response = await api.put(API_ENDPOINTS.core.companyById(id), mapCompanyPayload(data));
  return mapCompany(response.data);
};

export const deleteCompany = async (id) => {
  await api.delete(API_ENDPOINTS.core.companyById(id));
  return { success: true };
};

export const getCompanyUsers = async () => getUsers();

export const getRoles = async () => {
  const response = await api.get(API_ENDPOINTS.core.roles);
  return toArray(response.data).map(mapRole);
};

export const getRole = async (id) => {
  const response = await api.get(API_ENDPOINTS.core.roleById(id));
  return mapRole(response.data);
};

export const createRole = async (data) => {
  const payload = {
    name: data.nombre,
    description: data.descripcion,
    permissions: data.permisos || [],
  };
  const response = await api.post(API_ENDPOINTS.core.roles, payload);
  return mapRole(response.data);
};

export const updateRole = async (id, data) => {
  const payload = {
    name: data.nombre,
    description: data.descripcion,
    permissions: data.permisos || [],
  };
  const response = await api.patch(API_ENDPOINTS.core.roleById(id), payload);
  return mapRole(response.data);
};

export const deleteRole = async (id) => {
  await api.delete(API_ENDPOINTS.core.roleById(id));
  return { success: true };
};

export const login = async (email, password, companyId = null) => {
  const response = await api.post(API_ENDPOINTS.auth.login, { email, password, companyId });
  const data = response.data || {};

  return {
    token: data.token,
    userId: data.userId,
    companyId: data.companyId,
    roleId: data.roleId,
    user: {
      id: data.userId,
      companyId: data.companyId,
      roleId: data.roleId,
      email,
    },
  };
};

export const logout = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('companyId');
  localStorage.removeItem('roleId');
  localStorage.removeItem('user');
  return { success: true };
};

export const getCurrentUser = async () => {
  const userId = localStorage.getItem('userId');
  const companyId = localStorage.getItem('companyId');
  const roleId = localStorage.getItem('roleId');

  return {
    id: userId,
    companyId,
    roleId,
  };
};

export const changePassword = async () => {
  throw new Error('Cambio de contrasena no implementado en backend');
};

export const getDashboardStats = async () => {
  const [users, dashboardResponse, companies] = await Promise.all([
    getUsers(),
    api.get(API_ENDPOINTS.core.dashboard).catch(() => ({ data: {} })),
    getCompanies(),
  ]);

  const dashboard = dashboardResponse.data || {};
  return {
    totalUsuarios: users.length,
    usuariosActivos: users.filter((u) => u.estado === 'activo').length,
    usuariosNuevos: users.filter((u) => {
      if (!u.createdAt) return false;
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return new Date(u.createdAt) >= thirtyDaysAgo;
    }).length,
    totalEmpresas: companies.length,
    empresasActivas: companies.filter((c) => c.estado === 'activa').length,
    sesionesActivas: dashboard.sesionesActivas || 0,
    actividadReciente: toArray(dashboard.actividadReciente),
  };
};

export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  activateUser,
  deactivateUser,
  resetPassword,
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyUsers,
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  login,
  logout,
  getCurrentUser,
  changePassword,
  getDashboardStats,
};
