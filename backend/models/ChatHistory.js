import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  messages: [{ role: String, content: String }],
}, { timestamps: true });

const ChatHistory = mongoose.model("ChatHistory", chatSchema);
export default ChatHistory;
