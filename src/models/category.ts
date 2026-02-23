import { ContributionCategories } from '../config/constants.ts';
import db from '../lib/db.ts';
import logger from '../lib/logger.ts';

const schema = new db.main.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    target: {
      type: Number,
      min: 0,
      default: 0,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      enum: Object.values(ContributionCategories),
    },
  },
  {
    timestamps: true,
    collection: 'categories',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });

const Category = db.main.model('Category', schema);

Category.syncIndexes().catch((e) => logger.error(e));

export default Category;
