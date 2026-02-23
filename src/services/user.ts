import UserDao from '../dao/user.ts';
import { generateUsername } from '../lib/utils.ts';
import type { SignUpBody } from '../schemas/auth.ts';

const UserService = {
  async create(
    user: Omit<SignUpBody, 'password'> & {
      googleId?: string;
      facebookId?: string;
      twitterId?: string;
    },
  ) {
    // Generate username if not provided
    if (!user.username) {
      let attempts = 0;
      let generatedUsername = generateUsername(user.firstName, user.lastName);
      // Check for username conflicts and regenerate if needed
      while (attempts < 5) {
        const existingUser = await UserDao.getOne({ username: generatedUsername });
        if (!existingUser) {
          user.username = generatedUsername;
          break;
        }
        attempts++;
        generatedUsername = generateUsername(user.firstName, user.lastName);
      }
      // If we still don't have a unique username after 5 attempts, add timestamp
      if (!user.username) {
        user.username = `${generateUsername(user.firstName, user.lastName)}_${Date.now()}`;
      }
    }
    return await UserDao.create(user);
  },
  getAll(params: any) {
    return UserDao.getAll(params);
  },
  getCount(args?: any) {
    return UserDao.getCount(args);
  },
  getOne(args: any, options?: { returnPassword: boolean }) {
    return UserDao.getOne(args, options);
  },
  update(id: string, data: any) {
    return UserDao.update(id, data);
  },
  async delete(id: string) {
    const user = await UserDao.delete(id);
    if (!user) return null;
    return user;
  },
};

export default UserService;
