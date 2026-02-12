import api from '../../../lib/axios';

const ENDPOINTS = {
  EMPLOYEES: '/hr/employees',
  ABSENCES: '/hr/absences',
  PAYROLLS: '/hr/payrolls',
  CONTRACTS: '/hr/contracts',
  DEPARTMENTS: '/hr/departments',
  EVALUATIONS: '/hr/evaluations',
};

const mapEmployee = (row = {}) => ({
  id: row.id,
  companyId: row.company_id,
  firstName: row.first_name,
  lastName: row.last_name,
  email: row.email,
  status: row.status,
  hireDate: row.hire_date,
  departmentId: row.department_id,
  departmentName: row.department_name || row.department?.name || '',
  userId: row.user_id,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapAbsence = (row = {}) => ({
  id: row.id,
  employeeId: row.employee_id,
  companyId: row.company_id,
  type: row.type,
  status: row.status,
  startDate: row.start_date,
  endDate: row.end_date,
  reason: row.reason,
  approvedBy: row.approved_by,
  approvedAt: row.approved_at,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapDepartment = (row = {}) => ({
  id: row.id,
  companyId: row.company_id,
  name: row.name,
  description: row.description,
  managerId: row.manager_id,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapContract = (row = {}) => ({
  id: row.id,
  employeeId: row.employee_id,
  companyId: row.company_id,
  type: row.type,
  startDate: row.start_date,
  endDate: row.end_date,
  salary: Number(row.salary || 0),
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapPayroll = (row = {}) => ({
  id: row.id,
  employeeId: row.employee_id,
  companyId: row.company_id,
  periodStart: row.period_start,
  periodEnd: row.period_end,
  grossSalary: Number(row.gross_salary || 0),
  netSalary: Number(row.net_salary || 0),
  createdAt: row.created_at,
});

const mapEvaluation = (row = {}) => ({
  id: row.id,
  employeeId: row.employee_id,
  companyId: row.company_id,
  period: row.period,
  score: Number(row.score || 0),
  comments: row.comments,
  createdAt: row.created_at,
});

export const getEmployees = async (params = {}) => {
  const response = await api.get(ENDPOINTS.EMPLOYEES, { params });
  return (response.data || []).map(mapEmployee);
};

export const getEmployee = async (id) => {
  const response = await api.get(`${ENDPOINTS.EMPLOYEES}/${id}`);
  return mapEmployee(response.data);
};

export const createEmployee = async (data) => {
  const response = await api.post(ENDPOINTS.EMPLOYEES, data);
  return mapEmployee(response.data);
};

export const updateEmployee = async (id, data) => {
  const response = await api.put(`${ENDPOINTS.EMPLOYEES}/${id}`, data);
  return mapEmployee(response.data);
};

export const deactivateEmployee = async (id) => {
  await api.delete(`${ENDPOINTS.EMPLOYEES}/${id}`);
  return { success: true };
};

export const getEmployeeDocuments = async () => [];
export const uploadEmployeeDocument = async () => {
  throw new Error('Documentos de RRHH no implementados en backend');
};

export const getAbsenceBalance = async (employeeId) => {
  const absences = await getAbsences({ employee_id: employeeId });
  return absences;
};

export const getAbsences = async (params = {}) => {
  const response = await api.get(ENDPOINTS.ABSENCES, { params });
  return (response.data || []).map(mapAbsence);
};

export const getAbsence = async (id) => {
  const response = await api.get(`${ENDPOINTS.ABSENCES}/${id}`);
  return mapAbsence(response.data);
};

export const createAbsence = async (data) => {
  const response = await api.post(ENDPOINTS.ABSENCES, data);
  return mapAbsence(response.data);
};

export const updateAbsence = async (id, data) => {
  const response = await api.put(`${ENDPOINTS.ABSENCES}/${id}`, data);
  return mapAbsence(response.data);
};

export const approveAbsence = async (id) => {
  const response = await api.patch(`${ENDPOINTS.ABSENCES}/${id}/approve`);
  return mapAbsence(response.data);
};

export const rejectAbsence = async (id) => {
  const response = await api.patch(`${ENDPOINTS.ABSENCES}/${id}/reject`);
  return mapAbsence(response.data);
};

export const cancelAbsence = async () => {
  throw new Error('Cancelar ausencia no implementado en backend');
};

export const getPayrolls = async (params = {}) => {
  const response = await api.get(ENDPOINTS.PAYROLLS, { params });
  return (response.data || []).map(mapPayroll);
};

export const getPayroll = async (id) => {
  const response = await api.get(`${ENDPOINTS.PAYROLLS}/${id}`);
  return mapPayroll(response.data);
};

export const downloadPayrollPDF = async () => {
  throw new Error('Descarga de nominas no implementada en backend');
};

export const getEmployeePayrolls = async (employeeId, params = {}) => {
  const payrolls = await getPayrolls(params);
  return payrolls.filter((p) => String(p.employeeId) === String(employeeId));
};

export const getContracts = async (params = {}) => {
  const response = await api.get(ENDPOINTS.CONTRACTS, { params });
  return (response.data || []).map(mapContract);
};

export const getContract = async (id) => {
  const response = await api.get(`${ENDPOINTS.CONTRACTS}/${id}`);
  return mapContract(response.data);
};

export const getEmployeeContracts = async (employeeId) => {
  const contracts = await getContracts();
  return contracts.filter((c) => String(c.employeeId) === String(employeeId));
};

export const createContract = async (data) => {
  const response = await api.post(ENDPOINTS.CONTRACTS, data);
  return mapContract(response.data);
};

export const updateContract = async (id, data) => {
  const response = await api.put(`${ENDPOINTS.CONTRACTS}/${id}`, data);
  return mapContract(response.data);
};

export const terminateContract = async () => {
  throw new Error('Finalizacion de contrato no implementada en backend');
};

export const getDepartments = async (params = {}) => {
  const response = await api.get(ENDPOINTS.DEPARTMENTS, { params });
  return (response.data || []).map(mapDepartment);
};

export const getDepartment = async (id) => {
  const response = await api.get(`${ENDPOINTS.DEPARTMENTS}/${id}`);
  return mapDepartment(response.data);
};

export const createDepartment = async (data) => {
  const response = await api.post(ENDPOINTS.DEPARTMENTS, data);
  return mapDepartment(response.data);
};

export const updateDepartment = async (id, data) => {
  const response = await api.put(`${ENDPOINTS.DEPARTMENTS}/${id}`, data);
  return mapDepartment(response.data);
};

export const deleteDepartment = async (id) => {
  await api.delete(`${ENDPOINTS.DEPARTMENTS}/${id}`);
  return { success: true };
};

export const getDepartmentEmployees = async (departmentId) => {
  const employees = await getEmployees({ department_id: departmentId });
  return employees;
};

export const getEvaluations = async (params = {}) => {
  const response = await api.get(ENDPOINTS.EVALUATIONS, { params });
  return (response.data || []).map(mapEvaluation);
};

export const getEvaluation = async (id) => {
  const response = await api.get(`${ENDPOINTS.EVALUATIONS}/${id}`);
  return mapEvaluation(response.data);
};

export const getEmployeeEvaluations = async (employeeId, params = {}) => {
  const evaluations = await getEvaluations(params);
  return evaluations.filter((e) => String(e.employeeId) === String(employeeId));
};

export const createEvaluation = async (data) => {
  const response = await api.post(ENDPOINTS.EVALUATIONS, data);
  return mapEvaluation(response.data);
};

export const updateEvaluation = async () => {
  throw new Error('Actualizacion de evaluaciones no implementada en backend');
};

export default {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deactivateEmployee,
  getEmployeeDocuments,
  uploadEmployeeDocument,
  getAbsenceBalance,
  getAbsences,
  getAbsence,
  createAbsence,
  updateAbsence,
  approveAbsence,
  rejectAbsence,
  cancelAbsence,
  getPayrolls,
  getPayroll,
  downloadPayrollPDF,
  getEmployeePayrolls,
  getContracts,
  getContract,
  getEmployeeContracts,
  createContract,
  updateContract,
  terminateContract,
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentEmployees,
  getEvaluations,
  getEvaluation,
  getEmployeeEvaluations,
  createEvaluation,
  updateEvaluation,
};
