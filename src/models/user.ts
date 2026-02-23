import type { Document, InferSchemaType } from 'mongoose';
import { UserRoles } from '../config/constants.ts';
import { comparePasswords, hashPassword } from '../helpers/auth.ts';
import db from '../lib/db.ts';
import logger from '../lib/logger.ts';

const schema = new db.main.Schema(
  {
    firstName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    middleName: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    username: {
      type: String,
      required: false,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
      default: null,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    lastLogin: {
      type: Date,
      default: () => Date.now(),
    },
    role: {
      type: String,
      required: true,
      default: UserRoles.USER,
      enum: Object.values(UserRoles),
    },
    category: {
      type: db.main.Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
  },
  {
    timestamps: true,
    collection: 'users',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

interface UserBaseDocument extends Document, InferSchemaType<typeof schema> {
  comparePasswords(password: string): boolean;
}

schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (this.password) this.password = await hashPassword(this.password);
  next();
});

schema.methods.comparePasswords = function (password: string) {
  return comparePasswords(password, this.password);
};

const User = db.main.model<UserBaseDocument>('User', schema);

User.syncIndexes().catch((e) => logger.error(e));

export default User;
