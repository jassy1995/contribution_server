import db from '../lib/db.ts';
import logger from '../lib/logger.ts';

const schema = new db.main.Schema(
  {
    otp: {
      type: String,
      required: true,
    },
    for: {
      type: String,
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    user: {
      type: db.main.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    collection: 'tokens',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Token = db.main.model('Token', schema);

Token.syncIndexes().catch((e) => logger.error(e));

export default Token;
