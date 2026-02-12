import api from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../config/api';

const notImplementedPayload = [];

const safeUnimplemented = async () => notImplementedPayload;

export const getUsers = safeUnimplemented;
export const getUser = async () => null;
export const createUser = async () => {
  throw new Error('Endpoint de usuarios no implementado en backend');
};
export const updateUser = async () => {
  throw new Error('Endpoint de usuarios no implementado en backend');
};
export const deleteUser = async () => {
  throw new Error('Endpoint de usuarios no implementado en backend');
};
export const activateUser = async () => {
  throw new Error('Endpoint de usuarios no implementado en backend');
};
export const deactivateUser = async () => {
  throw new Error('Endpoint de usuarios no implementado en backend');
};
export const resetPassword = async () => {
  throw new Error('Endpoint de usuarios no implementado en backend');
};

export const getCompanies = async () => {
  const response = await api.get(API_ENDPOINTS.core.companies);
  return Array.isArray(response.data) ? response.data : [];
};

export const getCompany = async (id) => {
  const response = await api.get(API_ENDPOINTS.core.companyById(id));
  return response.data;
};

export const createCompany = async (data) => {
  const response = await api.post(API_ENDPOINTS.core.companies, data);
  return response.data;
};

export const updateCompany = async (id, data) => {
  const response = await api.put(API_ENDPOINTS.core.companyById(id), data);
  return response.data;
};

export const deleteCompany = async (id) => {
  await api.delete(API_ENDPOINTS.core.companyById(id));
  return { success: true };
};

export const getCompanyUsers = safeUnimplemented;

export const getRoles = safeUnimplemented;
export const getRole = async () => null;
export const createRole = async () => {
  throw new Error('Endpoint de roles no implementado en backend');
};
export const updateRole = async () => {
  throw new Error('Endpoint de roles no implementado en backend');
};
export const deleteRole = async () => {
  throw new Error('Endpoint de roles no implementado en backend');
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
  const companies = await getCompanies();
  return {
    totalUsuarios: 0,
    usuariosActivos: 0,
    totalEmpresas: companies.length,
    empresasActivas: companies.filter((c) => c.is_active).length,
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
