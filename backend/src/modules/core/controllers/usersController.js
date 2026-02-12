const { randomUUID } = require('crypto');
const bcrypt = require('bcrypt');
const supabase = require('../../../config/supabase');
const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');

// Regex más permisiva para UUIDs (acepta también UUIDs dummy para testing)
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUuid(value) {
  return typeof value === 'string' && UUID_REGEX.test(value);
}

// GET /api/v1/core/usuarios - Listar usuarios de la empresa
async function getUsers(req, res, next) {
  try {
    const companyId = req.user?.companyId;
    if (!companyId || !isUuid(companyId)) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    const { data, error } = await supabase
      .from('core_users')
      .select('id, email, is_active, created_at, updated_at, last_login_at')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[getUsers] Database error:', error);
      return res.status(500).json(envelopeError('DATABASE_ERROR', 'Error fetching users', error.message));
    }

    return res.json(envelopeSuccess(data || []));
  } catch (err) {
    console.error('[getUsers] Unexpected error:', err);
    return next(err);
  }
}

// GET /api/v1/core/usuarios/:id - Obtener un usuario específico
async function getUserById(req, res, next) {
  try {
    const companyId = req.user?.companyId;
    const userId = req.params.id;

    if (!companyId || !isUuid(companyId)) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    if (!isUuid(userId)) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Invalid user id'));
    }

    const { data, error } = await supabase
      .from('core_users')
      .select(`
        id,
        email,
        is_active,
        created_at,
        updated_at,
        last_login_at,
        mfa_enabled
      `)
      .eq('id', userId)
      .eq('company_id', companyId)
      .single();

    if (error || !data) {
      return res.status(404).json(envelopeError('NOT_FOUND', 'User not found'));
    }

    return res.json(envelopeSuccess(data));
  } catch (err) {
    return next(err);
  }
}

// POST /api/v1/core/usuarios - Crear un nuevo usuario
async function createUser(req, res, next) {
  try {
    const companyId = req.user?.companyId;
    const { email, password, first_name, last_name, is_active } = req.body;

    if (!companyId || !isUuid(companyId)) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    // Validar campos requeridos
    const missing = [];
    if (!email) missing.push({ field: 'email' });
    if (!password) missing.push({ field: 'password' });
    if (!first_name) missing.push({ field: 'first_name' });
    if (!last_name) missing.push({ field: 'last_name' });

    if (missing.length) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Missing required fields', missing));
    }

    // Verificar si el email ya existe
    const { data: existing } = await supabase
      .from('core_users')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Email already exists'));
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = randomUUID();

    // Crear el usuario
    const { data, error } = await supabase
      .from('core_users')
      .insert([
        {
          id: userId,
          company_id: companyId,
          email,
          password: hashedPassword,
          first_name,
          last_name,
          is_active: typeof is_active === 'boolean' ? is_active : true
        }
      ])
      .select(`
        id,
        email,
        first_name,
        last_name,
        is_active,
        created_at
      `)
      .single();

    if (error) {
      return res.status(500).json(envelopeError('DATABASE_ERROR', 'Error creating user', error.message));
    }

    return res.status(201).json(envelopeSuccess(data));
  } catch (err) {
    return next(err);
  }
}

// PATCH /api/v1/core/usuarios/:id - Actualizar un usuario
async function updateUser(req, res, next) {
  try {
    const companyId = req.user?.companyId;
    const userId = req.params.id;
    const { email, password, first_name, last_name, is_active } = req.body;

    if (!companyId || !isUuid(companyId)) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    if (!isUuid(userId)) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Invalid user id'));
    }

    // Verificar que el usuario existe y pertenece a la empresa
    const { data: existing } = await supabase
      .from('core_users')
      .select('id')
      .eq('id', userId)
      .eq('company_id', companyId)
      .single();

    if (!existing) {
      return res.status(404).json(envelopeError('NOT_FOUND', 'User not found'));
    }

    // Preparar los campos a actualizar
    const updates = { updated_at: new Date().toISOString() };
    if (email !== undefined) updates.email = email;
    if (first_name !== undefined) updates.first_name = first_name;
    if (last_name !== undefined) updates.last_name = last_name;
    if (typeof is_active === 'boolean') updates.is_active = is_active;
    if (password) {
      updates.password_hash = await bcrypt.hash(password, 10);
    }

    const { data, error } = await supabase
      .from('core_users')
      .update(updates)
      .eq('id', userId)
      .eq('company_id', companyId)
      .select(`
        id,
        email,
        first_name,
        last_name,
        is_active,
        updated_at
      `)
      .single();

    if (error) {
      return res.status(500).json(envelopeError('DATABASE_ERROR', 'Error updating user', error.message));
    }

    return res.json(envelopeSuccess(data));
  } catch (err) {
    return next(err);
  }
}

// DELETE /api/v1/core/usuarios/:id - Eliminar un usuario (soft delete)
async function deleteUser(req, res, next) {
  try {
    const companyId = req.user?.companyId;
    const userId = req.params.id;

    if (!companyId || !isUuid(companyId)) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    if (!isUuid(userId)) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Invalid user id'));
    }

    // Soft delete: marcar como inactivo
    const { data, error } = await supabase
      .from('core_users')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .eq('company_id', companyId)
      .select('id')
      .single();

    if (error || !data) {
      return res.status(404).json(envelopeError('NOT_FOUND', 'User not found'));
    }

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
