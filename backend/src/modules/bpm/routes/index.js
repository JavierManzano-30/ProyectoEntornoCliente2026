const express = require('express');
const { requireAuth } = require('../../../middlewares/auth');
const processController = require('../controllers/process-controller');
const instanceController = require('../controllers/instance-controller');
const approvalController = require('../controllers/approval-controller');
const metricsController = require('../controllers/metrics-controller');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ success: true, data: { module: 'bpm', status: 'ok' } });
});

// Métricas y Dashboard
router.get('/metricas', requireAuth, metricsController.getMetrics);

// Bandeja de tareas
router.get('/tareas/bandeja', requireAuth, metricsController.getTaskInbox);

// Procesos (con alias en español)
router.get('/processes', requireAuth, processController.listProcesses);
router.get('/procesos', requireAuth, processController.listProcesses); // Alias español
router.post('/processes', requireAuth, processController.createProcess);
router.post('/procesos', requireAuth, processController.createProcess); // Alias español
router.get('/processes/:id', requireAuth, processController.getProcess);
router.get('/procesos/:id', requireAuth, processController.getProcess); // Alias español
router.put('/processes/:id', requireAuth, processController.updateProcess);
router.put('/procesos/:id', requireAuth, processController.updateProcess); // Alias español
router.delete('/processes/:id', requireAuth, processController.deleteProcess);
router.delete('/procesos/:id', requireAuth, processController.deleteProcess); // Alias español

router.get('/processes/:processId/activities', requireAuth, processController.listActivities);
router.post('/processes/:processId/activities', requireAuth, processController.createActivity);
router.put('/activities/:id', requireAuth, processController.updateActivity);
router.delete('/activities/:id', requireAuth, processController.deleteActivity);

// Instancias (con alias en español)
router.get('/instances', requireAuth, instanceController.listInstances);
router.get('/instancias', requireAuth, instanceController.listInstances); // Alias español
router.post('/instances', requireAuth, instanceController.createInstance);
router.post('/instancias', requireAuth, instanceController.createInstance); // Alias español
router.get('/instances/:id', requireAuth, instanceController.getInstance);
router.get('/instancias/:id', requireAuth, instanceController.getInstance); // Alias español
router.put('/instances/:id', requireAuth, instanceController.updateInstance);
router.put('/instancias/:id', requireAuth, instanceController.updateInstance); // Alias español
router.patch('/instances/:id/cancel', requireAuth, instanceController.cancelInstance);
router.patch('/instancias/:id/cancel', requireAuth, instanceController.cancelInstance); // Alias español

router.get('/instances/:instanceId/tasks', requireAuth, instanceController.listTasks);
router.post('/tasks', requireAuth, instanceController.createTask);
router.post('/tareas', requireAuth, instanceController.createTask); // Alias español
router.patch('/tasks/:id', requireAuth, instanceController.updateTask);

router.get('/instances/:instanceId/documents', requireAuth, instanceController.listDocuments);
router.post('/instances/:instanceId/documents', requireAuth, instanceController.addDocument);

router.get('/instances/:instanceId/comments', requireAuth, instanceController.listComments);
router.post('/instances/:instanceId/comments', requireAuth, instanceController.addComment);

router.get('/processes/:processId/audit', requireAuth, instanceController.getAuditLog);

router.get('/approvals', requireAuth, approvalController.listApprovals);
router.post('/approvals', requireAuth, approvalController.createApproval);
router.put('/approvals/:id', requireAuth, approvalController.updateApproval);
router.delete('/approvals/:id', requireAuth, approvalController.deleteApproval);

router.get('/requests', requireAuth, approvalController.listRequests);
router.post('/requests', requireAuth, approvalController.createRequest);
router.get('/requests/:id', requireAuth, approvalController.getRequest);
router.patch('/requests/:id/status', requireAuth, approvalController.updateRequestStatus);

router.post('/requests/:requestId/responses', requireAuth, approvalController.addResponse);

module.exports = router;
