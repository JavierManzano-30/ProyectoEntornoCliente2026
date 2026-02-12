const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const { validateRequiredFields, validateEnum } = require('../../../utils/validation');
const approvalService = require('../services/approval-service');

function resolveCompanyId(req) {
  return (
    req.user?.companyId ||
    req.user?.company_id ||
    req.headers['x-company-id'] ||
    req.query.companyId ||
    req.body?.companyId ||
    null
  );
}

function mapApproval(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    processId: row.process_id,
    name: row.name,
    documentType: row.document_type,
    level: row.level,
    requiredApprovers: row.required_approvers,
    slaHours: row.sla_hours,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapRequest(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    approvalId: row.approval_id,
    referenceId: row.reference_id,
    referenceType: row.reference_type,
    requesterId: row.requester_id,
    status: row.status,
    priority: row.priority,
    dueDate: row.due_date,
    startDate: row.start_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapResponse(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    requestId: row.request_id,
    approverId: row.approver_id,
    decision: row.decision,
    comments: row.comments,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function listApprovals(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'companyId is required'));
    }
    const { page, limit, offset } = getPaginationParams(req.query);
    const { processId } = req.query;

    const { rows, totalItems } = await approvalService.listApprovals(companyId, { limit, offset, processId });
    const meta = buildPaginationMeta(page, limit, totalItems);

    return res.json(envelopeSuccess(rows.map(mapApproval), meta));
  } catch (err) {
    return next(err);
  }
}

async function createApproval(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'companyId is required'));
    }

    const errors = validateRequiredFields(req.body, ['processId', 'name', 'level', 'requiredApprovers']);
    if (errors.length) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Invalid data', errors));
    }

    const row = await approvalService.createApproval(companyId, req.body);
    return res.status(201).json(envelopeSuccess(mapApproval(row)));
  } catch (err) {
    return next(err);
  }
}

async function updateApproval(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'companyId is required'));
    }

    const row = await approvalService.updateApproval(companyId, req.params.id, req.body);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Approval not found'));
    }
    return res.json(envelopeSuccess(mapApproval(row)));
  } catch (err) {
    return next(err);
  }
}

async function deleteApproval(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'companyId is required'));
    }
    const deleted = await approvalService.deleteApproval(companyId, req.params.id);
    if (!deleted) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Approval not found'));
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function listRequests(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'companyId is required'));
    }
    const { page, limit, offset } = getPaginationParams(req.query);
    const { approvalId, status } = req.query;

    const { rows, totalItems } = await approvalService.listRequests(companyId, { limit, offset, approvalId, status });
    const meta = buildPaginationMeta(page, limit, totalItems);

    return res.json(envelopeSuccess(rows.map(mapRequest), meta));
  } catch (err) {
    return next(err);
  }
}

async function createRequest(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'companyId is required'));
    }

    const errors = validateRequiredFields(req.body, ['approvalId', 'requesterId', 'priority']);
    const priorityError = validateEnum(req.body.priority, ['low', 'medium', 'high']);
    if (priorityError) errors.push({ field: 'priority', message: priorityError });
    if (errors.length) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Invalid data', errors));
    }

    const row = await approvalService.createRequest(companyId, req.body);
    return res.status(201).json(envelopeSuccess(mapRequest(row)));
  } catch (err) {
    return next(err);
  }
}

async function getRequest(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'companyId is required'));
    }
    const request = await approvalService.getRequestById(companyId, req.params.id);
    if (!request) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Request not found'));
    }
    const responses = await approvalService.listResponses(companyId, req.params.id);
    const mapped = mapRequest(request);
    mapped.responses = responses.map(mapResponse);

    return res.json(envelopeSuccess(mapped));
  } catch (err) {
    return next(err);
  }
}

async function updateRequestStatus(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'companyId is required'));
    }

    const errors = validateRequiredFields(req.body, ['status']);
    const statusError = validateEnum(req.body.status, ['pending', 'approved', 'rejected', 'in_review']);
    if (statusError) errors.push({ field: 'status', message: statusError });
    if (errors.length) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Invalid data', errors));
    }

    const row = await approvalService.updateRequestStatus(companyId, req.params.id, req.body.status);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Request not found'));
    }
    return res.json(envelopeSuccess(mapRequest(row)));
  } catch (err) {
    return next(err);
  }
}

async function addResponse(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'companyId is required'));
    }

    const errors = validateRequiredFields(req.body, ['approverId', 'decision']);
    const decisionError = validateEnum(req.body.decision, ['approved', 'rejected', 'pending']);
    if (decisionError) errors.push({ field: 'decision', message: decisionError });
    if (errors.length) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Invalid data', errors));
    }

    const row = await approvalService.addResponse(companyId, req.params.requestId, req.body);
    return res.status(201).json(envelopeSuccess(mapResponse(row)));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listApprovals,
  createApproval,
  updateApproval,
  deleteApproval,
  listRequests,
  createRequest,
  getRequest,
  updateRequestStatus,
  addResponse
};
