import { endOfMonth, endOfYear, startOfMonth, startOfYear } from 'date-fns';
import { Types, isValidObjectId } from 'mongoose';
import Contribution from '../models/contribution.ts';
import type {
  CreateContributionBody,
  GetContributionParams,
  UpdateContributionBody,
} from '../schemas/contribution.ts';

/** Cap a future date to right now so queries never include records beyond today. */
const capToNow = (date: Date): Date => (date > new Date() ? new Date() : date);

const buildCollectedAtFilter = (month?: number, year?: number) => {
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
    } else if (params.year) {
      filter.collectedAt = buildCollectedAtFilter(undefined, params.year);
    }
    const skip = page * limit - limit;
    return Contribution.find(filter)
      .populate('category')
      .populate('contributor')
      .sort('-collectedAt')
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
    } else if (params.year) {
      filter.collectedAt = buildCollectedAtFilter(undefined, params.year);
    }
    return Contribution.countDocuments(filter);
  },
  getSum(args: any) {
    const { ...params } = args;
    const match: any = {};
    if (params.contributor) {
      if (!isValidObjectId(params.contributor)) return null;
      match.contributor = new Types.ObjectId(params.contributor);
    }
    if (params.category) {
      if (!isValidObjectId(params.category)) return null;
      match.category = new Types.ObjectId(params.category);
    }
    if (params.status) match.status = params.status;
    const collectedAt = buildCollectedAtFilter(params.month, params.year);
    if (collectedAt) match.collectedAt = collectedAt;
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
  getSumByContributor(args: any) {
    const { ...params } = args;
    const match: any = {};
    const collectedAt = buildCollectedAtFilter(params.month, params.year);
    if (collectedAt) match.collectedAt = collectedAt;
    return Contribution.aggregate([
      { $match: match },
      { $group: { _id: '$contributor', total: { $sum: '$amount' } } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'contributor',
        },
      },
      { $unwind: { path: '$contributor', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          total: 1,
          'contributor._id': 1,
          'contributor.firstName': 1,
          'contributor.lastName': 1,
          'contributor.username': 1,
          'contributor.phone': 1,
        },
      },
      { $sort: { total: -1 } },
    ]);
  },
  deleteById(id: string, category: string) {
    if (!isValidObjectId(id) || !isValidObjectId(category)) return null;
    return Contribution.findOneAndDelete({ _id: id, category });
  },
};

export default ContributionDao;
