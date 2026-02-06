import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const API_BASE = process.env.ALM_API_BASE || 'http://localhost:3001/api/v1/alm';
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET in environment');
}

const token = jwt.sign({ sub: 'smoke', role: 'admin' }, JWT_SECRET, { expiresIn: '10m' });

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`
};

async function request(method, path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status} ${method} ${path}`);
    err.response = json;
    throw err;
  }
  return json;
}

function nowDate() {
  return new Date().toISOString().slice(0, 10);
}

const ids = {
  projectId: null,
  taskId: null,
  timeId: null
};

async function rollback() {
  try {
    if (ids.timeId) await request('DELETE', `/tiempos/${ids.timeId}`);
  } catch {}
  try {
    if (ids.taskId) await request('DELETE', `/tareas/${ids.taskId}`);
  } catch {}
  try {
    if (ids.projectId) await request('DELETE', `/proyectos/${ids.projectId}`);
  } catch {}
}

async function main() {
  const companyId = process.env.ALM_TEST_COMPANY_ID || '11111111-1111-1111-1111-111111111111';
  const responsibleId = process.env.ALM_TEST_USER_ID || 'user-1';

  // Projects
  const projectCreate = await request('POST', '/proyectos', {
    companyId,
    name: 'ALM Smoke Project',
    startDate: nowDate(),
    responsibleId,
    status: 'planned'
  });
  ids.projectId = projectCreate?.data?.id;

  await request('GET', `/proyectos/${ids.projectId}`);
  await request('GET', `/proyectos/${ids.projectId}/estadisticas`);

  await request('PUT', `/proyectos/${ids.projectId}`, {
    companyId,
    name: 'ALM Smoke Project Updated',
    startDate: nowDate(),
    responsibleId,
    status: 'in_progress'
  });

  // Tasks
  const taskCreate = await request('POST', '/tareas', {
    companyId,
    projectId: ids.projectId,
    title: 'ALM Smoke Task',
    status: 'pending',
    priority: 'medium'
  });
  ids.taskId = taskCreate?.data?.id;

  await request('GET', `/tareas/${ids.taskId}`);
  await request('PATCH', `/tareas/${ids.taskId}/estado`, { status: 'in_progress' });
  await request('PATCH', `/tareas/${ids.taskId}/asignar`, { assignedTo: responsibleId });

  // Time entries
  const timeCreate = await request('POST', '/tiempos', {
    companyId,
    taskId: ids.taskId,
    userId: responsibleId,
    entryDate: nowDate(),
    hours: 1.5
  });
  ids.timeId = timeCreate?.data?.id;

  await request('GET', `/tiempos/tarea/${ids.taskId}`);
  await request('GET', `/tiempos/usuario/${responsibleId}`);
  await request('GET', `/tiempos/proyecto/${ids.projectId}/resumen`);

  await rollback();
  // eslint-disable-next-line no-console
  console.log('ALM smoke test OK (rolled back).');
}

main().catch(async (err) => {
  // eslint-disable-next-line no-console
  console.error('ALM smoke test FAILED:', err.message, err.response || '');
  await rollback();
  process.exitCode = 1;
});
