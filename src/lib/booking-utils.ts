/**
 * Utility functions for booking availability checking
 */

/**
 * Checks if two time ranges overlap
 * 
 * Time overlap logic: (newStart < existingEnd) AND (newEnd > existingStart)
 * 
 * @param newStart - Start time of the new booking (HH:MM format)
 * @param newEnd - End time of the new booking (HH:MM format)
 * @param existingStart - Start time of existing booking (HH:MM format)
 * @param existingEnd - End time of existing booking (HH:MM format)
 * @returns true if the time ranges overlap, false otherwise
 */
export function hasTimeOverlap(
  newStart: string,
  newEnd: string,
  existingStart: string,
  existingEnd: string
): boolean {
  // Convert time strings to minutes for easier comparison
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const newStartMinutes = timeToMinutes(newStart);
  const newEndMinutes = timeToMinutes(newEnd);
  const existingStartMinutes = timeToMinutes(existingStart);
  const existingEndMinutes = timeToMinutes(existingEnd);

  // Check overlap: (newStart < existingEnd) AND (newEnd > existingStart)
  return newStartMinutes < existingEndMinutes && newEndMinutes > existingStartMinutes;
}

/**
 * Checks if a booking date/time overlaps with existing bookings
 * 
 * @param artistId - The artist's ID
 * @param bookingDate - The date of the booking (YYYY-MM-DD or Date)
 * @param startTime - Start time (HH:MM format)
 * @param endTime - End time (HH:MM format)
 * @param existingBookings - Array of existing bookings for the artist
 * @returns true if there's an overlap, false otherwise
 */
export function checkBookingAvailability(
  artistId: string,
  bookingDate: string | Date,
  startTime: string,
  endTime: string,
  existingBookings: Array<{
    artist: any;
    bookingDate: Date | string;
    startTime: string;
    endTime: string;
    status: string;
  }>
): { available: boolean; conflictingBooking?: any } {
  // Convert bookingDate to Date if it's a string
  const targetDate = typeof bookingDate === "string" ? new Date(bookingDate) : bookingDate;
  const targetDateStr = targetDate.toISOString().split("T")[0];

  // Filter bookings for the same artist on the same date with active statuses
  const activeStatuses = ["pending", "accepted", "confirmed"];
  const sameDayBookings = existingBookings.filter((booking) => {
    if (booking.artist?.toString() !== artistId && booking.artist?._id?.toString() !== artistId) {
      return false;
    }

    const bookingDateObj = booking.bookingDate instanceof Date 
      ? booking.bookingDate 
      : new Date(booking.bookingDate);
    const bookingDateStr = bookingDateObj.toISOString().split("T")[0];

    return (
      bookingDateStr === targetDateStr &&
      activeStatuses.includes(booking.status)
    );
  });

  // Check for time overlaps
  for (const booking of sameDayBookings) {
    if (hasTimeOverlap(startTime, endTime, booking.startTime, booking.endTime)) {
      return {
        available: false,
        conflictingBooking: booking,
      };
    }
  }

  return { available: true };
}

