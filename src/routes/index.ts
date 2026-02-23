import { Hono } from 'hono';
import auth from './auth.ts';
import category from './category.ts';
import contribution from './contribution.ts';
import transaction from './transaction.ts';
import user from './user.ts';

const router = new Hono();

router.route('/contributions', contribution);
router.route('/transactions', transaction);
router.route('/users', user);
router.route('/auth', auth);
router.route('/categories', category);

export default router;
