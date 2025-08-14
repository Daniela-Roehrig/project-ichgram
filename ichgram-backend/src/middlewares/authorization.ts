import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../typescript/interfaces";
import User from "../db/models/User";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    (req as AuthenticatedRequest).user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
 