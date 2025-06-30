const mongoose = require("mongoose");

const dailyEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true }, // örn: "2025-04-17"
  note: { type: String },
  hoursWorked: { type: Number, default: 0 }
});

dailyEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("DailyEntry", dailyEntrySchema);
