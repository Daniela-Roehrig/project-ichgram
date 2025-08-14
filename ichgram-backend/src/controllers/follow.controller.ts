import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../db/models/User";
import {PostModel} from "../db/models/Post";
import {CommentModel} from "../db/models/Comment"; 

export const getFollowFeed = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user?.id;

    const currentUser = await User.findById(currentUserId);

    if (!currentUser || !currentUser.following || currentUser.following.length === 0) {
      return res.status(200).json([]); 
    }

    const posts = await PostModel.find({ author: { $in: currentUser.following } })
      .sort({ createdAt: -1 })
      .limit(4)
      .populate("author", "username avatar") 
      .lean();

    for (const post of posts) {
      const [firstComment] = await CommentModel.find({ postId: post._id })
        .sort({ createdAt: 1 })
        .limit(1)
        .populate("user", "username") 
        .lean();

      const commentCount = await CommentModel.countDocuments({ postId: post._id });

      post.firstComment = firstComment || null;
      post.commentCount = commentCount;
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error("Feed-Fehler:", error);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
};

export const followUnfollowUser = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user?.id;
    const targetUserId = req.params.id;

    if (!currentUserId || !mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ message: "Ungültige Anfrage." });
    }

    if (currentUserId === targetUserId) {
      return res
        .status(400)
        .json({ message: "Du kannst dir nicht selbst folgen." });
    }

    const [currentUser, targetUser] = await Promise.all([User.findById(currentUserId), User.findById(targetUserId)]);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User nicht gefunden." });
    }

    currentUser.following = currentUser.following || [];
    targetUser.followers = targetUser.followers || [];

    const isFollowing = currentUser.following.some((id) =>
      id.equals(targetUser._id)
    );

    if (isFollowing) {
      currentUser.following = currentUser.following.filter(
        (id) => !id.equals(targetUser._id)
      );
      targetUser.followers = targetUser.followers.filter(
        (id) => !id.equals(currentUser._id)
      );
    } else {
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUser._id);
    }

    await Promise.all([currentUser.save(), targetUser.save()]);

    res.status(200).json({
      success: true,
      following: !isFollowing,
      followers: targetUser.followers,
      followerCount: targetUser.followers.length,
      followingCount: currentUser.following.length,
    });
  } catch (error) {
    console.error("Follow/Unfollow Fehler:", error);
    res.status(500).json({ message: "Fehler beim Follow/Unfollow." });
  }
};

export const getFollowers = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).populate(
      "followers",
      "username fullName avatar"
    );

    if (!user) {
      return res.status(404).json({ message: "User nicht gefunden." });
    }

    res.status(200).json({ followers: user.followers });
  } catch (err) {
    console.error("Fehler beim Abrufen der Follower:", err);
    res.status(500).json({ message: "Interner Fehler." });
  }
};

export const getFollowing = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).populate(
      "following",
      "username fullName avatar"
    );

    if (!user) {
      return res.status(404).json({ message: "User nicht gefunden." });
    }

    res.status(200).json({ following: user.following });
  } catch (err) {
    console.error("Fehler beim Abrufen der Followings:", err);
    res.status(500).json({ message: "Interner Fehler." });
  }
};
