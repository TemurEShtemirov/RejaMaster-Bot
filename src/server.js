import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  markAsDone,
} from "./controllers/taskController.js";
import {
  createCategory,
  getCategories,
  deleteCategory,
} from "./controllers/categoryController.js";

// Initialize the app
const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost/rejamaster", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Task routes
app.post("/tasks", async (req, res) => {
  const { title, description, deadline, priority, category } = req.body;
  const task = await createTask(
    title,
    description,
    deadline,
    priority,
    category
  );
  res.json(task);
});

app.get("/tasks", async (req, res) => {
  const tasks = await getTasks();
  res.json(tasks);
});

app.put("/tasks/:id", async (req, res) => {
  const updates = req.body;
  const task = await updateTask(req.params.id, updates);
  res.json(task);
});

app.delete("/tasks/:id", async (req, res) => {
  await deleteTask(req.params.id);
  res.json({ message: "Task deleted" });
});

app.put("/tasks/:id/markasdone", async (req, res) => {
  const task = await markAsDone(req.params.id);
  res.json(task);
});

// Category routes
app.post("/categories", async (req, res) => {
  const { name } = req.body;
  const category = await createCategory(name);
  res.json(category);
});

app.get("/categories", async (req, res) => {
  const categories = await getCategories();
  res.json(categories);
});

app.delete("/categories/:id", async (req, res) => {
  await deleteCategory(req.params.id);
  res.json({ message: "Category deleted" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
