/** biome-ignore-all assist/source/organizeImports: <explanation> */
import { Hono } from 'hono';
import validate from '../middlewares/validate.ts';
import { createCategorySchema, updateCategorySchema } from '../schemas/category.ts';
import CategoryController from '../controllers/category.ts';
import authenticate from '../middlewares/authenticate.ts';

const router = new Hono();

router.post(
  '/',
  authenticate.admin,
  validate('json', createCategorySchema),
  CategoryController.create,
);
router.get('/', authenticate.admin, CategoryController.getAll);
router.patch(
  '/:id',
  authenticate.admin,
  validate('json', updateCategorySchema),
  CategoryController.update,
);

export default router;
