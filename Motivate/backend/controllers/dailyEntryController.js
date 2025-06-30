const DailyEntry = require("../models/DailyEntry");

exports.addOrUpdateEntry = async (req, res) => {
  const { date, note, hoursWorked } = req.body;

  try {
    const entry = await DailyEntry.findOneAndUpdate(
      { userId: req.userId, date },
      { note, hoursWorked },
      { new: true, upsert: true } // yoksa oluşturur
    );
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: "Günlük verisi kaydedilemedi" });
  }
};

exports.getEntryByDate = async (req, res) => {
  const { date } = req.params;

  try {
    const entry = await DailyEntry.findOne({ userId: req.userId, date });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: "Veri alınamadı" });
  }
};

exports.getWeeklyEntries = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const entries = await DailyEntry.find({
      userId: req.userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: "Veriler alınamadı" });
  }
};
