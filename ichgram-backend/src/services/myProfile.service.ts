import { unlink } from "node:fs/promises";
import { Types } from "mongoose";
import User from "../db/models/User";
import HttpExeption from "../utils/HttpExeption";
import cloudinary from "../utils/cloudinary";

import { UserDocument, PublicUserResponse } from "../db/models/User";
import { mapUserToPublicUserResponse } from "../utils/user.mapper";
import { UpdateUserSchema } from "../validation/users.schema";

import { PostModel } from "../db/models/Post";

interface IUpdateUser {
  payload: UpdateUserSchema;
  file: Express.Multer.File | undefined;
}
export const getMyProfile = async ({ _id }: UserDocument): Promise<PublicUserResponse & { posts: any[]; postCount: number }> => {
  const user = await User.findById(_id).lean();
  if (!user) throw HttpExeption(401, `User not found`);

  const posts = await PostModel.find({ author: _id })
    .sort({ createdAt: -1 })
    .lean();

  const publicUser = mapUserToPublicUserResponse(user);

  return {
    ...publicUser,
    postCount: posts.length,
    posts: posts.map((post) => ({
      _id: post._id,
      description: post.description,
      image: post.image,
      createdAt: post.createdAt,
    })),
  };
};

export const updateMyProfile = async (
  { payload, file }: IUpdateUser,
  { _id }: UserDocument
): Promise<PublicUserResponse> => {
  const user = await User.findById(_id);
  if (!user) throw HttpExeption(401, `User not found`);

  if (file) {
    const { url: image } = await cloudinary.uploader.upload(file.path, {
      folder: "ichgram",
      use_filename: true,
    });
    await unlink(file.path);
    user.avatar = image;
  }
  
  if (payload.fullName !== undefined) user.fullName = payload.fullName;
  if (payload.username !== undefined) user.username = payload.username;
  if (payload.bio !== undefined) user.bio = payload.bio;

  await user.save();

  return mapUserToPublicUserResponse(user);
};
