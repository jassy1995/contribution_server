import { endOfMonth, startOfMonth } from 'date-fns';
import { isValidObjectId } from 'mongoose';
import Contribution from '../models/contribution.ts';
import type {
  CreateContributionBody,
  GetContributionParams,
  UpdateContributionBody,
} from '../schemas/contribution.ts';

const ContributionDao = {
  create(data: CreateContributionBody) {
    return Contribution.create(data);
  },
  getAll(args: GetContributionParams) {
    const { page = 1, limit = 10, ...params } = args;
    if (params.category && !isValidObjectId(params.category)) return null;
    const filter: any = params.category ? { category: params.category } : {};
    if (params.month && params.year) {
      const start = startOfMonth(new Date(params.year, params.month - 1, 1));
      const end = endOfMonth(start);
      filter.collectedAt = { $gte: start, $lte: end };
    }
    const skip = page * limit - limit;
    return Contribution.find(filter)
      .populate('category')
      .populate('contributor')
      .sort('-updatedAt')
      .skip(skip)
      .limit(limit);
  },
  getCount(args: any) {
    const { ...params } = args;
    if (params._id && !isValidObjectId(params._id)) return null;
    const filter: any = params.category ? { category: params.category } : {};
    if (params.status) filter.status = params.status;
    if (params.month && params.year) {
      const start = startOfMonth(new Date(params.year, params.month - 1, 1));
      const end = endOfMonth(start);
      filter.collectedAt = { $gte: start, $lte: end };
    }
    return Contribution.countDocuments(filter);
  },
  getSum(args: any) {
    const { ...params } = args;
    const match: any = {};
    if (params.category) {
      if (!isValidObjectId(params.category)) return null;
      match.category = params.category;
    }
    if (params.status) match.status = params.status;
    if (params.month && params.year) {
      const start = startOfMonth(new Date(params.year, params.month - 1, 1));
      const end = endOfMonth(start);
      match.collectedAt = { $gte: start, $lte: end };
    }
    return Contribution.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
  },
  getOne(args: any) {
    if (args._id && !isValidObjectId(args._id)) return null;
    return Contribution.findOne(args).populate('category').populate('contributor');
  },
  update(args: any, data: UpdateContributionBody) {
    if (args._id && !isValidObjectId(args._id)) return null;
    if (args.category && !isValidObjectId(args.category)) return null;
    return Contribution.findOneAndUpdate(args, data, { new: true });
  },
  deleteById(id: string, category: string) {
    if (!isValidObjectId(id) || !isValidObjectId(category)) return null;
    return Contribution.findOneAndDelete({ _id: id, category });
  },
};

export default ContributionDao;
