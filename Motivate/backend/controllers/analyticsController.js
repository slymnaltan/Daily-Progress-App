const Task = require("../models/Task");
const DailyEntry = require("../models/DailyEntry");
const { getWeekRange } = require("../utils/dateUtils");

exports.getWeeklyAnalytics = async (req, res) => {
  try {
    // Get date range
    const today = new Date();
    const { start, end } = getWeekRange(today);
    
    // Format dates for comparison
    const startStr = start.toISOString().split('T')[0]; // YYYY-MM-DD
    const endStr = end.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Debug
    console.log("Date Range:", { startStr, endStr });

    // Find tasks for this week - using Date objects for Task model
    const tasks = await Task.find({
      userId: req.userId,
      date: { $gte: start, $lte: end }
    });
    
    // Find entries for this week - using string dates for DailyEntry model
    const entries = await DailyEntry.find({
      userId: req.userId,
      date: { $gte: startStr, $lte: endStr }
    });

    console.log(`Found ${tasks.length} tasks and ${entries.length} entries`);

    // Calculate summary metrics - use isCompleted instead of completed
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.isCompleted).length;
    const totalHours = entries.reduce((sum, e) => sum + (Number(e.hoursWorked) || 0), 0);
    const dailyAverage = entries.length > 0 ? (totalHours / entries.length) : 0;

    // Generate daily stats for each day of the week
    const dailyStats = [];
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      
      // Format date as YYYY-MM-DD for comparison
      const currentDateStr = currentDate.toISOString().split('T')[0];
      
      // Filter tasks for this specific day
      const tasksOfDay = tasks.filter(task => {
        // Compare Date objects by converting to string format
        const taskDateStr = task.date.toISOString().split('T')[0];
        return taskDateStr === currentDateStr;
      });
      
      // Find entry for this specific day - DailyEntry date is already a string
      const entryOfDay = entries.find(entry => entry.date === currentDateStr);

      // Add stats for this day
      dailyStats.push({
        date: currentDateStr,
        totalTasks: tasksOfDay.length,
        completedTasks: tasksOfDay.filter(t => t.isCompleted).length,
        hoursWorked: entryOfDay ? Number(entryOfDay.hoursWorked || 0) : 0
      });
    }

    // Send response
    res.json({
      week: {
        start: startStr,
        end: endStr
      },
      totalTasks,
      completedTasks,
      completionRate: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0,
      totalHours,
      dailyAverage: dailyAverage.toFixed(1),
      dailyStats
    });

  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ 
      message: "Analiz verileri alınamadı",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};