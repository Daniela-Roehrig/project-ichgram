import { Request, Response } from "express";

import * as authService from "../services/auth.service";

import validateBody from "../utils/validateBody";
import HttpExeption from "../utils/HttpExeption";

import {
  registerSchema,
  verifyCodeSchema,
  loginSchema,
  forgotPasswordSchema,
  changePasswordSchema,
  changeEmailSchema,
  deleteAccountSchema,
} from "../validation/auth.schema";
import { UserDocument } from "../db/models/User";
import { AuthenticatedRequest } from "../typescript/interfaces";

import { sendEmail } from "../utils/email";

export const sendVerificationEmail = async (to: string, code: string) => {
  const html = `<h2>Welcome!</h2><p>Your verification code is <strong>${code}</strong>.</p>`;
  await sendEmail({
    to,
    subject: "Email Verification",
    html,
  });
};


export interface ILoginResponce {
  token: string;
  refreshToken?: string;
  user: {
    email: string;
    fullName: string;
    username: string;
  };
}

// User Register

export const registerController = async (
  req: Request,
  res: Response
): Promise<void> => {
  await validateBody(registerSchema, req.body);

  const result: UserDocument = await authService.register(req.body);

  res.status(201).json({
    message: `Welcome! You have successfully registered with the email ${result.email}. \nPlease confirm your email by clicking the link sent to your inbox.`,
  });
};

export const verifyController = async (req: Request, res: Response): Promise<void> => {
  await validateBody(verifyCodeSchema, req.body);
  await authService.verify(req.body.code);

  res.json({
    message:
      "Email successfully verified. \nPlease login with your credentials.",
  });
};

export const loginController = async (
  req: Request,
  res: Response
): Promise<void> => {
  await validateBody(loginSchema, req.body);

  const result: ILoginResponce = await authService.login(req.body);

  const token = result.token;
  const refreshToken = result.refreshToken;
  const user = result.user;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, 
    secure: true, 
    sameSite: "strict",
    path: "/",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 днів
  });

  res.json({ token, user });
};

export const forgotPasswordController = async (
  req: Request,
  res: Response
): Promise<void> => {
  await validateBody(forgotPasswordSchema, req.body);

  const result: UserDocument = await authService.forgotPassword(req.body);

  res.json({
    message:
      `An email ${result.email} with a temporary password has been sent. Please follow the instructions in the email.`,
  });
};


export const refreshTokenController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const oldRefreshToken = req.cookies?.refreshToken;
  if (!oldRefreshToken) throw HttpExeption(401, "Refresh token missing");

  const { token, refreshToken } = await authService.refreshToken(
    oldRefreshToken
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true, 
    sameSite: "strict", 
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ token });
};

export const getCurrentController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = (req as AuthenticatedRequest).user;
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const result: ILoginResponce = await authService.getCurrent(user);

  const token = result.token;
  const userData = result.user;

  res.json({ token, user: userData });
};

export const changePasswordController = async (
  req: Request,
  res: Response
): Promise<void> => {
  await validateBody(changePasswordSchema, req.body);

  const user = (req as AuthenticatedRequest).user;
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  await authService.changePassword(req.body, user);

  res.json({
    message: "Password change successfully",
  });
};

export const changeEmailController = async (
  req: Request,
  res: Response
): Promise<void> => {
  await validateBody(changeEmailSchema, req.body);

  const user = (req as AuthenticatedRequest).user;
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const result = await authService.changeEmail(req.body, user);

  res.json({
    message: `Email ${result} update successfully`,
  });
};

export const logoutController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = (req as AuthenticatedRequest).user;
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  await authService.logout(user);

  res.json({
    message: "Logout successfully",
  });
};


export const deleteAccountController = async (
  req: Request,
  res: Response
): Promise<void> => {
  await validateBody(deleteAccountSchema, req.body);

  const user = (req as AuthenticatedRequest).user;
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  await authService.deleteAccount(req.body, user);

  res.json({
    message: "User delete successfully",
  });
};
