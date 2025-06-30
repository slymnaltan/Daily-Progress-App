const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getWeeklyAnalytics } = require("../controllers/analyticsController");

router.get("/weekly", auth, getWeeklyAnalytics); 
// /api/analytics/weekly?startDate=2025-04-14&endDate=2025-04-20

module.exports = router;
