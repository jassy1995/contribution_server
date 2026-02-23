import CategoryDao from '../dao/category.ts';
import type { CreateCategoryBody, UpdateCategoryBody } from '../schemas/category.ts';

const CategoryService = {
  create(category: Omit<CreateCategoryBody, 'image'> & { slug: string }) {
    return CategoryDao.create(category);
  },
  getAll() {
    return CategoryDao.getAll();
  },
  getAllSimple() {
    return CategoryDao.getAllSimple();
  },
  getCount(args?: any) {
    return CategoryDao.getCount(args);
  },
  getOne(args: any) {
    return CategoryDao.getOne(args);
  },
  update(id: string, data: UpdateCategoryBody) {
    return CategoryDao.update(id, data);
  },
};

export default CategoryService;
