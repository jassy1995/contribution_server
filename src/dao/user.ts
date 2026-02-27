import { isValidObjectId } from 'mongoose';
import User from '../models/user.ts';
import type { SignUpBody } from '../schemas/auth.ts';

const UserDao = {
  create(user: Omit<SignUpBody, 'password'>) {
    return User.create(user);
  },
  getAll({ status, role, category, search, page = 1, limit = 20 }: any) {
    const params: any = {};
    if (status) params.status = status;
    if (role) params.role = role;
    if (category) params.category = category;
    if (search) {
      params.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { middleName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    const skip = page * limit - limit;
    return User.find(params).populate('category').sort('-createdAt').limit(limit).skip(skip).exec();
  },
  getCount({ search, role, status, category }: any = {}) {
    const params: any = {};
    if (status) params.status = status;
    if (role) params.role = role;
    if (category) params.category = category;
    if (search) {
      params.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { middleName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    return User.countDocuments(params).exec();
  },
  getOne(args: any, options?: { returnPassword: boolean }) {
    if (args._id && !isValidObjectId(args._id)) return null;
    const builder = User.findOne(args);
    if (options?.returnPassword) builder.select('+password');
    return builder;
  },
  update(id: string, data: any) {
    if (!isValidObjectId(id)) return null;
    return User.findByIdAndUpdate(id, data, { new: true });
  },
  delete(id: string) {
    if (!isValidObjectId(id)) return null;
    return User.findOneAndDelete({ _id: id });
  },
};

export default UserDao;
