import type { Context } from 'hono';
import type { CreateUserBody, UpdateUserBody } from '../schemas/auth.ts';
import UserService from '../services/user.ts';

const UserController = {
  create: async (c: Context) => {
    try {
      const { image, ...body } = c.req.valid('form' as never) as CreateUserBody;
      const user = await UserService.create(body);
      return c.json({ success: true, user }, 201);
    } catch (e: any) {
      if (e.code === 11000) {
        let message: string | undefined;
        if (e.keyPattern.email) message = 'Email address already in use';
        else if (e.keyPattern.phone) message = 'Phone number already in use';
        else if (e.keyPattern.username) message = 'Username already in use';
        if (message) {
          return c.json({ success: false, message }, 400);
        }
      }
      throw e;
    }
  },
  async getAll(c: Context) {
    const { role, status, category, search, page = 1, limit = 20 } = c.req.query();
    const users = await UserService.getAll({
      status,
      search,
      category,
      role,
      page,
      limit,
    });
    const total = await UserService.getCount({ status, search, role, category });
    const fetched = page && limit ? +page * +limit : 0;
    const remains = Math.max(total - fetched, 0);
    const next = remains >= 1 ? +page + 1 : null;
    return c.json({ success: true, next, total, users }, 200);
  },
  async getUser(c: Context) {
    const username = c.req.param('username');
    const user = await UserService.getOne({ username });
    if (!user) {
      return c.json({ success: false, message: 'User not found' }, 404);
    }
    return c.json({ success: true, user }, 200);
  },
  async getUserByID(c: Context) {
    const id = c.req.param('id');
    const user = await UserService.getOne({ _id: id });
    if (!user) {
      return c.json({ success: false, message: 'User not found' }, 404);
    }
    return c.json({ success: true, user }, 200);
  },
  async update(c: Context) {
    const id = c.req.param('id');
    const { image, ...body } = c.req.valid('form' as never) as UpdateUserBody;
    const user = await UserService.update(id, body);
    if (!user) {
      return c.json({ success: false, message: 'Could not update user' }, 400);
    }
    return c.json({ success: true, user }, 200);
  },
  async delete(c: Context) {
    const id = c.req.param('id');
    const user = await UserService.delete(id);
    if (!user) {
      return c.json({ success: false, message: 'Could not delete user' }, 400);
    }
    return c.json({ success: true, user }, 200);
  },
};

export default UserController;
