export const auth = (req, res, next) => {
  req.user = {
    id: "USER_UUID",
    empresa_id: "EMPRESA_UUID",
    role: "admin"
  };

  next();
};
