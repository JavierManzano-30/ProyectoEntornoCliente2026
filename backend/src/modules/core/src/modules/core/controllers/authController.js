const { randomUUID } = require('crypto');
const supabase = require('../../../config/supabaseClient');
const { hashPassword, comparePassword, signToken } = require('../services/authService');

async function register(req, res) {
  const { company, user } = req.body || {};

  if (!company || !user) {
    return res.status(400).json({
      error: 'Missing company or user payload',
      example: {
        company: { name: 'Acme', tax_id: 'A123', domain: 'acme' },
        user: { email: 'admin@acme.com', password: 'secret' }
      }
    });
  }

  const { name, tax_id: taxId, domain, settings, is_active: isActive } = company;
  const { email, password } = user;

  if (!name || !taxId || !email || !password) {
    return res.status(400).json({
      error: 'Missing required fields (company.name, company.tax_id, user.email, user.password)'
    });
  }

  const companyId = randomUUID();
  const userId = randomUUID();
  const roleId = randomUUID();

  let createdCompany = false;
  let createdRole = false;
  let createdUser = false;
  let createdUserRole = false;

  try {
    const { error: companyError } = await supabase
      .from('core_companies')
      .insert([
        {
          id: companyId,
          name,
          tax_id: taxId,
          domain: domain || null,
          settings: settings || null,
          is_active: typeof isActive === 'boolean' ? isActive : true
        }
      ]);

    if (companyError) throw companyError;
    createdCompany = true;

    const { error: roleError } = await supabase
      .from('core_roles')
      .insert([
        {
          id: roleId,
          company_id: companyId,
          name: 'Admin',
          description: 'Default admin role',
          is_system: true
        }
      ]);

    if (roleError) throw roleError;
    createdRole = true;

    const passwordHash = await hashPassword(password);

    const { error: userError } = await supabase
      .from('core_users')
      .insert([
        {
          id: userId,
          company_id: companyId,
          email,
          password_hash: passwordHash,
          mfa_enabled: false,
          is_active: true
        }
      ]);

    if (userError) throw userError;
    createdUser = true;

    const { error: userRoleError } = await supabase
      .from('core_user_roles')
      .insert([
        {
          user_id: userId,
          role_id: roleId
        }
      ]);

    if (userRoleError) throw userRoleError;
    createdUserRole = true;

    const token = signToken({ userId, companyId, roleId });

    return res.status(201).json({
      token,
      userId,
      companyId,
      roleId
    });
  } catch (err) {
    if (createdUserRole) {
      await supabase.from('core_user_roles').delete().eq('user_id', userId);
    }
    if (createdUser) {
      await supabase.from('core_users').delete().eq('id', userId);
    }
    if (createdRole) {
      await supabase.from('core_roles').delete().eq('id', roleId);
    }
    if (createdCompany) {
      await supabase.from('core_companies').delete().eq('id', companyId);
    }

    return res.status(500).json({
      error: 'Registration failed',
      details: err.message || err
    });
  }
}

async function login(req, res) {
  const { email, password, companyId } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      error: 'Missing email or password'
    });
  }

  const query = supabase
    .from('core_users')
    .select('id, company_id, password_hash')
    .eq('email', email)
    .limit(1);

  if (companyId) {
    query.eq('company_id', companyId);
  }

  const { data: user, error } = await query.maybeSingle();

  if (error) {
    return res.status(500).json({ error: 'Login failed', details: error.message || error });
  }

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isValid = await comparePassword(password, user.password_hash);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const { data: userRole } = await supabase
    .from('core_user_roles')
    .select('role_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();

  const roleId = userRole ? userRole.role_id : null;

  const token = signToken({
    userId: user.id,
    companyId: user.company_id,
    roleId
  });

  await supabase
    .from('core_users')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', user.id);

  return res.status(200).json({
    token,
    userId: user.id,
    companyId: user.company_id,
    roleId
  });
}

module.exports = {
  register,
  login
};
