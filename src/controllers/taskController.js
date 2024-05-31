import Task from "../models/Task.js";

export const createTask = async (
  title,
  description,
  deadline,
  priority,
  category
) => {
  const task = new Task({ title, description, deadline, priority, category });
  await task.save();
  return task;
};

export const getTasks = async () => {
  return await Task.find();
};

export const updateTask = async (taskId, updates) => {
  return await Task.findByIdAndUpdate(taskId, updates, { new: true });
};

export const deleteTask = async (taskId) => {
  return await Task.findByIdAndDelete(taskId);
};

export const markAsDone = async (taskId) => {
  return await Task.findByIdAndUpdate(
    taskId,
    { completed: true },
    { new: true }
  );
};
