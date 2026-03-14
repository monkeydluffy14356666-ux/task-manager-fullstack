import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({

  userId: mongoose.Schema.Types.ObjectId,

  title: String,
  description: String,

  status: {
    type: String,
    default: "pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.models.Task ||
mongoose.model("Task", TaskSchema);