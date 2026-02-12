const express = require('express');
const { authMiddleware } = require('../../../middlewares/auth');
const projects = require('../controllers/projectsController');
const tasks = require('../controllers/tasksController');
const times = require('../controllers/timesController');
const supabase = require('../controllers/supabaseController');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ success: true, data: { module: 'alm', status: 'ok' } });
});

// Public health check (no auth) for Supabase connectivity
router.get('/supabase/health', supabase.supabaseHealth);

// Apply auth to all remaining ALM routes
router.use(authMiddleware);

// Projects (English)
router.get('/projects', projects.listProjects);
router.post('/projects', projects.createProject);
router.get('/projects/:id', projects.getProject);
router.put('/projects/:id', projects.updateProject);
router.delete('/projects/:id', projects.deleteProject);
router.get('/projects/:id/tasks', projects.listProjectTasks);
router.get('/projects/:id/stats', projects.getProjectStats);

// Alias en español para projects
router.get('/proyectos', projects.listProjects);
router.post('/proyectos', projects.createProject);
router.get('/proyectos/:id', projects.getProject);
router.put('/proyectos/:id', projects.updateProject);
router.delete('/proyectos/:id', projects.deleteProject);
router.get('/proyectos/:id/tareas', projects.listProjectTasks);
router.get('/proyectos/:id/stats', projects.getProjectStats);

// Tasks
router.get('/tasks', tasks.listTasks);
router.post('/tasks', tasks.createTask);
router.get('/tasks/:id', tasks.getTask);
router.put('/tasks/:id', tasks.updateTask);
router.delete('/tasks/:id', tasks.deleteTask);
router.patch('/tasks/:id/status', tasks.updateTaskStatus);
router.patch('/tasks/:id/assign', tasks.assignTask);

// Tasks (Spanish aliases)
router.get('/tareas', tasks.listTasks);
router.post('/tareas', tasks.createTask);
router.get('/tareas/:id', tasks.getTask);
router.put('/tareas/:id', tasks.updateTask);
router.delete('/tareas/:id', tasks.deleteTask);
router.patch('/tareas/:id/status', tasks.updateTaskStatus);
router.patch('/tareas/:id/assign', tasks.assignTask);

// Time entries
router.get('/times', times.listTimes);
router.post('/times', times.createTime);
router.put('/times/:id', times.updateTime);
router.delete('/times/:id', times.deleteTime);
router.get('/times/project/:id/summary', times.getProjectTimeSummary);
router.get('/times/user/:id', times.getUserTimes);
router.get('/times/task/:id', times.getTaskTimes);

// Time entries (Spanish aliases)
router.get('/tiempos', times.listTimes);
router.post('/tiempos', times.createTime);
router.put('/tiempos/:id', times.updateTime);
router.delete('/tiempos/:id', times.deleteTime);
router.get('/tiempos/project/:id/summary', times.getProjectTimeSummary);
router.get('/tiempos/user/:id', times.getUserTimes);
router.get('/tiempos/task/:id', times.getTaskTimes);


module.exports = router;
