import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import User from "../db/models/User";
import {
  createToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../functions/jsonwebtoken";
import HttpExeption from "../utils/HttpExeption";
import generateRandomPassword from "../utils/generatePassword";
import { sendEmail } from "../utils/email";

import { UserDocument } from "../db/models/User";
import { ILoginResponce } from "../controllers/auth.controller";

import {
  RegisterSchema,
  VerifyCodeSchema,
  LoginSchema,
  ForgotPasswordSchema,
  ChangePasswordSchema,
  ChangeEmailSchema,
  DeleteAccountSchema,
} from "../validation/auth.schema";

const { FRONTEND_URL } = process.env;
if (typeof FRONTEND_URL !== "string") {
  throw HttpExeption(500, "FRONTEND_URL not found");
}

export const register = async (
  payload: RegisterSchema
): Promise<UserDocument> => {
  const existingUser = await User.findOne({
    $or: [
      { email: payload.email },
      { username: payload.username },
      { fullName: payload.fullName },
    ],
  });

  if (existingUser) {
    if (existingUser.email === payload.email) {
      throw HttpExeption(400, "Email is already in use");
    }
    if (existingUser.username === payload.username) {
      throw HttpExeption(400, "Username is already in use");
    }
    if (existingUser.fullName === payload.fullName) {
      throw HttpExeption(400, "Full name is already in use");
    }
  }

  const hashPassword = await bcrypt.hash(payload.password, 10);
  const verificationCode = nanoid();

  const user = await User.create({
    ...payload,
    password: hashPassword,
    verificationCode,
  });

  await sendEmail({
    to: [user.email],
    subject: "Verify email",
    html: `<a href="${FRONTEND_URL}?verificationCode=${verificationCode}" target="_blank">Click verify email</a>`,
  });

  return user;
};


export const verify = async (code: VerifyCodeSchema): Promise<void> => {
  const user = await User.findOne({ verificationCode: code });
  if (!user) throw HttpExeption(401, "Email already verified or not found");

  user.verificationCode = "";
  user.verify = true;
  await user.save();
};

export const login = async ({
  email,
  password,
}: LoginSchema): Promise<ILoginResponce> => {
  const user = await User.findOne({ email });
  if (!user) throw HttpExeption(401, `User with email ${email} not found`);

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) throw HttpExeption(401, "Password invalid");

  const token = createToken(user);
  const refreshToken = createRefreshToken(user);

  user.token = token;
  user.refreshToken = refreshToken;
  await user.save();

  return {
    token,
    refreshToken,
    user: {
      email: user.email,
      fullName: user.fullName,
      username: user.username,
    },
  };
};

export const forgotPassword = async ({
  email,
}: ForgotPasswordSchema): Promise<UserDocument> => {
  const user = await User.findOne({ email });
  if (!user) throw HttpExeption(401, `User with email ${email} not found`);

  const tempPassword = generateRandomPassword();
  const hashPassword = await bcrypt.hash(tempPassword, 10);
  user.password = hashPassword;
  await user.save();

  await sendEmail({
    to: [user.email],
    subject: "Reset your password",
    html: `
      <p>Hello ${user.fullName},</p>
      <p>You requested a password reset. Here is your temporary password:</p>
      <p><strong>${tempPassword}</strong></p>
      <p>Please log in and change it immediately:</p>
      <p><a href="${FRONTEND_URL}">Login</a></p>
    `,
  });

  return user;
};


export const refreshToken = async (
  refreshToken: string
): Promise<{ token: string; refreshToken: string }> => {
  const id = verifyRefreshToken(refreshToken);
  const user = await User.findById(id);
  if (!user || user.refreshToken !== refreshToken)
    throw HttpExeption(403, "Invalid token");

  const token = createToken(user);
  const newRefreshToken = createRefreshToken(user);

  user.token = token;
  user.refreshToken = newRefreshToken;
  await user.save();

  return { token, refreshToken: newRefreshToken };
};

export const getCurrent = async (
  user: UserDocument
): Promise<ILoginResponce> => {
  const token = createToken(user);
  const refreshToken = createRefreshToken(user);

  user.token = token;
  user.refreshToken = refreshToken;
  await user.save();

  return {
    token,
    user: {
      email: user.email,
      fullName: user.fullName,
      username: user.username,
    },
  };
};


export const changePassword = async (
  { password, newPassword }: ChangePasswordSchema,
  { _id }: UserDocument
): Promise<boolean> => {
  const user = await User.findById(_id);
  if (!user) throw HttpExeption(401, `User not found`);

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) throw HttpExeption(401, "Password invalid");
  if (password === newPassword)
    throw HttpExeption(400, "The password must not match the previous one.");

  user.password = await bcrypt.hash(newPassword, 10);
  user.token = "";
  user.refreshToken = "";
  await user.save();

  return true;
};


export const changeEmail = async (
  { password, newEmail }: ChangeEmailSchema,
  { _id }: UserDocument
): Promise<string> => {
  const user = await User.findById(_id);
  if (!user) throw HttpExeption(401, `User not found`);

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) throw HttpExeption(401, "Password invalid");

  if (newEmail === user.email)
    throw HttpExeption(400, "New email must differ from current");

  user.email = newEmail;
  user.token = "";
  user.refreshToken = "";
  await user.save();

  return user.email;
};

export const logout = async ({ _id }: UserDocument): Promise<boolean> => {
  const user = await User.findById(_id);
  if (!user) throw HttpExeption(401, `User not found`);

  user.token = "";
  user.refreshToken = "";
  await user.save();

  return true;
};

export const deleteAccount = async (
  { password }: DeleteAccountSchema,
  { _id }: UserDocument
): Promise<boolean> => {
  const user = await User.findById(_id);
  if (!user) throw HttpExeption(401, `User not found`);

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) throw HttpExeption(401, "Password invalid");

  await user.deleteOne();
  return true;
};
