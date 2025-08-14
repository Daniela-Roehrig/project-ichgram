
import { IUser } from '../../db/models/User'; 
import { Request } from "express";
import { UserDocument } from "../db/models/User"; 

declare global {
  namespace Express {
    interface Request {
      user?: IUser;  
    }
  }
}

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    username?: string;
    email?: string;
    avatar?: string;
  };
}
