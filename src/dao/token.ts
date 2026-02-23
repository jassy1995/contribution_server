import { isValidObjectId } from 'mongoose';
import Token from '../models/token.ts';

const TokenDao = {
  create(data: any) {
    return Token.findOneAndUpdate({}, data, { new: true, upsert: true, setDefaultsOnInsert: true });
  },
  getByUser(id: string) {
    if (!isValidObjectId(id)) return null;
    return Token.findOne({ user: id });
  },
  deleteByUser(id: string) {
    if (!isValidObjectId(id)) return null;
    return Token.findOneAndDelete({ user: id });
  },
};

export default TokenDao;
