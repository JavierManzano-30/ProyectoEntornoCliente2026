export const companyScope = (req, res, next) => {

  const empresaId = req.user?.empresa_id;

  if (!empresaId) {
    return res.status(403).json({ error: "Empresa no definida" });
  }

  req.empresaId = empresaId;
  next();
};
