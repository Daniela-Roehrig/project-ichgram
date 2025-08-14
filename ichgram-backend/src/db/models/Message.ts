
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
    },
    text: {
         type: String, 
         required: true 
        },
    timestamp: { 
        type: String, 
        required: true },
    id: { 
        type: String, 
        required: true },
  },
  {
    versionKey: false,
    timestamps: true, 
  }
);

 const Message = mongoose.model("Message", messageSchema);
export default Message;
