import  mongoose from 'mongoose'
const Schema = mongoose.Schema;
const messageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "users" },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});
const GroupChatschema = new Schema({
  GroupName: {
    type: String,
  },
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
  participants: [
    {
      user: { type: Schema.Types.ObjectId, required: true },
      lastRead: { type: Date, default: Date.now },
    },
  ],
  messages: [messageSchema],
});
export const GroupChat= mongoose.model("GroupChat", GroupChatschema);
