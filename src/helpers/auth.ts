import bcrypt from 'bcryptjs';
import { sign, verify } from 'hono/jwt';

const JWT_SECRET = process.env.JWT_SECRET || '';

const parseExpiry = (expiresIn: string): number => {
  const value = parseInt(expiresIn.slice(0, -1), 10);
  const multiplier = { s: 1, m: 60, h: 3600, d: 86400 }[expiresIn.slice(-1)] ?? 0;
  if (multiplier === 0) throw new Error(`Invalid expiresIn format: ${expiresIn}`);
  return value * multiplier;
};

export const signToken = async (
  payload: Record<string, unknown>,
  expiresIn = '1d',
): Promise<string> => {
  const exp = Math.floor(Date.now() / 1000) + parseExpiry(expiresIn);
  return await sign({ ...payload, exp }, JWT_SECRET, 'HS256');
};

export const verifyToken = (token: string) => {
  return verify(token, JWT_SECRET, 'HS256');
};

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comparePasswords = (password: string, hashedPassword: string) => {
  return bcrypt.compareSync(password, hashedPassword);
};
