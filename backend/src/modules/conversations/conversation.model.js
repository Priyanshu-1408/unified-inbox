
import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,  //unique id 
      ref: "User",
      required: true,  //every conversation is associated with some registered user 
    },

    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",  //contact model
      required: true,
    },

    channel: {
      type: String,
      enum: ["whatsapp", "gmail", "slack"],
      required: true,
    },

    externalConversationId: {  //for some external id
      type: String,
      default: null,
    },

    subject: {
      type: String,
      default: "",
    },

    lastMessage: {
      type: String,
      default: "",
    },

    lastMessageAt: {
      type: Date,
      default: null,
    },

    unreadCount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

conversationSchema.index({   //for searchiinf data faster 
  userId: 1,
  channel: 1,
  contactId: 1,
});

export default mongoose.model("Conversation", conversationSchema);
