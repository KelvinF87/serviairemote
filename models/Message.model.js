import mongoose from "mongoose";
const { Schema } = mongoose;

const MessageSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        response: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);
const Message = mongoose.model("Message", MessageSchema);
export default Message;