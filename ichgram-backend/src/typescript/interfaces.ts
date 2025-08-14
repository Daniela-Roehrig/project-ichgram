
import { Request } from "express";
import { UserDocument } from "../db/models/User";

export interface AuthenticatedRequest extends Request {
  user?: UserDocument;  
}

export interface PublicPostResponse {
  _id: string;
  author: string;
  description: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}