
import { Request, Response } from "express";
import * as myProfileService from "../services/myProfile.service";
import validateBody from "../utils/validateBody";
import bcrypt from "bcryptjs"
import User from "../db/models/User";

import { updateUserSchema } from "../validation/users.schema";
import { PublicUserResponse } from "../db/models/User";
import { AuthenticatedRequest } from "../typescript/interfaces";
import upload from "../utils/multer";

export const getMyProfileController = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password") 
      .populate("followers", "username avatar")
      .populate("following", "username avatar");

    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    res.json(user);
  } catch (error) {
    console.error("Fehler beim Laden des Profils:", error);
    res.status(500).json({ message: "Fehler beim Laden des Profils" });
  }
};

export const updateMyProfileController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = (req as AuthenticatedRequest).user;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    await validateBody(updateUserSchema, req.body);

    if (req.file && !req.body.avatar) {
      req.body.avatar = req.file.path.replace(/\\/g, "/");
    }

    const result: PublicUserResponse = await myProfileService.updateMyProfile(
      {
        payload: req.body,
        file: req.file,
      },
      user
    );

    res.status(200).json(result);
  } catch (error: any) {
    console.error(" updateMyProfileController Fehler:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const changePasswordController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = (req as AuthenticatedRequest).user;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400).json({ message: "Beide Felder sind erforderlich." });
    return;
  }

  try {
    const dbUser = await User.findById(user.id);
    if (!dbUser) {
      res.status(404).json({ message: "User nicht gefunden." });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, dbUser.password);
    if (!isMatch) {
      res.status(400).json({ message: "Aktuelles Passwort ist falsch." });
      return;
    }
    
    const salt = await bcrypt.genSalt(10);
    dbUser.password = await bcrypt.hash(newPassword, salt);
    await dbUser.save();

    res.status(200).json({ message: "Passwort erfolgreich geändert." });
  } catch (err: any) {
    console.error("changePasswordController Fehler:", err);
    res.status(500).json({ message: "Serverfehler." });
  }
};