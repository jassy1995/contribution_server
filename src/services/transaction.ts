import TransactionDao from '../dao/transaction.ts';
import type { CreateTransactionBody, GetTransactionParams } from '../schemas/transaction.ts';

const TransactionService = {
  create(args: CreateTransactionBody & { creator: string }) {
    return TransactionDao.create(args);
  },
  getOne(args: any) {
    return TransactionDao.getOne(args);
  },
  update(args: any, data: any) {
    return TransactionDao.update(args, data);
  },
  deleteById(id: string) {
    return TransactionDao.deleteById(id);
  },
  async getAll(args: GetTransactionParams) {
    const { page = 1, limit = 20, ...params } = args;
    const transactions = await TransactionDao.getAll({ ...params, page, limit });
    const total = (await TransactionDao.getCount(params)) || 0;
    if (!page) return { transactions, total, next: null };
    const fetched = page && limit ? +page * +limit : 0;
    const remains = Math.max(total - fetched, 0);
    const next = remains >= 1 ? +page + 1 : null;
    return { transactions, total, next };
  },
  getCount(args: any = {}) {
    return TransactionDao.getCount(args);
  },
  async getSum(args: any = {}) {
    const res = await TransactionDao.getSum(args);
    return res?.[0]?.total || 0;
  },
};

export default TransactionService;
