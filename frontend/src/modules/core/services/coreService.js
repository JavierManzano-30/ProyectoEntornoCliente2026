import api from '../../../lib/axios';
import { mockUsers, mockCompanies, mockRoles, mockDashboardStats } from '../data/mockData';

// Variable para activar/desactivar modo mock (desarrollo)
const USE_MOCK_DATA = false;

// Función helper para simular delay de API
const mockDelay = (data) => new Promise(resolve => setTimeout(() => resolve(data), 300));

// Endpoints base
const ENDPOINTS = {
  USERS: '/core/usuarios',
  COMPANIES: '/core/empresas',
  ROLES: '/core/roles',
  AUTH: '/core/auth',
  DASHBOARD: '/core/dashboard',
};

// ========== USUARIOS ==========

export const getUsers = async (params = {}) => {
  if (USE_MOCK_DATA) {
    return mockDelay(mockUsers);
  }
  const response = await api.get(ENDPOINTS.USERS, { params });
  return response.data;
};

export const getUser = async (id) => {
  if (USE_MOCK_DATA) {
    const user = mockUsers.find(u => u.id === parseInt(id));
    return mockDelay(user);
  }
  const response = await api.get(`${ENDPOINTS.USERS}/${id}`);
  return response.data;
};

export const createUser = async (data) => {
  if (USE_MOCK_DATA) {
    const newUser = { ...data, id: mockUsers.length + 1, createdAt: new Date().toISOString() };
    return mockDelay(newUser);
  }
  const response = await api.post(ENDPOINTS.USERS, data);
  return response.data;
};

export const updateUser = async (id, data) => {
  if (USE_MOCK_DATA) {
    const user = mockUsers.find(u => u.id === parseInt(id));
    return mockDelay({ ...user, ...data });
  }
  const response = await api.patch(`${ENDPOINTS.USERS}/${id}`, data);
  return response.data;
};

export const deleteUser = async (id) => {
  if (USE_MOCK_DATA) {
    return mockDelay({ success: true });
  }
  const response = await api.delete(`${ENDPOINTS.USERS}/${id}`);
  return response.data;
};

export const activateUser = async (id) => {
  if (USE_MOCK_DATA) {
    return mockDelay({ success: true });
  }
  const response = await api.patch(`${ENDPOINTS.USERS}/${id}/activate`);
  return response.data;
};

export const deactivateUser = async (id) => {
  if (USE_MOCK_DATA) {
    return mockDelay({ success: true });
  }
  const response = await api.patch(`${ENDPOINTS.USERS}/${id}/deactivate`);
  return response.data;
};

export const resetPassword = async (id) => {
  if (USE_MOCK_DATA) {
    return mockDelay({ temporaryPassword: 'Temp123456' });
  }
  const response = await api.post(`${ENDPOINTS.USERS}/${id}/reset-password`);
  return response.data;
};

// ========== EMPRESAS ==========

export const getCompanies = async (params = {}) => {
  if (USE_MOCK_DATA) {
    return mockDelay(mockCompanies);
  }
  const response = await api.get(ENDPOINTS.COMPANIES, { params });
  return response.data;
};

export const getCompany = async (id) => {
  if (USE_MOCK_DATA) {
    const company = mockCompanies.find(c => c.id === id);
    return mockDelay(company);
  }
  const response = await api.get(`${ENDPOINTS.COMPANIES}/${id}`);
  return response.data;
};

export const createCompany = async (data) => {
  if (USE_MOCK_DATA) {
    const newCompany = { ...data, id: `emp_${mockCompanies.length + 1}`, createdAt: new Date().toISOString() };
    return mockDelay(newCompany);
  }
  const response = await api.post(ENDPOINTS.COMPANIES, data);
  return response.data;
};

export const updateCompany = async (id, data) => {
  if (USE_MOCK_DATA) {
    const company = mockCompanies.find(c => c.id === id);
    return mockDelay({ ...company, ...data });
  }
  const response = await api.patch(`${ENDPOINTS.COMPANIES}/${id}`, data);
  return response.data;
};

export const deleteCompany = async (id) => {
  if (USE_MOCK_DATA) {
    return mockDelay({ success: true });
  }
  const response = await api.delete(`${ENDPOINTS.COMPANIES}/${id}`);
  return response.data;
};

export const getCompanyUsers = async (id) => {
  if (USE_MOCK_DATA) {
    const users = mockUsers.filter(u => u.empresaId === id);
    return mockDelay(users);
  }
  const response = await api.get(`${ENDPOINTS.COMPANIES}/${id}/usuarios`);
  return response.data;
};

// ========== ROLES ==========

export const getRoles = async (params = {}) => {
  if (USE_MOCK_DATA) {
    return mockDelay(mockRoles);
  }
  const response = await api.get(ENDPOINTS.ROLES, { params });
  return response.data;
};

export const getRole = async (id) => {
  if (USE_MOCK_DATA) {
    const role = mockRoles.find(r => r.id === parseInt(id));
    return mockDelay(role);
  }
  const response = await api.get(`${ENDPOINTS.ROLES}/${id}`);
  return response.data;
};

export const createRole = async (data) => {
  if (USE_MOCK_DATA) {
    const newRole = { ...data, id: mockRoles.length + 1, createdAt: new Date().toISOString() };
    return mockDelay(newRole);
  }
  const response = await api.post(ENDPOINTS.ROLES, data);
  return response.data;
};

export const updateRole = async (id, data) => {
  if (USE_MOCK_DATA) {
    const role = mockRoles.find(r => r.id === parseInt(id));
    return mockDelay({ ...role, ...data });
  }
  const response = await api.patch(`${ENDPOINTS.ROLES}/${id}`, data);
  return response.data;
};

export const deleteRole = async (id) => {
  if (USE_MOCK_DATA) {
    return mockDelay({ success: true });
  }
  const response = await api.delete(`${ENDPOINTS.ROLES}/${id}`);
  return response.data;
};

// ========== AUTENTICACIÓN ==========

export const login = async (email, password) => {
  if (USE_MOCK_DATA) {
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      return mockDelay({ 
        token: 'mock-jwt-token',
        user,
      });
    }
    throw new Error('Credenciales inválidas');
  }
  const response = await api.post(`${ENDPOINTS.AUTH}/login`, { email, password });
  return response.data;
};

export const logout = async () => {
  if (USE_MOCK_DATA) {
    return mockDelay({ success: true });
  }
  const response = await api.post(`${ENDPOINTS.AUTH}/logout`);
  return response.data;
};

export const getCurrentUser = async () => {
  if (USE_MOCK_DATA) {
    return mockDelay(mockUsers[0]); // Retorna admin
  }
  const response = await api.get(`${ENDPOINTS.AUTH}/me`);
  return response.data;
};

export const changePassword = async (oldPassword, newPassword) => {
  if (USE_MOCK_DATA) {
    return mockDelay({ success: true });
  }
  const response = await api.post(`${ENDPOINTS.AUTH}/change-password`, { oldPassword, newPassword });
  return response.data;
};

// ========== DASHBOARD ==========

export const getDashboardStats = async () => {
  if (USE_MOCK_DATA) {
    return mockDelay(mockDashboardStats);
  }
  const response = await api.get(ENDPOINTS.DASHBOARD);
  return response.data;
};

export default {
  // Usuarios
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  activateUser,
  deactivateUser,
  resetPassword,
  
  // Empresas
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyUsers,
  
  // Roles
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  
  // Autenticación
  login,
  logout,
  getCurrentUser,
  changePassword,
  
  // Dashboard
  getDashboardStats,
};
