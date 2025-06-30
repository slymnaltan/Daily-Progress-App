const Task = require("../models/Task");

exports.addTask = async (req, res) => {
  const { title } = req.body;

  try {
    const task = await Task.create({ userId: req.userId, title });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Could not create task" });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ date: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch tasks" });
  }
};

exports.completeTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { isCompleted: true },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Could not update task" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Could not delete task" });
  }
};
