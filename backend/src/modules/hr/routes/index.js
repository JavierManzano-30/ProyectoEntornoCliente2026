const express = require('express');
const { requireAuth } = require('../../../middlewares/auth');

const departments = require('../controllers/department-controller');
const employees = require('../controllers/employee-controller');
const contracts = require('../controllers/contract-controller');
const absences = require('../controllers/absence-controller');
const payrolls = require('../controllers/payroll-controller');
const evaluations = require('../controllers/evaluation-controller');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ success: true, data: { module: 'hr', status: 'ok' } });
});

router.use(requireAuth);

// Departments (English)
router.get('/departments', departments.listDepartments);
router.post('/departments', departments.createDepartment);
router.get('/departments/:id', departments.getDepartment);
router.put('/departments/:id', departments.updateDepartment);
router.delete('/departments/:id', departments.deleteDepartment);

// Alias en español para departments
router.get('/departamentos', departments.listDepartments);
router.post('/departamentos', departments.createDepartment);
router.get('/departamentos/:id', departments.getDepartment);
router.put('/departamentos/:id', departments.updateDepartment);
router.delete('/departamentos/:id', departments.deleteDepartment);

// Employees (English)
router.get('/employees', employees.listEmployees);
router.post('/employees', employees.createEmployee);
router.get('/employees/:id', employees.getEmployee);
router.get('/employees/:id/summary', employees.getEmployeeSummary);
router.put('/employees/:id', employees.updateEmployee);
router.delete('/employees/:id', employees.deleteEmployee);

// Alias en español para employees
router.get('/empleados', employees.listEmployees);
router.post('/empleados', employees.createEmployee);
router.get('/empleados/:id', employees.getEmployee);
router.get('/empleados/:id/summary', employees.getEmployeeSummary);
router.put('/empleados/:id', employees.updateEmployee);
router.delete('/empleados/:id', employees.deleteEmployee);

router.get('/contracts', contracts.listContracts);
router.post('/contracts', contracts.createContract);
router.get('/contracts/:id', contracts.getContract);
router.put('/contracts/:id', contracts.updateContract);
router.delete('/contracts/:id', contracts.deleteContract);

router.get('/absences', absences.listAbsences);
router.post('/absences', absences.createAbsence);
router.get('/absences/:id', absences.getAbsence);
router.put('/absences/:id', absences.updateAbsence);
router.delete('/absences/:id', absences.deleteAbsence);
router.patch('/absences/:id/approve', absences.approveAbsence);
router.patch('/absences/:id/reject', absences.rejectAbsence);

router.get('/payrolls', payrolls.listPayrolls);
router.post('/payrolls', payrolls.createPayroll);
router.get('/payrolls/:id', payrolls.getPayroll);

router.get('/evaluations', evaluations.listEvaluations);
router.post('/evaluations', evaluations.createEvaluation);
router.get('/evaluations/:id', evaluations.getEvaluation);

module.exports = router;
