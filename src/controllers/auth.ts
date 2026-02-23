import type { Context } from 'hono';
import { UserRoles } from '../config/constants.ts';
import { signToken } from '../helpers/auth.ts';
import type { ChangePasswordBody, LoginBody, SignUpBody, UpdateUserBody } from '../schemas/auth.ts';
import AuthService from '../services/auth.ts';
import UserService from '../services/user.ts';

const AuthController = {
  async signup(c: Context) {
    try {
      const body = c.req.valid('json' as never) as SignUpBody;
      const user = await UserService.create({ ...body });
      const token = await signToken({ id: user.id, role: user.role });
      return c.json({ success: true, user, token }, 201);
    } catch (e: any) {
      console.log(e);
      if (e.code === 11000) {
        let message = 'Something went wrong, please try again';
        if (e.keyPattern.phone) message = 'Phone number already in use';
        else if (e.keyPattern.username) message = 'Username already in use';
        if (message) return c.json({ success: false, message }, 400);
      }
      throw e;
    }
  },
  async login(c: Context) {
    const { phone, password, remember, admin } = c.req.valid('json' as never) as LoginBody;
    const user = await UserService.getOne({ phone }, { returnPassword: true });
    if (!user) {
      return c.json({ success: false, message: 'Phone number or password incorrect' }, 400);
    }
    if (admin && user.role !== UserRoles.ADMIN) {
      return c.json({ success: false, message: 'Phone number or password incorrect' }, 400);
    }
    if (!user.password) {
      return c.json({ success: false, message: 'Phone number or password incorrect' }, 400);
    }
    const correct = user.comparePasswords(password);
    if (!correct) {
      return c.json({ success: false, message: 'Phone number or password incorrect' }, 400);
    }
    await AuthService.updateUserLastLogin(user);
    const token = await signToken({ id: user.id, role: user.role }, remember ? '30d' : '1d');
    const safeUser = user.toObject();
    delete (safeUser as any).password;
    return c.json({ success: true, user: safeUser, token }, 200);
  },
  async getProfile(c: Context) {
    const id = c.get('user').id;
    const user = await UserService.getOne({ _id: id });
    if (!user) {
      return c.json({ success: false, message: 'User not found' }, 400);
    }
    return c.json({ success: true, user }, 200);
  },
  async changePassword(c: Context) {
    const id = c.get('user').id;
    const { currentPassword, newPassword } = c.req.valid('json' as never) as ChangePasswordBody;
    const user = await UserService.getOne({ _id: id }, { returnPassword: true });
    if (!user) {
      return c.json({ success: false, message: 'User not found' }, 404);
    }
    const match = user.comparePasswords(currentPassword);
    if (!match) {
      return c.json({ success: false, message: 'Current password is not correct' }, 400);
    }
    if (newPassword === currentPassword) {
      return c.json(
        {
          success: false,
          message: 'Your new password cannot be the same as your current password',
        },
        400,
      );
    }
    user.password = newPassword;
    await user.save();
    return c.json({ success: true, message: 'Password changed' }, 200);
  },
  async updateProfile(c: Context) {
    try {
      const id = c.get('user').id;
      const { image, ...body } = c.req.valid('form' as never) as UpdateUserBody;
      const user = await UserService.update(id, body);
      if (!user) {
        return c.json({ success: false, message: 'User not found' }, 404);
      }
      return c.json({ success: true, user, message: 'Profile updated' }, 200);
    } catch (e: any) {
      if (e.code === 11000) {
        let message = 'Something went wrong, please try again';
        if (e.keyPattern.phone) message = 'Phone number already in use';
        else if (e.keyPattern.username) message = 'Username already in use';
        if (message) return c.json({ success: false, message }, 400);
      }
      throw e;
    }
  },
};

export default AuthController;
