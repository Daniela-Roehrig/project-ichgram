import { Router, Request, Response } from "express";
import upload from "../middlewares/upload";
import { uploadFile } from "../controllers/upload.controller";
import { authenticate } from "../middlewares/authorization";
import User from "../db/models/User"; 

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const uploadRouter = Router();

uploadRouter.post("/", authenticate, upload.single("file"), uploadFile);

uploadRouter.post(
  "/avatar",
  authenticate,
  upload.single("avatar"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id, 
        { avatar: avatarUrl },
        { new: true } 
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ url: avatarUrl });
    } catch (error) {
      console.error("Fehler beim Speichern des Avatars:", error);
      res.status(500).json({ message: "Fehler beim Speichern des Avatars" });
    }
  }
);

export default uploadRouter;
