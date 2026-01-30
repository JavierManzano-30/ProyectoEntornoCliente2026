import api from '../../../lib/axios';
import { mockEmployees, mockAbsences, mockPayrolls, mockDepartments, mockContracts, mockEvaluations } from '../data/mockData';

// Variable para activar/desactivar modo mock (desarrollo)
const USE_MOCK_DATA = true;

// Función helper para simular delay de API
const mockDelay = (data) => new Promise(resolve => setTimeout(() => resolve(data), 300));

// Endpoints base
const ENDPOINTS = {
  EMPLOYEES: '/api/v1/employees',
  ABSENCES: '/api/v1/absences',
  PAYROLLS: '/api/v1/payrolls',
  CONTRACTS: '/api/v1/contracts',
  DEPARTMENTS: '/api/v1/departments',
  EVALUATIONS: '/api/v1/evaluations',
};

// ========== EMPLEADOS ==========

export const getEmployees = async (params = {}) => {
  if (USE_MOCK_DATA) {
    return mockDelay(mockEmployees);
  }
  const response = await api.get(ENDPOINTS.EMPLOYEES, { params });
  return response.data;
};

export const getEmployee = async (id) => {
  if (USE_MOCK_DATA) {
    const employee = mockEmployees.find(e => e.id === parseInt(id));
    return mockDelay(employee);
  }
  const response = await api.get(`${ENDPOINTS.EMPLOYEES}/${id}`);
  return response.data;
};

export const createEmployee = async (data) => {
  const response = await api.post(ENDPOINTS.EMPLOYEES, data);
  return response.data;
};

export const updateEmployee = async (id, data) => {
  const response = await api.patch(`${ENDPOINTS.EMPLOYEES}/${id}`, data);
  return response.data;
};

export const deactivateEmployee = async (id) => {
  const response = await api.patch(`${ENDPOINTS.EMPLOYEES}/${id}/deactivate`);
  return response.data;
};

export const getEmployeeDocuments = async (id) => {
  const response = await api.get(`${ENDPOINTS.EMPLOYEES}/${id}/documents`);
  return response.data;
};

export const uploadEmployeeDocument = async (id, file) => {
  const formData = new FormData();
  formData.append('document', file);
  const response = await api.post(`${ENDPOINTS.EMPLOYEES}/${id}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getAbsenceBalance = async (employeeId) => {
  if (USE_MOCK_DATA) {
    return mockDelay(mockAbsences);
  }
  const response = await api.get(`${ENDPOINTS.EMPLOYEES}/${employeeId}/absence-balance`);
  return response.data;
};

// ========== AUSENCIAS ==========

export const getAbsences = async (params = {}) => {
  if (USE_MOCK_DATA) {
    return mockDelay(mockAbsences);
  }
  const response = await api.get(ENDPOINTS.ABSENCES, { params });
  return response.data;
};

export const getAbsence = async (id) => {
  const response = await api.get(`${ENDPOINTS.ABSENCES}/${id}`);
  return response.data;
};

export const createAbsence = async (data) => {
  const response = await api.post(ENDPOINTS.ABSENCES, data);
  return response.data;
};

export const updateAbsence = async (id, data) => {
  const response = await api.patch(`${ENDPOINTS.ABSENCES}/${id}`, data);
  return response.data;
};

export const approveAbsence = async (id, comments = '') => {
  const response = await api.patch(`${ENDPOINTS.ABSENCES}/${id}/approve`, { comments });
  return response.data;
};

export const rejectAbsence = async (id, reason) => {
  const response = await api.patch(`${ENDPOINTS.ABSENCES}/${id}/reject`, { reason });
  return response.data;
};

export const cancelAbsence = async (id) => {
  const response = await api.patch(`${ENDPOINTS.ABSENCES}/${id}/cancel`);
  return response.data;
};

// ========== NÓMINAS ==========

export const getPayrolls = async (params = {}) => {
  if (USE_MOCK_DATA) {
    return mockDelay(mockPayrolls);
  }
  const response = await api.get(ENDPOINTS.PAYROLLS, { params });
  return response.data;
};

export const getPayroll = async (id) => {
  const response = await api.get(`${ENDPOINTS.PAYROLLS}/${id}`);
  return response.data;
};

export const downloadPayrollPDF = async (id) => {
  const response = await api.get(`${ENDPOINTS.PAYROLLS}/${id}/pdf`, {
    responseType: 'blob',
  });
  return response.data;
};

export const getEmployeePayrolls = async (employeeId, params = {}) => {
  const response = await api.get(`${ENDPOINTS.EMPLOYEES}/${employeeId}/payrolls`, { params });
  return response.data;
};

// ========== CONTRATOS ==========

export const getContracts = async (params = {}) => {
  const response = await api.get(ENDPOINTS.CONTRACTS, { params });
  return response.data;
};

export const getContract = async (id) => {
  const response = await api.get(`${ENDPOINTS.CONTRACTS}/${id}`);
  return response.data;
};

export const getEmployeeContracts = async (employeeId) => {
  if (USE_MOCK_DATA) {
    const contracts = mockContracts.filter(c => c.employeeId === parseInt(employeeId));
    return mockDelay(contracts);
  }
  const response = await api.get(`${ENDPOINTS.EMPLOYEES}/${employeeId}/contracts`);
  return response.data;
};

export const createContract = async (data) => {
  const response = await api.post(ENDPOINTS.CONTRACTS, data);
  return response.data;
};

export const updateContract = async (id, data) => {
  const response = await api.patch(`${ENDPOINTS.CONTRACTS}/${id}`, data);
  return response.data;
};

export const terminateContract = async (id, data) => {
  const response = await api.patch(`${ENDPOINTS.CONTRACTS}/${id}/terminate`, data);
  return response.data;
};

// ========== DEPARTAMENTOS ==========

export const getDepartments = async (params = {}) => {
  if (USE_MOCK_DATA) {
    return mockDelay(mockDepartments);
  }
  const response = await api.get(ENDPOINTS.DEPARTMENTS, { params });
  return response.data;
};

export const getDepartment = async (id) => {
  const response = await api.get(`${ENDPOINTS.DEPARTMENTS}/${id}`);
  return response.data;
};

export const createDepartment = async (data) => {
  const response = await api.post(ENDPOINTS.DEPARTMENTS, data);
  return response.data;
};

export const updateDepartment = async (id, data) => {
  const response = await api.patch(`${ENDPOINTS.DEPARTMENTS}/${id}`, data);
  return response.data;
};

export const deleteDepartment = async (id) => {
  const response = await api.delete(`${ENDPOINTS.DEPARTMENTS}/${id}`);
  return response.data;
};

export const getDepartmentEmployees = async (departmentId) => {
  const response = await api.get(`${ENDPOINTS.DEPARTMENTS}/${departmentId}/employees`);
  return response.data;
};

// ========== EVALUACIONES ==========

export const getEvaluations = async (params = {}) => {
  const response = await api.get(ENDPOINTS.EVALUATIONS, { params });
  return response.data;
};

export const getEvaluation = async (id) => {
  const response = await api.get(`${ENDPOINTS.EVALUATIONS}/${id}`);
  return response.data;
};

export const getEmployeeEvaluations = async (employeeId, params = {}) => {
  if (USE_MOCK_DATA) {
    const evaluations = mockEvaluations.filter(e => e.employeeId === parseInt(employeeId));
    return mockDelay(evaluations);
  }
  const response = await api.get(`${ENDPOINTS.EMPLOYEES}/${employeeId}/evaluations`, { params });
  return response.data;
};

export const createEvaluation = async (data) => {
  const response = await api.post(ENDPOINTS.EVALUATIONS, data);
  return response.data;
};

export const updateEvaluation = async (id, data) => {
  const response = await api.patch(`${ENDPOINTS.EVALUATIONS}/${id}`, data);
  return response.data;
};

export default {
  // Employees
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deactivateEmployee,
  getEmployeeDocuments,
  uploadEmployeeDocument,
  getAbsenceBalance,
  
  // Absences
  getAbsences,
  getAbsence,
  createAbsence,
  updateAbsence,
  approveAbsence,
  rejectAbsence,
  cancelAbsence,
  
  // Payrolls
  getPayrolls,
  getPayroll,
  downloadPayrollPDF,
  getEmployeePayrolls,
  
  // Contracts
  getContracts,
  getContract,
  getEmployeeContracts,
  createContract,
  updateContract,
  terminateContract,
  
  // Departments
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentEmployees,
  
  // Evaluations
  getEvaluations,
  getEvaluation,
  getEmployeeEvaluations,
  createEvaluation,
  updateEvaluation,
};
