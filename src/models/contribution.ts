import { ContributionStatus } from '../config/constants.ts';
import db from '../lib/db.ts';
import logger from '../lib/logger.ts';

const schema = new db.main.Schema(
  {
    contributor: {
      type: db.main.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: db.main.Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    fined: {
      type: Number,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      required: true,
      default: ContributionStatus.PENDING,
      enum: Object.values(ContributionStatus),
    },
    creator: {
      type: db.main.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    collectedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'contributions',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

schema.index({ collectedAt: -1 });
schema.index({ contributor: 1, collectedAt: -1 });
schema.index({ category: 1, collectedAt: -1 });

const Insight = db.main.model('Contribution', schema);

Insight.syncIndexes().catch((e) => logger.error(e));

export default Insight;
