const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const { validateRequiredFields, validateEnum } = require('../../../utils/validation');
const instanceService = require('../services/instance-service');

function resolveCompanyId(req) {
  return req.user?.companyId || req.user?.empresaId || req.user?.company_id || null;
}

function mapInstance(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    processId: row.process_id,
    referenceId: row.reference_id,
    referenceType: row.reference_type,
    almProjectId: row.alm_project_id,
    almTaskId: row.alm_task_id,
    status: row.status,
    progressPercent: row.progress_percent,
    startedBy: row.started_by,
    startDate: row.start_date,
    endDate: row.end_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapTask(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    instanceId: row.instance_id,
    activityId: row.activity_id,
    almTaskId: row.alm_task_id,
    assignedTo: row.assigned_to,
    status: row.status,
    dueDate: row.due_date,
    startDate: row.start_date,
    completedAt: row.completed_at,
    resultJson: row.result_json,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapDocument(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    instanceId: row.instance_id,
    fileName: row.file_name,
    documentType: row.document_type,
    size: row.size,
    storageUrl: row.storage_url,
    userId: row.user_id,
    classification: row.classification,
    createdAt: row.created_at
  };
}

function mapComment(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    instanceId: row.instance_id,
    userId: row.user_id,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapAuditLog(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    processId: row.process_id,
    instanceId: row.instance_id,
    userId: row.user_id,
    action: row.action,
    details: row.details,
    createdAt: row.created_at
  };
}

async function listInstances(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'companyId requerido'));
    }
    const { page, limit, offset } = getPaginationParams(req.query);
    const { processId, status } = req.query;

    const { rows, totalItems } = await instanceService.listInstances(companyId, { limit, offset, processId, status });
    const meta = buildPaginationMeta(page, limit, totalItems);

    return res.json(envelopeSuccess(rows.map(mapInstance), meta));
  } catch (err) {
    return next(err);
  }
}

async function getInstance(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'companyId requerido'));
    }
    const instance = await instanceService.getInstanceById(companyId, req.params.id);
    if (!instance) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Instancia no encontrada'));
    }
    const tasks = await instanceService.listTasks(companyId, req.params.id);
    const mapped = mapInstance(instance);
    mapped.tasks = tasks.map(mapTask);

    return res.json(envelopeSuccess(mapped));
  } catch (err) {
    return next(err);
  }
}

async function createInstance(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'companyId requerido'));
    }

    const errors = validateRequiredFields(req.body, ['processId', 'startedBy']);
    if (errors.length) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', errors));
    }

    const row = await instanceService.createInstance(companyId, req.body);
    return res.status(201).json(envelopeSuccess(mapInstance(row)));
  } catch (err) {
    return next(err);
  }
}

async function updateInstance(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'companyId requerido'));
    }

    if (req.body.status) {
      const statusError = validateEnum(req.body.status, ['started', 'in_progress', 'completed', 'canceled', 'error']);
      if (statusError) {
        return res.status(400).json(envelopeError('VALIDATION_ERROR', statusError));
      }
    }

    const row = await instanceService.updateInstance(companyId, req.params.id, req.body);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Instancia no encontrada'));
    }
    return res.json(envelopeSuccess(mapInstance(row)));
  } catch (err) {
    return next(err);
  }
}

async function cancelInstance(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'companyId requerido'));
    }
    const row = await instanceService.cancelInstance(companyId, req.params.id);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Instancia no encontrada'));
    }
    return res.json(envelopeSuccess(mapInstance(row)));
  } catch (err) {
    return next(err);
  }
}

async function listTasks(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'companyId requerido'));
    }
    const rows = await instanceService.listTasks(companyId, req.params.instanceId);
    return res.json(envelopeSuccess(rows.map(mapTask)));
  } catch (err) {
    return next(err);
  }
}

async function updateTask(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'companyId requerido'));
    }

    if (req.body.status) {
      const statusError = validateEnum(req.body.status, ['pending', 'in_progress', 'completed', 'rejected']);
      if (statusError) {
        return res.status(400).json(envelopeError('VALIDATION_ERROR', statusError));
      }
    }

    const row = await instanceService.updateTask(companyId, req.params.id, req.body);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Tarea no encontrada'));
    }
    return res.json(envelopeSuccess(mapTask(row)));
  } catch (err) {
    return next(err);
  }
}

async function addDocument(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'companyId requerido'));
    }

    const errors = validateRequiredFields(req.body, ['fileName']);
    if (errors.length) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', errors));
    }

    const row = await instanceService.addDocument(companyId, req.params.instanceId, {
      ...req.body,
      userId: req.user?.userId || null
    });
    return res.status(201).json(envelopeSuccess(mapDocument(row)));
  } catch (err) {
    return next(err);
  }
}

async function listDocuments(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'companyId requerido'));
    }
    const rows = await instanceService.listDocuments(companyId, req.params.instanceId);
    return res.json(envelopeSuccess(rows.map(mapDocument)));
  } catch (err) {
    return next(err);
  }
}

async function addComment(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'companyId requerido'));
    }

    const errors = validateRequiredFields(req.body, ['content']);
    if (errors.length) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', errors));
    }

    const row = await instanceService.addComment(companyId, req.params.instanceId, {
      ...req.body,
      userId: req.user?.userId || null
    });
    return res.status(201).json(envelopeSuccess(mapComment(row)));
  } catch (err) {
    return next(err);
  }
}

async function listComments(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'companyId requerido'));
    }
    const rows = await instanceService.listComments(companyId, req.params.instanceId);
    return res.json(envelopeSuccess(rows.map(mapComment)));
  } catch (err) {
    return next(err);
  }
}

async function getAuditLog(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'companyId requerido'));
    }
    const { page, limit, offset } = getPaginationParams(req.query);
    const { rows, totalItems } = await instanceService.getAuditLog(companyId, req.params.processId, { limit, offset });
    const meta = buildPaginationMeta(page, limit, totalItems);

    return res.json(envelopeSuccess(rows.map(mapAuditLog), meta));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listInstances,
  getInstance,
  createInstance,
  updateInstance,
  cancelInstance,
  listTasks,
  updateTask,
  addDocument,
  listDocuments,
  addComment,
  listComments,
  getAuditLog
};
