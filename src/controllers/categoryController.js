import { z } from 'zod';
import { Category } from '../models/index.js';

const schema = z.object({ name: z.string().trim().min(1), slug: z.string().trim().min(1), useInMenu: z.boolean().optional() });

export async function listCategories(req, res, next) { try { res.json(await Category.findAll({ order: [['id', 'ASC']] })); } catch (e) { next(e); } }
export async function getCategory(req, res, next) { try { const item = await Category.findByPk(req.params.id); if (!item) return res.status(404).json({ error: 'Categoria não encontrada' }); res.json(item); } catch (e) { next(e); } }
export async function createCategory(req, res, next) { try { res.status(201).json(await Category.create(schema.parse(req.body))); } catch (e) { next(e); } }
export async function updateCategory(req, res, next) { try { const item = await Category.findByPk(req.params.id); if (!item) return res.status(404).json({ error: 'Categoria não encontrada' }); await item.update(schema.parse(req.body)); res.json(item); } catch (e) { next(e); } }
export async function deleteCategory(req, res, next) { try { const item = await Category.findByPk(req.params.id); if (!item) return res.status(404).json({ error: 'Categoria não encontrada' }); await item.destroy(); res.status(204).send(); } catch (e) { next(e); } }
