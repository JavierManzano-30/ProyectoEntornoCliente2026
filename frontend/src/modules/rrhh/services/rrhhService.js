import api from '../../../lib/axios';

const ENDPOINTS = {
  EMPLOYEES: '/hr/employees',
  ABSENCES: '/hr/absences',
  PAYROLLS: '/hr/payrolls',
  CONTRACTS: '/hr/contracts',
  DEPARTMENTS: '/hr/departments',
  EVALUATIONS: '/hr/evaluations',
};

const buildEmployeeNumber = (id) => {
  if (!id) return '-';
  const value = String(id).replace(/-/g, '').toUpperCase();
  return value.slice(0, 8) || '-';
};

const toMonthYearFromPeriod = (period) => {
  if (!period) {
    return { month: null, year: null };
  }

  const value = String(period);
  const [yearPart, monthPart] = value.split('-');
  const year = Number.parseInt(yearPart, 10);
  const month = Number.parseInt(monthPart, 10);

  return {
    month: Number.isFinite(month) ? month : null,
    year: Number.isFinite(year) ? year : null,
  };
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
  employeeNumber: row.employee_number || row.employeeNumber || buildEmployeeNumber(row.id),
  position: row.position || row.job_title || row.contract_type || '',
  salary: Number(row.salary || 0),
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
  reason: row.reason || row.notes || '',
  approvedBy: row.approved_by,
  approvedAt: row.approved_at,
  employeeName: row.employee_name || row.employeeName || '',
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapDepartment = (row = {}) => ({
  id: row.id,
  companyId: row.company_id,
  name: row.name,
  description: row.description,
  managerId: row.manager_id,
  parentId: row.parent_department_id || row.parentId || null,
  active: row.active,
  employeeCount: Number(row.employee_count || row.employeeCount || 0),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapContract = (row = {}) => ({
  id: row.id,
  employeeId: row.employee_id,
  companyId: row.company_id,
  type: row.type || row.contract_type || '',
  startDate: row.start_date,
  endDate: row.end_date,
  salary: Number(row.salary || 0),
  status: row.status || (row.active ? 'active' : 'inactive'),
  active: Boolean(row.active),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapPayroll = (row = {}) => ({
  id: row.id,
  employeeId: row.employee_id,
  companyId: row.company_id,
  period: row.period || '',
  grossAmount: Number(row.gross_amount || row.grossSalary || 0),
  netAmount: Number(row.net_amount || row.netSalary || 0),
  deductions: Math.max(
    Number(row.gross_amount || row.grossSalary || 0) - Number(row.net_amount || row.netSalary || 0),
    0
  ),
  employeeName: row.employee_name || row.employeeName || '',
  employeeNumber: row.employee_number || row.employeeNumber || '-',
  ...toMonthYearFromPeriod(row.period),
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
  const [employeesResponse, departmentsResponse, contractsResponse] = await Promise.all([
    api.get(ENDPOINTS.EMPLOYEES, { params }),
    api.get(ENDPOINTS.DEPARTMENTS),
    api.get(ENDPOINTS.CONTRACTS),
  ]);

  const employees = (employeesResponse.data || []).map(mapEmployee);
  const departments = (departmentsResponse.data || []).map(mapDepartment);
  const contracts = (contractsResponse.data || []).map(mapContract);

  const departmentById = new Map(departments.map((department) => [String(department.id), department]));
  const activeContractByEmployeeId = new Map();

  contracts.forEach((contract) => {
    if (!contract.employeeId) return;
    if (contract.active === false && contract.status !== 'active') return;

    const key = String(contract.employeeId);
    const current = activeContractByEmployeeId.get(key);

    if (!current) {
      activeContractByEmployeeId.set(key, contract);
      return;
    }

    const currentDate = current.startDate ? new Date(current.startDate).getTime() : 0;
    const candidateDate = contract.startDate ? new Date(contract.startDate).getTime() : 0;
    if (candidateDate >= currentDate) {
      activeContractByEmployeeId.set(key, contract);
    }
  });

  return employees.map((employee) => {
    const department = employee.departmentId ? departmentById.get(String(employee.departmentId)) : null;
    const contract = activeContractByEmployeeId.get(String(employee.id));

    return {
      ...employee,
      departmentName: employee.departmentName || department?.name || '',
      salary: contract?.salary || employee.salary || 0,
      position: employee.position || contract?.type || '',
    };
  });
};

export const getEmployee = async (id) => {
  const [employeeResponse, departmentsResponse, contractsResponse] = await Promise.all([
    api.get(`${ENDPOINTS.EMPLOYEES}/${id}`),
    api.get(ENDPOINTS.DEPARTMENTS),
    api.get(ENDPOINTS.CONTRACTS, { params: { employee_id: id } }),
  ]);

  const employee = mapEmployee(employeeResponse.data);
  const departments = (departmentsResponse.data || []).map(mapDepartment);
  const contracts = (contractsResponse.data || []).map(mapContract);

  const departmentById = new Map(departments.map((department) => [String(department.id), department]));
  const activeContract =
    contracts.find((contract) => contract.active || contract.status === 'active') || contracts[0] || null;

  return {
    ...employee,
    departmentName:
      employee.departmentName || departmentById.get(String(employee.departmentId))?.name || '',
    salary: activeContract?.salary || employee.salary || 0,
    position: employee.position || activeContract?.type || '',
  };
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
  const [absencesResponse, employeesResponse] = await Promise.all([
    api.get(ENDPOINTS.ABSENCES, { params }),
    api.get(ENDPOINTS.EMPLOYEES),
  ]);

  const employees = (employeesResponse.data || []).map(mapEmployee);
  const employeeById = new Map(
    employees.map((employee) => [String(employee.id), `${employee.firstName || ''} ${employee.lastName || ''}`.trim()])
  );

  return (absencesResponse.data || []).map((row) => {
    const mapped = mapAbsence(row);
    return {
      ...mapped,
      employeeName: mapped.employeeName || employeeById.get(String(mapped.employeeId)) || '-',
    };
  });
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
  const [payrollsResponse, employeesResponse] = await Promise.all([
    api.get(ENDPOINTS.PAYROLLS, { params }),
    api.get(ENDPOINTS.EMPLOYEES),
  ]);

  const employees = (employeesResponse.data || []).map(mapEmployee);
  const employeeById = new Map(employees.map((employee) => [String(employee.id), employee]));

  return (payrollsResponse.data || []).map((row) => {
    const mapped = mapPayroll(row);
    const employee = employeeById.get(String(mapped.employeeId));
    return {
      ...mapped,
      employeeName: mapped.employeeName || (employee ? `${employee.firstName} ${employee.lastName}`.trim() : '-'),
      employeeNumber: mapped.employeeNumber || employee?.employeeNumber || '-',
    };
  });
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
  const [departmentsResponse, employeesResponse] = await Promise.all([
    api.get(ENDPOINTS.DEPARTMENTS, { params }),
    api.get(ENDPOINTS.EMPLOYEES),
  ]);

  const departments = (departmentsResponse.data || []).map(mapDepartment);
  const employees = (employeesResponse.data || []).map(mapEmployee);

  const employeeCountByDepartment = {};
  employees.forEach((employee) => {
    if (!employee.departmentId) return;
    const key = String(employee.departmentId);
    employeeCountByDepartment[key] = (employeeCountByDepartment[key] || 0) + 1;
  });

  return departments.map((department) => ({
    ...department,
    employeeCount: employeeCountByDepartment[String(department.id)] || department.employeeCount || 0,
  }));
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
