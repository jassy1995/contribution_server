import { endOfMonth, endOfYear, startOfMonth, startOfYear } from 'date-fns';
import { isValidObjectId } from 'mongoose';
import Transaction from '../models/transaction.ts';
import type {
  CreateTransactionBody,
  GetTransactionParams,
  UpdateTransactionBody,
} from '../schemas/transaction.ts';

const capToNow = (date: Date): Date => (date > new Date() ? new Date() : date);

const buildTransactionDateFilter = (month?: number, year?: number) => {
  if (month && year) {
    const start = startOfMonth(new Date(year, month - 1, 1));
    const end = capToNow(endOfMonth(start));
    return { $gte: start, $lte: end };
  }

  if (year) {
    const start = startOfYear(new Date(year, 0, 1));
    const end = capToNow(endOfYear(start));
    return { $gte: start, $lte: end };
  }

  return undefined;
};

const TransactionDao = {
  create(data: CreateTransactionBody & { creator: string }) {
    return Transaction.create(data);
  },
  getAll(args: GetTransactionParams) {
    const { page = 1, limit = 10, ...params } = args;
    const filter: any = {};
    if (params.type) filter.type = params.type;
    if (params.search) filter.description = { $regex: params.search, $options: 'i' };
    const transactionDate = buildTransactionDateFilter(params.month, params.year);
    if (transactionDate) filter.transactionDate = transactionDate;
    const skip = page * limit - limit;
    return Transaction.find(filter).populate('creator').sort('-transactionDate').skip(skip).limit(limit);
  },
  getCount(args: any) {
    const { ...params } = args;
    const filter: any = {};
    if (params.type) filter.type = params.type;
    if (params.search) filter.description = { $regex: params.search, $options: 'i' };
    const transactionDate = buildTransactionDateFilter(params.month, params.year);
    if (transactionDate) filter.transactionDate = transactionDate;
    return Transaction.countDocuments(filter);
  },
  getSum(args: any) {
    const { ...params } = args;
    const match: any = {};
    if (params.type) match.type = params.type;
    if (params.search) match.description = { $regex: params.search, $options: 'i' };
    const transactionDate = buildTransactionDateFilter(params.month, params.year);
    if (transactionDate) match.transactionDate = transactionDate;
    return Transaction.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: '$transactionAmount' } } },
    ]);
  },
  getOne(args: any) {
    if (args._id && !isValidObjectId(args._id)) return null;
    return Transaction.findOne(args).populate('creator');
  },
  update(args: any, data: UpdateTransactionBody) {
    if (args._id && !isValidObjectId(args._id)) return null;
    return Transaction.findOneAndUpdate(args, data, { new: true });
  },
  deleteById(id: string) {
    if (!isValidObjectId(id)) return null;
    return Transaction.findOneAndDelete({ _id: id });
  },
};

export default TransactionDao;
