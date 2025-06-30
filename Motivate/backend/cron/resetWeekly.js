const cron = require("node-cron");
const Task = require("../models/Task");
const DailyEntry = require("../models/DailyEntry");

// Her Pazartesi saat 00:00'da çalışır
const startWeeklyResetJob = () => {
  cron.schedule("0 0 * * 1", async () => {
    try {
      await Task.deleteMany({});
      await DailyEntry.deleteMany({});
      console.log("🧹 weekly data succesfully deleted .");
    } catch (err) {
      console.error("❌ error about reset operation:", err);
    }
  });
};

module.exports = startWeeklyResetJob;
