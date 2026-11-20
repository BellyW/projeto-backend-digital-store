import { Op } from 'sequelize';
import { z } from 'zod';
import { Category, Product, ProductImage, ProductOption } from '../models/index.js';

const schema = z.object({
  enabled: z.boolean().optional(), name: z.string().trim().min(1), slug: z.string().trim().min(1),
  useInMenu: z.boolean().optional(), stock: z.number().int().min(0).optional(), description: z.string().optional(),
  price: z.number().nonnegative(), priceWithDiscount: z.number().nonnegative(),
  categoryIds: z.array(z.number().int()).optional(),
  images: z.array(z.object({ enabled: z.boolean().optional(), path: z.string().min(1) })).optional(),
  options: z.array(z.object({ title: z.string(), shape: z.enum(['square', 'circle']).optional(), radius: z.number().int().optional(), type: z.enum(['text', 'color']).optional(), values: z.string() })).optional(),
});

async function applyRelations(product, data) {
  if (data.categoryIds) await product.setCategories(data.categoryIds);
  if (data.images) { await ProductImage.destroy({ where: { product_id: product.id } }); await ProductImage.bulkCreate(data.images.map((item) => ({ ...item, product_id: product.id }))); }
  if (data.options) { await ProductOption.destroy({ where: { product_id: product.id } }); await ProductOption.bulkCreate(data.options.map((item) => ({ ...item, product_id: product.id }))); }
}

const includes = [{ model: Category, through: { attributes: [] } }, { model: ProductImage, as: 'images' }, { model: ProductOption, as: 'options' }];

export async function searchProducts(req, res, next) {
  try {
    const limit = Math.min(Number(req.query.limit) || 12, 100); const page = Math.max(Number(req.query.page) || 1, 1); const term = (req.query.search || '').trim();
    const where = { enabled: true }; if (term) Object.assign(where, { [Op.or]: [{ name: { [Op.like]: `%${term}%` } }, { description: { [Op.like]: `%${term}%` } }] });
    const result = await Product.findAndCountAll({ where, limit, offset: (page - 1) * limit, order: [['id', 'ASC']] });
    res.json({ data: result.rows, total: result.count, limit, page });
  } catch (e) { next(e); }
}

export async function getProduct(req, res, next) { try { const item = await Product.findByPk(req.params.id); if (!item) return res.status(404).json({ error: 'Produto não encontrado' }); res.json(item); } catch (e) { next(e); } }
export async function createProduct(req, res, next) { try { const data = schema.parse(req.body); const item = await Product.create({ enabled: data.enabled, name: data.name, slug: data.slug, useInMenu: data.useInMenu, stock: data.stock, description: data.description, price: data.price, priceWithDiscount: data.priceWithDiscount }); await applyRelations(item, data); res.status(201).json(await Product.findByPk(item.id)); } catch (e) { next(e); } }
export async function updateProduct(req, res, next) { try { const data = schema.partial().parse(req.body); const item = await Product.findByPk(req.params.id); if (!item) return res.status(404).json({ error: 'Produto não encontrado' }); await item.update(data); await applyRelations(item, data); res.json(await Product.findByPk(item.id)); } catch (e) { next(e); } }
export async function deleteProduct(req, res, next) { try { const item = await Product.findByPk(req.params.id); if (!item) return res.status(404).json({ error: 'Produto não encontrado' }); await item.destroy(); res.status(204).send(); } catch (e) { next(e); } }
