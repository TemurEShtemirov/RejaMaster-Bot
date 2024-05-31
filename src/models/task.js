import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  deadline: Date,
  priority: String,
  category: String,
  completed: { type: Boolean, default: false },
});

const Task = mongoose.model("Task", TaskSchema);
export default Task;
