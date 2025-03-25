import mongoose from "mongoose";
const { Schema } = mongoose;

const UseSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    roles: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    img: {
        type: String,
        default: "https://res.cloudinary.com/dzq7v9h3x/image/upload/v1698159587/avatars/default-avatar.png",
    },
    prompt: {
        type: String,
        default: "user",
    },
    idprompt: { type: Schema.Types.ObjectId, ref: "PromptSystem", required: false, default: "649b0f1c4a2d3e5f8c8b4567" },
    active: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
const User = mongoose.model("User", UseSchema);

export default User;
