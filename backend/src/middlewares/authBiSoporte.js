function auth(req, res, next) {
  req.user = {
    id: 'USER_UUID',
    company_id: 'COMPANY_UUID',
    role: 'admin'
  };
  next();
}

module.exports = { auth };
