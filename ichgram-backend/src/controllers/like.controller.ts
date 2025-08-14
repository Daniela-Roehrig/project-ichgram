import { Request, Response } from "express";
import { PostModel } from "../db/models/Post";
import Notification from "../db/models/Notification";

export const likeController = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {

      post.likes = post.likes.filter((id: any) => id.toString() !== userId.toString());
    } else {

      post.likes.push(userId);

      if (post.author.toString() !== userId.toString()) {
        await Notification.create({
          type: "like",
          recipient: post.author,
          actor: userId,
          post: post._id,
        });
      }
    }

    await post.save();

    res.json({
      likesCount: post.likes.length,
      likedByUser: !alreadyLiked,
    });
  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getLikes = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const userId = req.user?._id.toString();

  try {
    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).json({ message: "Post nicht gefunden" });

    const likedByUser = userId
      ? post.likes.some((id: any) => id.toString() === userId)
      : false;

    res.json({
      likesCount: post.likes.length,
      likedByUser,
    });
  } catch (error) {
    console.error("Fehler beim Laden der Likes:", error);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
};