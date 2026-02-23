import type { Context } from 'hono';
import type {
  CreateTransactionBody,
  GetTransactionParams,
  UpdateTransactionBody,
} from '../schemas/transaction.ts';
import TransactionService from '../services/transaction.ts';

const TransactionController = {
  async create(c: Context) {
    const creator = (await c.get('user')).id;
    const payload = c.req.valid('json' as never) as CreateTransactionBody;
    const transaction = await TransactionService.create({ ...payload, creator });
    return c.json({ success: true, transaction }, 201);
  },
  async getAll(c: Context) {
    const params = c.req.valid('query' as never) as GetTransactionParams;
    const data = await TransactionService.getAll(params);
    return c.json({ success: true, ...data }, 200);
  },
  async getOne(c: Context) {
    const id = c.req.param('id');
    const transaction = await TransactionService.getOne({ _id: id });
    if (!transaction) {
      return c.json({ success: false, message: 'Transaction not found' }, 404);
    }
    return c.json({ success: true, transaction }, 200);
  },
  async update(c: Context) {
    const id = c.req.param('id');
    const payload = c.req.valid('json' as never) as UpdateTransactionBody;
    const transaction = await TransactionService.update({ _id: id }, payload);
    if (!transaction) {
      return c.json({ success: false, message: 'Could not update transaction' }, 400);
    }
    return c.json({ success: true, transaction }, 200);
  },
  async delete(c: Context) {
    const id = c.req.param('id');
    const transaction = await TransactionService.deleteById(id);
    if (!transaction) {
      return c.json({ success: false, message: 'Could not delete transaction' }, 400);
    }
    return c.json({ success: true, transaction }, 200);
  },
  async count(c: Context) {
    const params = c.req.valid('query' as never) as GetTransactionParams;
    const total = await TransactionService.getCount(params);
    return c.json({ success: true, total }, 200);
  },
};

export default TransactionController;
