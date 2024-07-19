import mongoose from "mongoose";
const Schema = mongoose.Schema;
const messageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "users", required: true },
  receiver: { type: Schema.Types.ObjectId, ref: "users", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  Isseen: { type: Boolean },
});
const privatechat = new Schema({
  participants: [
    {
      user: { type: Schema.Types.ObjectId, ref: "users", required: true },
      status: {
        type: String,
      },
      lastRead: { type: Date, default: Date.now },
    },
  ],
  messages: [messageSchema],
  roomid: {
    type: String,
    required: true,
  },
});
const privateschema = mongoose.model("privatechat", privatechat);
export default privateschema;
