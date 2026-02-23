import ContributionDao from '../dao/contribution.ts';
import type { CreateContributionBody, UpdateContributionBody } from '../schemas/contribution.ts';
import { TransactionType } from '../schemas/transaction.ts';
import TransactionService from './transaction.ts';
import UserService from './user.ts';

const ContributionService = {
  async create(args: CreateContributionBody) {
    return ContributionDao.create(args);
  },
  getOne(args: any) {
    return ContributionDao.getOne(args);
  },
  update(args: any, data: UpdateContributionBody) {
    return ContributionDao.update(args, data);
  },
  deleteById(id: string, contributor: string) {
    return ContributionDao.deleteById(id, contributor);
  },
  async getAll(args: any) {
    const { page = 1, limit = 20, ...params } = args;
    const contributions = await ContributionDao.getAll({ ...params, page, limit });
    const total = (await ContributionDao.getCount(params)) || 0;
    if (!page) return { contributions, total, next: null };
    const fetched = page && limit ? +page * +limit : 0;
    const remains = Math.max(total - fetched, 0);
    const next = remains >= 1 ? +page + 1 : null;
    return { contributions, total, next };
  },
  async getOverView() {
    const debit = await TransactionService.getSum({ type: TransactionType.DEBIT });
    const credit = await TransactionService.getSum({ type: TransactionType.CREDIT });
    const users = await UserService.getCount();
    const contributionSum = await ContributionDao.getSum({});
    const contribution = contributionSum?.[0]?.total || 0;
    const walletBalance = contribution + credit - debit;
    return {
      users,
      contributedAmount: contribution,
      walletBalance,
      debitTransaction: debit,
      creditTransaction: credit,
    };
  },
};

export default ContributionService;
