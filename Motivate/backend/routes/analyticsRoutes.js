const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getWeeklyAnalytics } = require("../controllers/analyticsController");

router.get("/weekly", auth, getWeeklyAnalytics); 

module.exports = router;
