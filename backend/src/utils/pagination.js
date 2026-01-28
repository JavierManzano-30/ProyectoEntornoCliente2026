function getPaginationParams(query) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

function buildPaginationMeta(page, limit, totalItems) {
  const totalPages = Math.max(Math.ceil(totalItems / limit), 1);
  return { page, limit, totalItems, totalPages };
}

module.exports = { getPaginationParams, buildPaginationMeta };
