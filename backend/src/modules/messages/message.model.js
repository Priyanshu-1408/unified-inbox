
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      required: true,
    },

    channel: {
      type: String,
      enum: ["whatsapp", "gmail", "slack"],
      required: true,
    },

    externalMessageId: {
      type: String,
      default: null,
    },

    sender: {
      type: String,
      required: true,
    },

    text: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      default: "text",
    },

    direction: {
      type: String,
      enum: ["inbound", "outbound"],
      required: true,
    },

    status: {
      type: String,
      enum: ["received", "sent", "delivered", "read", "failed"],
      default: "received",
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

messageSchema.index({ userId: 1, conversationId: 1, timestamp: -1 });

messageSchema.index(
  { userId: 1, channel: 1, externalMessageId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      externalMessageId: { $type: "string" },
    },
  }
);

export default mongoose.model("Message", messageSchema);
