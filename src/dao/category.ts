import { isValidObjectId } from 'mongoose';
import Category from '../models/category.ts';
import type { CreateCategoryBody, UpdateCategoryBody } from '../schemas/category.ts';

const CategoryDao = {
  async create(category: Omit<CreateCategoryBody, 'image'> & { slug: string }) {
    return await Category.create(category);
  },
  getAll() {
    return Category.find();
  },
  getAllSimple() {
    return Category.find();
  },
  getCount(args: any = {}) {
    return Category.countDocuments(args).exec();
  },
  getOne(args: any) {
    if (args._id && !isValidObjectId(args._id)) return null;
    return Category.findOne(args);
  },
  update(id: string, data: UpdateCategoryBody) {
    if (!isValidObjectId(id)) return null;
    return Category.findByIdAndUpdate(id, data, { new: true });
  },
  deleteById(id: string) {
    if (!isValidObjectId(id)) return null;
    return Category.findOneAndDelete({ _id: id });
  },
};

export default CategoryDao;
