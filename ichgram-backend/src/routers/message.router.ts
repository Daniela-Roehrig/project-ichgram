import express from "express";
import { createMessage, getAllMessages } from "../controllers/message.controller"; 
import Message from "../db/models/Message"

const messagesRouter = express.Router();

messagesRouter.post("/", createMessage);
messagesRouter.post("/conversation", async (req, res) => {
  const { userId1, userId2 } = req.body;
  try {
    const messages = await Message.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Abrufen der Nachrichten" });
  }
});

messagesRouter.get("/", getAllMessages);
messagesRouter.get("/:userId", async (req, res) => {
  const { userId } = req.params; 
  const { currentUserId } = req.query;

  if (!currentUserId) {
    return res.status(400).json({ error: "currentUserId fehlt" });
  }

  try {
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: currentUserId },
        { senderId: currentUserId, receiverId: userId }
      ],
    }).sort({ timestamp: 1 });

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Abrufen der Nachrichten" });
  }
});


messagesRouter.delete("/:userId", async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.query.currentUserId;

  try {
    await Message.deleteMany({
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId },
      ],
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Fehler beim Löschen:", error);
    res.status(500).json({ error: "Fehler beim Löschen der Nachrichten" });
  }
});




export default messagesRouter;




