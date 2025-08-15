
import mongoose, { Schema, Document, Types } from "mongoose";

export interface CommentDocument extends Document {
  postId: Types.ObjectId;
  user: Types.ObjectId; 
  text: string; 
  likes: Types.ObjectId[]; 
  createdAt: Date;
  updatedAt: Date;
}


const commentSchema = new Schema<CommentDocument>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    text: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "user" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const CommentModel =
  mongoose.models.Comment ||
  mongoose.model<CommentDocument>("Comment", commentSchema);
