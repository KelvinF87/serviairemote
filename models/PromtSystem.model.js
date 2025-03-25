import mongoose from "mongoose";
const { Schema } = mongoose;
const PromptSystemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
const PromptSystem = mongoose.model("PromptSystem", PromptSystemSchema);    
export default PromptSystem;