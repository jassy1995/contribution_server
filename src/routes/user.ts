import { Hono } from 'hono';
import UserController from '../controllers/user.ts';
import authenticate from '../middlewares/authenticate.ts';
import validate from '../middlewares/validate.ts';
import { getUserSchema, updateUserSchema } from '../schemas/auth.ts';

const router = new Hono();

router.get('/', authenticate.admin, validate('query', getUserSchema), UserController.getAll);
router.get('/:username', UserController.getUser);
router.get('/user-by-id/:id', UserController.getUserByID);
router.patch(
  '/users/:id',
  authenticate.admin,
  validate('form', updateUserSchema),
  UserController.update,
);
router.delete('/users/:id', authenticate.admin, UserController.delete);

export default router;
