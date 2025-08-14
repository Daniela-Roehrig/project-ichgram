import mongoose from "mongoose";
import { Request, Response } from "express";
import { CommentModel } from "../db/models/Comment";
import { commentValidationSchema } from "../validation/comment.schema";
import { ValidationError } from "yup";
import Notification from "../db/models/Notification";
import { PostModel } from "../db/models/Post";
import { Types } from "mongoose";

export const addComment = async (req: Request, res: Response) => {
 const { id: postId } = req.params;

  const { text } = req.body;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized – no user" });
  }

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: "Ungültige Post-ID" });
  }

  try {
    await commentValidationSchema.validate({ text });
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ message: err.message });
    }
    console.error("Fehler bei der Kommentar-Validierung:", err);
    return res.status(500).json({ message: "Interner Serverfehler" });
  }

  try {
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post nicht gefunden" });
    }

const comment = await CommentModel.create({
  postId,
  user: user._id,
  text,
  likes: [],
});

    if (post.author.toString() !== user._id.toString()) {
      await Notification.create({
        type: "comment",
        actor: user._id,
        recipient: post.author,
        post: post._id,
        read: false,
      });
    }

    return res.status(201).json(comment);
  } catch (error) {
    console.error("Fehler beim Speichern des Kommentars:", error);
    return res.status(500).json({ message: "Interner Serverfehler" });
  }
};


export const getComments = async (req: Request, res: Response) => {
  const { postId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: "Ungültige Post-ID" });
  }

  try {
    const objectId = new mongoose.Types.ObjectId(postId); 
const comments = await CommentModel.find({ postId: objectId })
  .populate("user", "username avatar") // Richtiges Feld: "user"
  .sort({ createdAt: -1 });


    res.json(comments);
  } catch (error) {
    console.error("Fehler beim Laden der Kommentare:", error);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
};

export const likeComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: "Nicht autorisiert" });
  }

  try {
    const comment = await CommentModel.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Kommentar nicht gefunden" });
    }

    const alreadyLiked = comment.likes.includes(userId);

    if (alreadyLiked) {

      comment.likes = comment.likes.filter(
        (id: Types.ObjectId) => id.toString() !== userId.toString()

      );
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.status(200).json({
      likedByUser: !alreadyLiked,
      likesCount: comment.likes.length,
    });
  } catch (error) {
    console.error("Fehler beim Liken des Kommentars:", error);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const user = req.user;

  if (!user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const comment = await CommentModel.findById(commentId);
    if (!comment)
      return res.status(404).json({ message: "Kommentar nicht gefunden" });
    if (comment.user.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Nicht berechtigt, diesen Kommentar zu löschen" });
    }

    if (comment.user.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Nicht berechtigt, diesen Kommentar zu löschen" });
    }

    await comment.remove();
    res.json({ message: "Kommentar gelöscht" });
  } catch (error) {
    console.error("Fehler beim Löschen des Kommentars:", error);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
};
