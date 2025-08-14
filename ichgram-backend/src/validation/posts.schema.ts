import mongoose, { Schema, Model, Document, Types } from "mongoose";

export interface PostAttrs {
  author: Types.ObjectId;
  description: string;
  image?: string;
}

export interface PostDocument extends PostAttrs, Document {
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<PostDocument>(
  {
    author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    description: { type: String, required: true },
    image: { type: String },
  },
  {
    timestamps: true,
    versionKey: false, 
  }
);

export const PostModel: Model<PostDocument> =
  mongoose.models.Post || mongoose.model<PostDocument>("Post", postSchema);

  /* import * as yup from "yup";

export const postValidationSchema = yup.object({
  author: yup
    .string()
    .required("Author is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid author ID"),
  description: yup
    .string()
    .required("Description is required")
    .min(1, "Description cannot be empty"),
  image: yup
    .string()
    .url("Image must be a valid URL")
    .notRequired()
    .nullable(),
}); */