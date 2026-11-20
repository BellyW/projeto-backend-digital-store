import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/index.js';

const createSchema = z.object({
  firstname: z.string().trim().min(1), surname: z.string().trim().min(1),
  email: z.string().email(), password: z.string().min(6), confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, { message: 'Senhas não conferem', path: ['confirmPassword'] });

const updateSchema = z.object({ firstname: z.string().trim().min(1).optional(), surname: z.string().trim().min(1).optional(), email: z.string().email().optional() }).partial();

export async function getUser(req, res, next) {
  try { const user = await User.findByPk(req.params.id, { attributes: ['id', 'firstname', 'surname', 'email'] }); if (!user) return res.status(404).json({ error: 'Usuário não encontrado' }); res.json(user); } catch (e) { next(e); }
}

export async function createUser(req, res, next) {
  try {
    const data = createSchema.parse(req.body);
    if (await User.findOne({ where: { email: data.email } })) return res.status(400).json({ error: 'E-mail já cadastrado' });
    const user = await User.create({ firstname: data.firstname, surname: data.surname, email: data.email, password: await bcrypt.hash(data.password, 10) });
    res.status(201).json({ id: user.id, firstname: user.firstname, surname: user.surname, email: user.email });
  } catch (e) { next(e); }
}

export async function updateUser(req, res, next) {
  try { const data = updateSchema.parse(req.body); const user = await User.findByPk(req.params.id); if (!user) return res.status(404).json({ error: 'Usuário não encontrado' }); await user.update(data); res.json({ id: user.id, firstname: user.firstname, surname: user.surname, email: user.email }); } catch (e) { next(e); }
}

export async function deleteUser(req, res, next) {
  try { const user = await User.findByPk(req.params.id); if (!user) return res.status(404).json({ error: 'Usuário não encontrado' }); await user.destroy(); res.status(204).send(); } catch (e) { next(e); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = z.object({ email: z.string().email(), password: z.string() }).parse(req.body);
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ error: 'E-mail ou senha inválidos' });
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'development-secret', { expiresIn: '1d' });
    res.json({ token });
  } catch (e) { next(e); }
}
