import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import * as User from '../models/user.model.js';
import { httpError } from '../utils/httpError.js';

const signToken = (user) => jwt.sign({ id: user.id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password) throw httpError(400, 'name, email and password are required');
    if (password.length < 6) throw httpError(400, 'Password must be at least 6 characters');

    const normalized = email.trim().toLowerCase();
    if (await User.findByEmail(normalized)) throw httpError(409, 'Email already registered');

    const user = await User.create({
      name: name.trim(),
      email: normalized,
      passwordHash: await bcrypt.hash(password, 10),
    });
    res.status(201).json({ token: signToken(user), user });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw httpError(400, 'email and password are required');

    const found = await User.findByEmail(email.trim().toLowerCase());
    if (!found || !(await bcrypt.compare(password, found.password_hash))) {
      throw httpError(401, 'Invalid email or password');
    }
    const { password_hash, ...user } = found;
    res.json({ token: signToken(user), user });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw httpError(404, 'User not found');
    res.json({ user });
  } catch (err) {
    next(err);
  }
}
