const express = require('express');
const { requireAuth } = require('../../../middlewares/auth');
const processController = require('../controllers/process-controller');
const instanceController = require('../controllers/instance-controller');
const approvalController = require('../controllers/approval-controller');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ success: true, data: { module: 'bpm', status: 'ok' } });
});

router.get('/processes', requireAuth, processController.listProcesses);
router.post('/processes', requireAuth, processController.createProcess);
router.get('/processes/:id', requireAuth, processController.getProcess);
router.put('/processes/:id', requireAuth, processController.updateProcess);
router.delete('/processes/:id', requireAuth, processController.deleteProcess);

router.get('/processes/:processId/activities', requireAuth, processController.listActivities);
router.post('/processes/:processId/activities', requireAuth, processController.createActivity);
router.put('/activities/:id', requireAuth, processController.updateActivity);
router.delete('/activities/:id', requireAuth, processController.deleteActivity);

router.get('/instances', requireAuth, instanceController.listInstances);
router.post('/instances', requireAuth, instanceController.createInstance);
router.get('/instances/:id', requireAuth, instanceController.getInstance);
router.put('/instances/:id', requireAuth, instanceController.updateInstance);
router.patch('/instances/:id/cancel', requireAuth, instanceController.cancelInstance);

router.get('/instances/:instanceId/tasks', requireAuth, instanceController.listTasks);
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
