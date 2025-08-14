import jwt from "jsonwebtoken";
import HttpExeption from "../utils/HttpExeption";
import { UserDocument } from "../db/models/User";

export interface IJWTTokenPayload {
  id: string;
}

const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;

if (typeof JWT_SECRET !== "string")
  throw HttpExeption(500, "JWT_SECRET not found");

if (typeof JWT_REFRESH_SECRET !== "string")
  throw HttpExeption(500, "JWT_REFRESH_SECRET not found");

export const createToken = (user: UserDocument): string => {
  const payload: IJWTTokenPayload = {
    id: user._id.toString(),
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
};

export const createRefreshToken = (user: UserDocument): string => {
  const payload: IJWTTokenPayload = {
    id: user._id.toString(),
  };
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
};


export const verifyToken = (token: string): IJWTTokenPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as IJWTTokenPayload;
  } catch (error) {
    throw HttpExeption(401, "Invalid or expired token");
  }
};

export const verifyRefreshToken = (token: string): IJWTTokenPayload => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as IJWTTokenPayload;
  } catch (error) {
    throw HttpExeption(401, "Invalid or expired refresh token");
  }
};
