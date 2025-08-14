import { Request, Response } from "express";
import Message from "../db/models/Message";
import { messageSchema } from "../validation/message.schema";
import { ValidationError } from "yup";
import { nanoid } from "nanoid";

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { text, senderId, receiverId } = req.body;

    const newMsg = await Message.create({
      id: nanoid(),
      text,
      senderId,
      receiverId,
      timestamp: new Date().toISOString(),
    });

    return res.status(201).json(newMsg);
  } catch (err) {
    const error = err as Error;

    res.status(500).json({
      message: "Fehler beim Senden der Nachricht",
      error: error.message,
    });
  }
};

export const getAllMessages = async (_req: Request, res: Response) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error(" Fehler beim Laden der Nachrichten:", error);
    res.status(500).json({ error: "Fehler beim Laden der Nachrichten" });
  }
};
