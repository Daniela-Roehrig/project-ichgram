import { Response } from "express";
import * as postsService from "../services/post.service";
import { CreatePostInput, UpdatePostInput } from "../services/post.service";

import { AuthenticatedRequest } from "../typescript/interfaces";
import HttpExeption from "../utils/HttpExeption";
import { PostModel } from "../db/models/Post";

const OK = (res: Response, data: any, message?: string) =>
  res.json({
    message: message || "Success",
    data,
  });

export const feedController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const result = await postsService.getFeedPosts(true); 
  OK(res, result, "Feed posts retrieved successfully");
};

export const userPostsController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;
  const posts = await postsService.getAllPostsForUser(id); 
  OK(res, posts, `Posts for user ${id} retrieved successfully`);
};

export const postByIdController = async (req: AuthenticatedRequest, res: Response) => {
  const { id: postId } = req.params;  
  const post = await PostModel.findById(postId).populate("author", "username avatar");

  OK(res, post, `Post with id ${postId} retrieved successfully`);
};

export const createPostController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user) throw HttpExeption(401, "Unauthorized");
  const input: CreatePostInput = {
    description: req.body.description,
    file: req.file as Express.Multer.File | undefined,
  };
  const post = await postsService.createPost(input, req.user._id);
  res.status(201).json({
    message: "Post created successfully",
    data: post,
  });
};

export const updatePostController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user) throw HttpExeption(401, "Unauthorized");
  const input: UpdatePostInput = {
    description: req.body.description,
    file: req.file as Express.Multer.File | undefined,
  };
  const post = await postsService.updatePost(
    req.params.id,
    input,
    req.user._id
  );
  res.json({
    message: `Post with id ${req.params.id} updated successfully`,
    data: post,
  });
};

export const patchPostController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;
  const { description } = req.body;

  try {
    const post = await PostModel.findById(id).populate('author');

    if (!post) {
      return res.status(404).json({ message: "Post nicht gefunden" });
    }

    if (!post.author || !post.author._id.equals(req.user?._id)) {
  return res.status(403).json({ message: "Keine Berechtigung" });
}


    post.description = description || post.description;
    await post.save();

    return res.status(200).json({ message: "Post aktualisiert", post });
  } catch (err) {
    console.error("Fehler beim Aktualisieren des Posts:", err);
    return res.status(500).json({
      message: "Serverfehler beim Aktualisieren",
      error: err instanceof Error ? err.message : "Unbekannter Fehler",
      stack: err instanceof Error ? err.stack : undefined,
    });
  }
};



export const deletePostController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user) throw HttpExeption(401, "Unauthorized");
  await postsService.deletePost(req.params.id, req.user._id);
  res.json({
    message: `Post with id ${req.params.id} deleted successfully`,
    success: true,
  });
};
