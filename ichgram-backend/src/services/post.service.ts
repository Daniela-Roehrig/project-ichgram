import { Types } from "mongoose";
import { PostModel, PostDocument } from "../db/models/Post";
import { PublicPostResponse } from "../typescript/interfaces";
import HttpExeption from "../utils/HttpExeption";
import cloudinary from "../utils/cloudinary";
import { unlink } from "fs/promises";
import { UserDocument } from "../db/models/User"; //

interface PopulatedAuthor {
  _id: Types.ObjectId;
  username: string;
  avatar?: string;
}

export interface DetailedPostResponse {
  _id: string;
  description: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    _id: string;
    username: string;
    avatar?: string;
  };
}

interface DetailedPostLean {
  _id: Types.ObjectId;
  author: PopulatedAuthor;
  description: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

type PostLean = {
  _id: Types.ObjectId | string;
  author: Types.ObjectId | string;
  description: string;
  image?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};


export const toPublic = (doc: PostDocument | PostLean): PublicPostResponse => ({
  _id: (doc._id as Types.ObjectId | string).toString(),
  author: (doc.author as Types.ObjectId | string).toString(),
  description: doc.description,
  image: doc.image,
  createdAt: new Date(doc.createdAt),
  updatedAt: new Date(doc.updatedAt),
});


export const getAllPostsForUser = async (userId: string) => {
  const posts = await PostModel.find({ author: userId })
    .sort({ createdAt: -1 })
    .lean();

  return posts.map((post) => ({
    _id: post._id,
    description: post.description,
    image: post.image,
    createdAt: post.createdAt,
  }));
};

const toDetailedPostResponse = (
  post: DetailedPostLean
): DetailedPostResponse => ({
  _id: post._id.toString(),
  description: post.description,
  image: post.image,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
  author: {
    _id: post.author._id.toString(),
    username: post.author.username,
    avatar: post.author.avatar,
  },
});

export const getPostById = async (
  postId: string
): Promise<DetailedPostResponse> => {
  const post = await PostModel.findById(postId)
    .populate("author", "username avatar") 

  if (!post) throw HttpExeption(404, "Post not found");

  return {
    _id: post._id.toString(),
    description: post.description,
    image: post.image,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    author: {
      _id: post.author._id.toString(),
      username: post.author.username,
      avatar: post.author.avatar,
    },
  };
};


export interface CreatePostInput {
  description: string;
  file?: Express.Multer.File;
}

export const createPost = async (
  input: CreatePostInput,
  userId: Types.ObjectId
): Promise<PublicPostResponse> => {
  let imageUrl: string | undefined;

  if (input.file) {
    const result = await cloudinary.uploader.upload(input.file.path, {
      folder: "ichgram/posts",
      use_filename: true,
    });
    await unlink(input.file.path);
    imageUrl = result.url;
  }

  const post = await PostModel.create({
    author: userId,
    description: input.description,
    image: imageUrl,
  });

  return toPublic(post);
};

export interface UpdatePostInput {
  description?: string;
  file?: Express.Multer.File;
}

export const updatePost = async (
  postId: string,
  input: UpdatePostInput,
  userId: Types.ObjectId
): Promise<PublicPostResponse> => {
  const post = await PostModel.findById(postId);
  if (!post) throw HttpExeption(404, "Post not found");
  if (!post.author.equals(userId))
    throw HttpExeption(403, "Not the post author");

  if (input.description !== undefined) post.description = input.description;

  if (input.file) {
    const result = await cloudinary.uploader.upload(input.file.path, {
      folder: "ichgram/posts",
      use_filename: true,
    });
    await unlink(input.file.path);
    post.image = result.url;
  }

  const updated = await post.save();
  return toPublic(updated);
};

export const deletePost = async (
  postId: string,
  userId: Types.ObjectId
): Promise<boolean> => {
  const post = await PostModel.findById(postId);
  if (!post) throw HttpExeption(404, "Post not found");
  if (!post.author.equals(userId))
    throw HttpExeption(403, "Not the post author");

  await post.deleteOne();
  return true;
};

export const getFeedPosts = async (
  isRandom: boolean = false
): Promise<DetailedPostResponse[]> => {
  if (isRandom) {
    const sampled = await PostModel.aggregate([
      { $sample: { size: 50 } },
      { $project: { _id: 1 } },
    ]);

    const sampledIds = sampled.map((doc) => doc._id);

    const posts = await PostModel.find({ _id: { $in: sampledIds } })
      .populate("author", "username avatar")
      .lean<DetailedPostLean[]>();

    posts.sort((a, b) => sampledIds.indexOf(a._id) - sampledIds.indexOf(b._id));

    return posts.map(toDetailedPostResponse);
  } else {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("author", "username avatar")
      .lean<DetailedPostLean[]>();

    console.log("getFeedPosts sorted posts:", posts);

    return posts.map(toDetailedPostResponse);
  }
};
