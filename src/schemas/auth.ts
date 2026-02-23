import { z } from 'zod';
import { UserRoles } from '../config/constants.ts';

export const signUpSchema = z.object({
  firstName: z.string(),
  lastName: z.string().optional(),
  middleName: z.string().optional(),
  username: z.string().optional(),
  email: z.email().optional(),
  phone: z.string().optional(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  category: z.string(),
});

export const loginSchema = z.object({
  phone: z.string(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  remember: z.boolean().default(false),
  admin: z.boolean().optional(),
});

export const loginGoogleSchema = z.object({
  token: z.string(),
});

export const confirmOtpSchema = z.object({
  otp: z.string(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  newPassword: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

export const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  middleName: z.string().optional(),
  username: z.string().optional(),
  bio: z.string().optional(),
  country: z.string().optional(),
  image: z.instanceof(File).optional(),
});

export const createUserSchema = z.object({
  firstName: z.string(),
  lastName: z.string().optional(),
  middleName: z.string().optional(),
  username: z.string().optional(),
  password: z.string().min(8).optional(),
  bio: z.string().optional(),
  role: z.enum([UserRoles.USER, UserRoles.ADMIN] as [string, ...string[]]).default(UserRoles.USER),
  country: z.string().optional(),
  email: z.email().optional(),
  phone: z.string().optional(),
  category: z.string(),
  image: z.instanceof(File).optional(),
});

export const updateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  middleName: z.string().optional(),
  username: z.string().optional(),
  bio: z.string().optional(),
  role: z.enum([UserRoles.USER, UserRoles.ADMIN] as [string, ...string[]]).optional(),
  country: z.string().optional(),
  email: z.email().optional(),
  phone: z.string().optional(),
  image: z.instanceof(File).optional(),
});

export const updateUserTokenSchema = z.object({
  notificationToken: z.string(),
});

export const getUserSchema = z.object({
  search: z.string().optional(),
  role: z.enum([UserRoles.USER, UserRoles.ADMIN] as [string, ...string[]]).optional(),
  status: z.string().optional(),
  category: z.string().optional(),
});

export const resetPasswordSendSchema = z.object({
  email: z.email(),
});

export const resetPasswordVerifySchema = z.object({
  otp: z.string(),
  password: z.string(),
  email: z.string(),
});

export const createUserSuspensionSchema = z.object({
  user: z.string(),
  reason: z.string(),
  expiration: z.preprocess(
    (val) => (typeof val === 'string' ? new Date(val) : val),
    z.date().optional(),
  ),
});

export const updateUserSuspensionSchema = z.object({
  suspended: z.boolean(),
  expiration: z.preprocess(
    (val) => (typeof val === 'string' ? new Date(val) : val),
    z.date().optional(),
  ),
});

export const createUserBanSchema = z.object({
  reason: z.string(),
  user: z.string(),
});

export const updateUserBanSchema = z.object({
  banned: z.boolean(),
});

export type SignUpBody = z.infer<typeof signUpSchema>;

export type LoginBody = z.infer<typeof loginSchema>;

export type LoginGoogleBody = z.infer<typeof loginGoogleSchema>;

export type ConfirmEmailOtpBody = z.infer<typeof confirmOtpSchema>;

export type ResetPasswordSendBody = z.infer<typeof resetPasswordSendSchema>;

export type ResetPasswordVerifyBody = z.infer<typeof resetPasswordVerifySchema>;

export type ChangePasswordBody = z.infer<typeof changePasswordSchema>;

export type CreateUserSuspensionBody = z.infer<typeof createUserSuspensionSchema>;

export type UpdateUserSuspensionBody = z.infer<typeof updateUserSuspensionSchema>;

export type CreateUserBanBody = z.infer<typeof createUserBanSchema>;

export type UpdateUserBanBody = z.infer<typeof updateUserBanSchema>;

export type UpdateUserBody = z.infer<typeof updateUserSchema>;

export type CreateUserBody = z.infer<typeof createUserSchema>;

export type UpdateUserTokenBody = z.infer<typeof updateUserTokenSchema>;
