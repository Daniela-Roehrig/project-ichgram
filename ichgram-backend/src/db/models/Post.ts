import mongoose, { Schema, Document, model, Types } from "mongoose";

export interface PostAttrs {
  author: Types.ObjectId;
  description: string;
  image?: string;
  likes?: Types.ObjectId[];
}

export interface PostDocument extends PostAttrs, Document {
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<PostDocument>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "user", 
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: false,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const PostModel =
  mongoose.models.Post || model<PostDocument>("Post", postSchema);
