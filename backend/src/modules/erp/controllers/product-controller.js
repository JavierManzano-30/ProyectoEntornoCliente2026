const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const { validateRequiredFields, validateEnum } = require('../../../utils/validation');
const productService = require('../services/product-service');

function resolveCompanyId(req) {
  return (
    req.user?.companyId
    || req.user?.company_id
    || req.headers['x-company-id']
    || req.query.companyId
    || req.query.company_id
    || null
  );
}

function mapProduct(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    productCode: row.product_code,
    name: row.name,
    description: row.description,
    categoryId: row.category_id,
    costPrice: row.cost_price,
    salePrice: row.sale_price,
    profitMargin: row.profit_margin,
    unitOfMeasure: row.unit_of_measure,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapCategory(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    name: row.name,
    description: row.description,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function listProducts(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const companyId = resolveCompanyId(req);
    const filters = {
      status: req.query.status,
      categoryId: req.query.categoryId,
      search: req.query.search
    };
    const { rows, totalItems } = await productService.listProducts(companyId, { filters, limit, offset });
    const meta = buildPaginationMeta(page, limit, totalItems);
    return res.json(envelopeSuccess(rows.map(mapProduct), meta));
  } catch (err) {
    return next(err);
  }
}

async function getProduct(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    const row = await productService.getProductById(companyId, req.params.id);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Product not found'));
    }
    return res.json(envelopeSuccess(mapProduct(row)));
  } catch (err) {
    return next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const errors = validateRequiredFields(req.body, ['productCode', 'name', 'costPrice', 'salePrice', 'status']);
    if (errors.length) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Invalid data', errors));
    }
    const statusErr = validateEnum(req.body.status, ['active', 'inactive', 'discontinued']);
    if (statusErr) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', statusErr));
    }
    const companyId = resolveCompanyId(req);
    const row = await productService.createProduct(companyId, req.body);
    return res.status(201).json(envelopeSuccess(mapProduct(row)));
  } catch (err) {
    return next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const statusErr = validateEnum(req.body.status, ['active', 'inactive', 'discontinued']);
    if (statusErr) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', statusErr));
    }
    const companyId = resolveCompanyId(req);
    const row = await productService.updateProduct(companyId, req.params.id, req.body);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Product not found'));
    }
    return res.json(envelopeSuccess(mapProduct(row)));
  } catch (err) {
    return next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    const row = await productService.deleteProduct(companyId, req.params.id);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Product not found'));
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function listCategories(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const companyId = resolveCompanyId(req);
    const { rows, totalItems } = await productService.listCategories(companyId, { limit, offset });
    const meta = buildPaginationMeta(page, limit, totalItems);
    return res.json(envelopeSuccess(rows.map(mapCategory), meta));
  } catch (err) {
    return next(err);
  }
}

async function createCategory(req, res, next) {
  try {
    const errors = validateRequiredFields(req.body, ['name']);
    if (errors.length) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Invalid data', errors));
    }
    const companyId = resolveCompanyId(req);
    const row = await productService.createCategory(companyId, req.body);
    return res.status(201).json(envelopeSuccess(mapCategory(row)));
  } catch (err) {
    return next(err);
  }
}

async function updateCategory(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    const row = await productService.updateCategory(companyId, req.params.id, req.body);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Categoria no encontrada'));
    }
    return res.json(envelopeSuccess(mapCategory(row)));
  } catch (err) {
    return next(err);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    const row = await productService.deleteCategory(companyId, req.params.id);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Categoria no encontrada'));
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
