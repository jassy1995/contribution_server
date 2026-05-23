import ContributionDao from '../../dao/contribution';
import TransactionDao from '../../dao/transaction';
import UserDao from '../../dao/user';
import { formatAmount } from '../../helpers/currency';
import { isAllTimeContributionQuery } from '../../helpers/query-intent';

const describePeriod = (args: { month?: number; year?: number }) => {
  if (args.month && args.year) {
    return { period: 'month' as const, month: args.month, year: args.year };
  }
  if (args.year) {
    return { period: 'year' as const, year: args.year };
  }
  return { period: 'all_time' as const };
};

const getContributionSumArgs = (
  userMessage: string,
  args: { month?: number; year?: number },
  forceAllTime = false,
) => {
  if (forceAllTime || isAllTimeContributionQuery(userMessage) || (!args.month && !args.year)) {
    return {};
  }
  return { month: args.month, year: args.year };
};

const executeToolCall = async (
  name: string,
  args: Record<string, any>,
  userMessage = '',
): Promise<string> => {
  try {
    switch (name) {
      case 'get_debit_total': {
        const result = await TransactionDao.getSum({
          type: 'debit',
          month: args.month,
          year: args.year,
        });
        const total = result[0]?.total ?? 0;
        return JSON.stringify({
          total,
          totalFormatted: formatAmount(total),
          currency: 'NGN',
          type: 'debit',
          ...describePeriod(args),
        });
      }

      case 'get_credit_total': {
        const result = await TransactionDao.getSum({
          type: 'credit',
          month: args.month,
          year: args.year,
        });
        const total = result[0]?.total ?? 0;
        return JSON.stringify({
          total,
          totalFormatted: formatAmount(total),
          currency: 'NGN',
          type: 'credit',
          ...describePeriod(args),
        });
      }

      case 'get_contribution_grand_total':
      case 'get_contribution_total': {
        const sumArgs = getContributionSumArgs(
          userMessage,
          args,
          name === 'get_contribution_grand_total',
        );
        const result = await ContributionDao.getSum(sumArgs);
        const total = result?.[0]?.total ?? 0;
        return JSON.stringify({
          total,
          totalFormatted: formatAmount(total),
          currency: 'NGN',
          scope: 'entire contributions collection',
          ...describePeriod(sumArgs),
        });
      }

      case 'get_user_contribution': {
        const user = await UserDao.getOne({
          firstName: { $regex: `^${args.firstName}$`, $options: 'i' },
          lastName: { $regex: `^${args.lastName}$`, $options: 'i' },
        });
        if (!user) {
          return JSON.stringify({
            error: `No member found with the name "${args.firstName} ${args.lastName}".`,
          });
        }
        const sumArgs = getContributionSumArgs(userMessage, args);
        const result = await ContributionDao.getSum({
          contributor: user._id.toString(),
          ...sumArgs,
        });
        const total = result?.[0]?.total ?? 0;
        return JSON.stringify({
          total,
          totalFormatted: formatAmount(total),
          currency: 'NGN',
          member: { firstName: user.firstName, lastName: user.lastName, username: user.username },
          ...describePeriod(sumArgs),
        });
      }

      case 'list_contributors': {
        const sumArgs = getContributionSumArgs(userMessage, args);
        const contributors = await ContributionDao.getSumByContributor(sumArgs);
        return JSON.stringify({
          contributors: contributors.map((c: any) => ({
            ...c,
            totalFormatted: formatAmount(c.total),
          })),
          currency: 'NGN',
          ...describePeriod(sumArgs),
        });
      }

      default:
        return JSON.stringify({ error: `Unknown tool: ${name}` });
    }
  } catch (err: any) {
    return JSON.stringify({ error: err?.message ?? 'An error occurred while fetching data.' });
  }
};

export default executeToolCall;
