import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  status:      { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);