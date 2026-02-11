function companyScope(req, res, next) {
  const companyId = req.user?.companyId || req.user?.company_id || null;

  if (!companyId) {
    return res.status(403).json({ error: 'Company not defined in auth context' });
  }

  req.companyId = companyId;
  return next();
}

module.exports = { companyScope };
