const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  addOrUpdateEntry,
  getEntryByDate,
  getWeeklyEntries
} = require("../controllers/dailyEntryController");

router.post("/", auth, addOrUpdateEntry);
router.get("/:date", auth, getEntryByDate);
router.get("/", auth, getWeeklyEntries); // ?startDate=2025-04-14&endDate=2025-04-20

module.exports = router;
