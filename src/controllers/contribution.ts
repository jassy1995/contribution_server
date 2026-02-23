import type { Context } from 'hono';
import { ContributionStatus } from '../config/constants.ts';
import type { CreateContributionBody, GetContributionParams } from '../schemas/contribution.ts';
import CategoryService from '../services/category.ts';
import ContributionService from '../services/contribution.ts';
import UserService from '../services/user.ts';

const ContributionController = {
  async create(c: Context) {
    const creator = (await c.get('user')).id;
    const payload = c.req.valid('json' as never) as CreateContributionBody;
    const category = await CategoryService.getOne({ _id: payload.category });
    if (!category) {
      return c.json({ success: false, message: 'Could not find category' }, 400);
    }
    const contributor = await UserService.getOne({ _id: payload.contributor });
    if (!contributor) {
      return c.json({ success: false, message: 'Could not find contributor' }, 400);
    }
    const computeStatus =
      payload.amount === 0
        ? ContributionStatus.PENDING
        : payload.amount < category.target
          ? ContributionStatus.PARTIAL
          : ContributionStatus.COMPLETED;
    const completePayload = {
      ...payload,
      creator,
      status: computeStatus,
    };
    const contribution = await ContributionService.create(completePayload);
    return c.json({ success: true, contribution }, 201);
  },
  async getAll(c: Context) {
    const params = c.req.valid('query' as never) as GetContributionParams;
    const contributions = await ContributionService.getAll({
      ...params,
      populate: ['category', 'contributor'],
    });
    return c.json({ success: true, ...contributions }, 200);
  },
  async getOverView(c: Context) {
    const overView = await ContributionService.getOverView();
    return c.json({ success: true, ...overView }, 200);
  },
};

export default ContributionController;
