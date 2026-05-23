import db from '../lib/db.ts';
import logger from '../lib/logger.ts';

const schema = new db.main.Schema(
  {
    user: {
      type: db.main.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      trim: true,
    },
    latestResponseId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'chats',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

schema.index({ user: 1, createdAt: -1 });

const Chat = db.main.model('Chat', schema);

Chat.syncIndexes().catch((e) => logger.error(e));

export default Chat;
