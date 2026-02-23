import type { Context } from 'hono';
import { slugify } from '../lib/utils.ts';
import type { CreateCategoryBody, UpdateCategoryBody } from '../schemas/category';
import CategoryService from '../services/category.ts';

const CategoryController = {
  async create(c: Context) {
    const payload = c.req.valid('json' as never) as CreateCategoryBody;
    const category = await CategoryService.create({ ...payload, slug: slugify(payload.name) });
    return c.json({ success: true, category }, 201);
  },
  async getAll(c: Context) {
    const categories = await CategoryService.getAll();
    return c.json({ success: true, categories });
  },
  async update(c: Context) {
    const id = c.req.param('id');
    const payload = c.req.valid('json' as never) as UpdateCategoryBody;
    const category = await CategoryService.update(id, payload);
    if (!category) {
      return c.json({ success: false, message: 'Could not update category' }, 400);
    }
    return c.json({ success: true, category }, 200);
  },
};

export default CategoryController;
