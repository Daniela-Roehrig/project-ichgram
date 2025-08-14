
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["like", "comment", "follow"],
    required: true,
  },
  recipient: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  actor: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  post: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  read: { 
    type: Boolean,
    default: false,
  }
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
