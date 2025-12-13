/**
 * Format time from 24-hour format to 12-hour format with AM/PM
 * @param time24 - Time in 24-hour format (e.g., "14:30", "09:00")
 * @returns Formatted time in 12-hour format (e.g., "2:30 PM", "9:00 AM")
 */
export function formatTime12Hour(time24: string): string {
  if (!time24) return "";
  
  const [hours, minutes] = time24.split(":").map(Number);
  
  if (isNaN(hours) || isNaN(minutes)) return time24;
  
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

/**
 * Format time range from 24-hour format to clean 12-hour format
 * @param startTime - Start time in 24-hour format
 * @param endTime - End time in 24-hour format
 * @returns Formatted time range (e.g., "2:00 PM - 4:30 PM")
 */
export function formatTimeRange(startTime: string, endTime: string): string {
  if (!startTime || !endTime) {
    if (startTime) return formatTime12Hour(startTime);
    return "Time not set";
  }
  
  return `${formatTime12Hour(startTime)} - ${formatTime12Hour(endTime)}`;
}
