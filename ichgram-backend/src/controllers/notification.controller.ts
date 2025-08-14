import { Response } from "express";
import User from "../db/models/User";
import Notification from "../db/models/Notification";
import { AuthRequest } from "../types/express";

export const getNotifications = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized: Kein Benutzer gefunden." });
    return;
  }

  const userId = req.user._id;

  try {

    const notifications = await Notification.find({ recipient: userId })
      .populate("actor", "username avatar")
      .populate("recipient", "username avatar")
      .populate("post", "image")
      .sort({ createdAt: -1 });

  
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error); 
    console.error(error)
    res
      .status(500)
      .json({
        success: false,
        message: "Fehler beim Laden der Benachrichtigungen",
      });
  }
};
