import mongoose from "mongoose";

const todoListSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["Pending", "Completed"],
    default: "Pending",
  },
  create_at: {
    type: String,
    required: true,
  },
  updated_at: {
    type: String,
    required: true,
  },
  end_at: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
});

todoListSchema.index({ title: "text" });
export default mongoose.model("todoListModel", todoListSchema);
