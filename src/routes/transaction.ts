import { Hono } from 'hono';
import TransactionController from '../controllers/transaction.ts';
import authenticate from '../middlewares/authenticate.ts';
import validate from '../middlewares/validate.ts';
import {
  createTransactionSchema,
  getTransactionSchema,
  updateTransactionSchema,
} from '../schemas/transaction.ts';

const router = new Hono();

router.post(
  '/',
  authenticate.admin,
  validate('json', createTransactionSchema),
  TransactionController.create,
);
router.get(
  '/',
  authenticate.admin,
  validate('query', getTransactionSchema),
  TransactionController.getAll,
);
router.get(
  '/:id',
  authenticate.admin,
  validate('query', getTransactionSchema),
  TransactionController.getOne,
);
router.patch(
  '/:id',
  authenticate.admin,
  validate('json', updateTransactionSchema),
  TransactionController.update,
);
router.delete('/:id', authenticate.admin, TransactionController.delete);

export default router;
