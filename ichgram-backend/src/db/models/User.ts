import { Schema, model, Document, Types } from "mongoose";
import { emailValidation } from "../../constants/user.constants";
import { handleSaveError, setUpdateSettings } from "../hooks";

export interface IUser {
  email: string;
  fullName: string;
  username: string;
  password: string;
  token?: string;
  refreshToken?: string; 
  avatar?: string;
  website?: string;
  bio: string;
  verificationCode?: string;
  verify: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  followers?: Types.ObjectId[];  
  following?: Types.ObjectId[];
}

export interface UserDocument extends IUser, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type PublicUserResponse = Omit<
  IUser,
  "password" | "token" | "refreshToken" | "verificationCode"
>;

const UserSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: emailValidation.value,
    },
    fullName: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: String,
    refreshToken: String,
    avatar: {
      type: String,
      default: "",
    },

    website: String,
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    verificationCode: String,
    verify: {
      type: Boolean,
      required: true,
      default: false,
    },


    followers: [{ type: Schema.Types.ObjectId, ref: "user" }],
    following: [{ type: Schema.Types.ObjectId, ref: "user" }],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);


UserSchema.post(
  "save",
  function (error: any, _doc: any, next: (err?: Error) => void) {
    if (error.name === "MongoError" && error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0];
      next(new Error(`${field} ist bereits vergeben.`));
    } else {
      next(error);
    }
  }
);

UserSchema.post("save", handleSaveError);
UserSchema.pre("findOneAndUpdate", setUpdateSettings);
UserSchema.post("findOneAndUpdate", handleSaveError);

const User = model<UserDocument>("user", UserSchema);
export default User;
