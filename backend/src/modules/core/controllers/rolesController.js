const { randomUUID } = require('crypto');
const supabase = require('../../../config/supabase');
const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');

// Regex más permisiva para UUIDs (acepta también UUIDs dummy para testing)
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUuid(value) {
  return typeof value === 'string' && UUID_REGEX.test(value);
}

// GET /api/v1/core/roles - Listar roles de la empresa
async function getRoles(req, res, next) {
  try {
    const companyId = req.user?.companyId;
    if (!companyId || !isUuid(companyId)) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    const { data, error } = await supabase
      .from('core_roles')
      .select('*')
      .eq('company_id', companyId)
      .order('name', { ascending: true });

    if (error) {
      return res.status(500).json(envelopeError('DATABASE_ERROR', 'Error fetching roles', error.message));
    }

    return res.json(envelopeSuccess(data || []));
  } catch (err) {
    return next(err);
  }
}

// GET /api/v1/core/roles/:id - Obtener un rol específico
async function getRoleById(req, res, next) {
  try {
    const companyId = req.user?.companyId;
    const roleId = req.params.id;

    if (!companyId || !isUuid(companyId)) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    if (!isUuid(roleId)) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Invalid role id'));
    }

    const { data, error } = await supabase
      .from('core_roles')
      .select('*')
      .eq('id', roleId)
      .eq('company_id', companyId)
      .single();

    if (error || !data) {
      return res.status(404).json(envelopeError('NOT_FOUND', 'Role not found'));
    }

    return res.json(envelopeSuccess(data));
  } catch (err) {
    return next(err);
  }
}

// POST /api/v1/core/roles - Crear un nuevo rol
async function createRole(req, res, next) {
  try {
    const companyId = req.user?.companyId;
    const { name, description, permissions } = req.body;

    if (!companyId || !isUuid(companyId)) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    if (!name) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Missing required field: name'));
    }

    const roleId = randomUUID();

    const { data, error } = await supabase
      .from('core_roles')
      .insert([
        {
          id: roleId,
          company_id: companyId,
          name,
          description: description || null,
          permissions: permissions || {}
        }
      ])
      .select('*')
      .single();

    if (error) {
      return res.status(500).json(envelopeError('DATABASE_ERROR', 'Error creating role', error.message));
    }

    return res.status(201).json(envelopeSuccess(data));
  } catch (err) {
    return next(err);
  }
}

// PATCH /api/v1/core/roles/:id - Actualizar un rol
async function updateRole(req, res, next) {
  try {
    const companyId = req.user?.companyId;
    const roleId = req.params.id;
    const { name, description, permissions } = req.body;

    if (!companyId || !isUuid(companyId)) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    if (!isUuid(roleId)) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Invalid role id'));
    }

    const updates = { updated_at: new Date().toISOString() };
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (permissions !== undefined) updates.permissions = permissions;

    const { data, error } = await supabase
      .from('core_roles')
      .update(updates)
      .eq('id', roleId)
      .eq('company_id', companyId)
      .select('*')
      .single();

    if (error || !data) {
      return res.status(404).json(envelopeError('NOT_FOUND', 'Role not found'));
    }

    return res.json(envelopeSuccess(data));
  } catch (err) {
    return next(err);
  }
}

// DELETE /api/v1/core/roles/:id - Eliminar un rol
async function deleteRole(req, res, next) {
  try {
    const companyId = req.user?.companyId;
    const roleId = req.params.id;

    if (!companyId || !isUuid(companyId)) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    if (!isUuid(roleId)) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Invalid role id'));
    }

    // Verificar si hay usuarios asignados a este rol
    const { data: userRoles } = await supabase
      .from('core_user_roles')
      .select('id')
      .eq('role_id', roleId)
      .limit(1);

    if (userRoles && userRoles.length > 0) {
      return res.status(400).json(
        envelopeError('VALIDATION_ERROR', 'Cannot delete role with assigned users')
      );
    }

    const { data, error } = await supabase
      .from('core_roles')
      .delete()
      .eq('id', roleId)
      .eq('company_id', companyId)
      .select('id')
      .single();

    if (error || !data) {
      return res.status(404).json(envelopeError('NOT_FOUND', 'Role not found'));
    }

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
};
