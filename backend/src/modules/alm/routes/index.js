const express = require('express');
const { authMiddleware } = require('../../../middlewares/auth');
const projects = require('../controllers/projectsController');
const tasks = require('../controllers/tasksController');
const times = require('../controllers/timesController');
const supabase = require('../controllers/supabaseController');

const router = express.Router();

// Public health check (no auth) for Supabase connectivity
router.get('/supabase/health', supabase.supabaseHealth);

// Apply auth to all remaining ALM routes
router.use(authMiddleware);
// Projects
router.get('/projects', projects.listProjects);
router.post('/projects', projects.createProject);
router.get('/projects/:id', projects.getProject);
router.put('/projects/:id', projects.updateProject);
router.delete('/projects/:id', projects.deleteProject);
router.get('/projects/:id/tasks', projects.listProjectTasks);
router.get('/projects/:id/stats', projects.getProjectStats);

// Tasks
router.get('/tasks', tasks.listTasks);
router.post('/tasks', tasks.createTask);
router.get('/tasks/:id', tasks.getTask);
router.put('/tasks/:id', tasks.updateTask);
router.delete('/tasks/:id', tasks.deleteTask);
router.patch('/tasks/:id/status', tasks.updateTaskStatus);
router.patch('/tasks/:id/assign', tasks.assignTask);

// Time entries
router.get('/times', times.listTimes);
router.post('/times', times.createTime);
router.put('/times/:id', times.updateTime);
router.delete('/times/:id', times.deleteTime);
router.get('/times/project/:id/summary', times.getProjectTimeSummary);
router.get('/times/user/:id', times.getUserTimes);
router.get('/times/task/:id', times.getTaskTimes);


module.exports = router;
