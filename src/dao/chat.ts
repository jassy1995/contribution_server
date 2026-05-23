import { isValidObjectId } from 'mongoose';
import Chat from '../models/chat.ts';

const ChatDao = {
  create(data: { user: string; latestResponseId: string; title?: string }) {
    return Chat.create(data);
  },
  getOne(args: { _id?: string; user?: string }) {
    if (args._id && !isValidObjectId(args._id)) return null;
    if (args.user && !isValidObjectId(args.user)) return null;
    return Chat.findOne(args);
  },
  getAll(userId: string) {
    if (!isValidObjectId(userId)) return [];
    return Chat.find({ user: userId }).sort('-createdAt');
  },
  update(id: string, data: Partial<{ latestResponseId: string; title: string }>) {
    if (!isValidObjectId(id)) return null;
    return Chat.findByIdAndUpdate(id, data, { new: true });
  },
  deleteById(id: string) {
    if (!isValidObjectId(id)) return null;
    return Chat.findOneAndDelete({ _id: id });
  },
};

export default ChatDao;
