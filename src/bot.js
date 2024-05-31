import TelegramBot from "node-telegram-bot-api";
import mongoose from "mongoose";
import cron from "node-cron";
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

// Initialize the bot
const token = "YOUR_TELEGRAM_BOT_TOKEN";
const bot = new TelegramBot(token, { polling: true });

// Connect to MongoDB
mongoose.connect("mongodb://localhost/task_management_bot", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Handle /start command
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Welcome to the Task Management Bot!");
});

// Handle /createcategory command
bot.onText(/\/createcategory (.+)/, async (msg, match) => {
  const categoryName = match[1];
  await createCategory(categoryName);
  bot.sendMessage(msg.chat.id, `Category '${categoryName}' created.`);
});

// Handle /viewcategories command
bot.onText(/\/viewcategories/, async (msg) => {
  const categories = await getCategories();
  const response = categories.map((cat) => cat.name).join("\n");
  bot.sendMessage(msg.chat.id, `Categories:\n${response}`);
});

// Handle /deletecategory command
bot.onText(/\/deletecategory (.+)/, async (msg, match) => {
  const categoryName = match[1];
  await deleteCategory(categoryName);
  bot.sendMessage(msg.chat.id, `Category '${categoryName}' deleted.`);
});

// Handle /createtask command
bot.onText(/\/createtask/, async (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Enter the task details in the following format:\nTitle, Description, Deadline (YYYY-MM-DD), Priority, Category"
  );
  bot.once("message", async (responseMsg) => {
    const [title, description, deadline, priority, category] =
      responseMsg.text.split(", ");
    const task = await createTask(
      title,
      description,
      deadline,
      priority,
      category
    );
    bot.sendMessage(msg.chat.id, `Task '${task.title}' created.`);
  });
});

// Handle /viewtasks command
bot.onText(/\/viewtasks/, async (msg) => {
  const tasks = await getTasks();
  const response = tasks
    .map(
      (task) =>
        `${task.title} - ${task.description} (Due: ${task.deadline}, Priority: ${task.priority}, Category: ${task.category}, Completed: ${task.completed})`
    )
    .join("\n\n");
  bot.sendMessage(msg.chat.id, `Tasks:\n${response}`);
});

// Handle /updatetask command
bot.onText(/\/updatetask (.+)/, async (msg, match) => {
  const taskId = match[1];
  bot.sendMessage(
    msg.chat.id,
    "Enter the new task details in the following format:\nTitle, Description, Deadline (YYYY-MM-DD), Priority, Category"
  );
  bot.once("message", async (responseMsg) => {
    const [title, description, deadline, priority, category] =
      responseMsg.text.split(", ");
    const task = await updateTask(taskId, {
      title,
      description,
      deadline,
      priority,
      category,
    });
    bot.sendMessage(msg.chat.id, `Task '${task.title}' updated.`);
  });
});

// Handle /deletetask command
bot.onText(/\/deletetask (.+)/, async (msg, match) => {
  const taskId = match[1];
  await deleteTask(taskId);
  bot.sendMessage(msg.chat.id, `Task '${taskId}' deleted.`);
});

// Handle /markasdone command
bot.onText(/\/markasdone (.+)/, async (msg, match) => {
  const taskId = match[1];
  await markAsDone(taskId);
  bot.sendMessage(msg.chat.id, `Task '${taskId}' marked as done.`);
});

// Reminder system
cron.schedule("* * * * *", async () => {
  const tasks = await getTasks();
  const now = new Date();
  tasks.forEach((task) => {
    if (new Date(task.deadline) <= now && !task.completed) {
      bot.sendMessage(chatId, `Reminder: Task '${task.title}' is due.`);
    }
  });
});
