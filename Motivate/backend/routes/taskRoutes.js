const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  addTask,
  getTasks,
  completeTask,
  deleteTask
} = require("../controllers/taskControllers");

router.post("/", auth, addTask);
router.get("/", auth, getTasks);
router.patch("/:id", auth, completeTask);
router.delete("/:id", auth, deleteTask);

module.exports = router;
