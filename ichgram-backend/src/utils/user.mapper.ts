import { UserDocument, PublicUserResponse } from "../db/models/User";

export const mapUserToPublicUserResponse = (
  user: UserDocument
): PublicUserResponse => {
  const { email, fullName, username, avatar, bio, website, verify, createdAt, updatedAt } =
    user;

  return {
    email,
    fullName,
    username,
    avatar,
    verify,
    bio,
    website,
    createdAt,
    updatedAt,
  };
};
