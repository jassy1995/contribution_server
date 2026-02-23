import { Hono } from 'hono';
import AuthController from '../controllers/auth.ts';
import authenticate from '../middlewares/authenticate.ts';
import validate from '../middlewares/validate.ts';
import {
  changePasswordSchema,
  loginSchema,
  signUpSchema,
  updateProfileSchema,
} from '../schemas/auth.ts';

const router = new Hono();

router.post('/signup/phone', validate('json', signUpSchema), AuthController.signup);
router.post('/login/phone', validate('json', loginSchema), AuthController.login);
router.get('/profile', authenticate.user, AuthController.getProfile);
router.post(
  '/password/change',
  authenticate.user,
  validate('json', changePasswordSchema),
  AuthController.changePassword,
);
router.patch(
  '/profile',
  authenticate.user,
  validate('form', updateProfileSchema),
  AuthController.updateProfile,
);

export default router;
