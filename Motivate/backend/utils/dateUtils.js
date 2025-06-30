/**
 * Gets the start and end dates for the week containing the given date
 * @param {Date} date - The date to get the week range for
 * @returns {Object} An object with start and end dates
 */
exports.getWeekRange = (date) => {
  const currentDate = new Date(date);
  const day = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Calculate the date of Monday (start of week)
  // If day is 0 (Sunday), go back 6 days to get to Monday
  // Otherwise, go back (day - 1) days
  const start = new Date(currentDate);
  start.setDate(currentDate.getDate() - (day === 0 ? 6 : day - 1));
  start.setHours(0, 0, 0, 0); // Set to beginning of day
  
  // Calculate the date of Sunday (end of week)
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999); // Set to end of day
  
  return { start, end };
};