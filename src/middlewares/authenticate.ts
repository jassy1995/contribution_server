import type { Context, Next } from 'hono';
import { UserRoles } from '../config/constants.ts';
import { verifyToken } from '../helpers/auth.ts';

const user = async (c: Context, next: Next) => {
  try {
    const authorization = c.req.header('authorization');
    if (!authorization) return c.json({ success: false, message: 'Not authorized' }, 401);
    const token = authorization.replace(/Bearer /gi, '');
    const decoded = await verifyToken(token);
    c.set('user', decoded);
    await next();
  } catch (_) {
    return c.json({ success: false, message: 'Not authorized' }, 401);
  }
};

const admin = async (c: Context, next: Next) => {
  try {
    const authorization = c.req.header('authorization');
    if (!authorization) return c.json({ success: false, message: 'Not authorized' }, 401);
    const token = authorization.replace(/Bearer /gi, '');
    const decoded: any = await verifyToken(token);
    if (![UserRoles.ADMIN].includes(decoded.role)) {
      return c.json({ success: false, message: 'Not authorized' }, 401);
    }
    c.set('user', decoded);
    await next();
  } catch (_) {
    return c.json({ success: false, message: 'Not authorized' }, 401);
  }
};

const roles = (...roles: (typeof UserRoles)[keyof typeof UserRoles][]) => {
  return async (c: Context, next: Next) => {
    try {
      const authorization = c.req.header('authorization');
      if (!authorization) return c.json({ success: false, message: 'Not authorized' }, 401);
      const token = authorization.replace(/Bearer /gi, '');
      const decoded: any = await verifyToken(token);
      const exists = roles.some((role) => role === decoded.role);
      if (!exists) return c.json({ success: false, message: 'Not authorized' }, 403);
      c.set('user', decoded);
      await next();
    } catch (_) {
      return c.json({ success: false, message: 'Not authorized' }, 401);
    }
  };
};

export default { user, admin, roles };
