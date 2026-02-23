import db from '../lib/db.ts';
import logger from '../lib/logger.ts';

const schema = new db.main.Schema(
  {
    creator: {
      type: db.main.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['debit', 'credit'],
    },
    transactionDate: {
      type: Date,
      required: true,
    },
    transactionAmount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
    collection: 'transactions',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

schema.index({ transactionDate: -1 });
schema.index({ creator: 1, transactionDate: -1 });

const Transaction = db.main.model('Transaction', schema);

Transaction.syncIndexes().catch((e) => logger.error(e));

export default Transaction;
