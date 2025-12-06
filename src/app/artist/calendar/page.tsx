"use client";

import { useEffect, useState } from "react";
import { ArtistLayout } from "@/components/layout/artist-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { artistService } from "@/services/artist.service";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User } from "lucide-react";
import { toast } from "sonner";
import { formatLKR } from "@/lib/utils/currency";

interface Booking {
  _id: string;
  customer: {
    name: string;
    email: string;
  };
  service: string;
  date: string;
  bookingDate?: string;
  startTime?: string;
  endTime?: string;
  location: string;
  status: string;
  totalAmount: number;
}

export default function ArtistCalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await artistService.getBookings();
      if (response.success && response.data) {
        setBookings(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch bookings", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const getBookingsForDate = (date: Date) => {
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.bookingDate || booking.date);
      return isSameDay(bookingDate, date);
    });
  };

  const hasBookingsOnDate = (date: Date) => {
    return getBookingsForDate(date).length > 0;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "accepted":
      case "confirmed":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "rejected":
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "pending":
        return "secondary";
      case "accepted":
      case "confirmed":
        return "default";
      case "completed":
        return "outline";
      case "rejected":
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const calendarDays = generateCalendarDays();
  const selectedDateBookings = selectedDate ? getBookingsForDate(selectedDate) : [];

  return (
    <ArtistLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">View your booking schedule</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendar */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={goToToday}>
                    Today
                  </Button>
                  <Button variant="outline" size="icon" onClick={previousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">Loading calendar...</p>
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-2">
                  {/* Day names */}
                  {dayNames.map((day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-semibold text-muted-foreground py-2"
                    >
                      {day}
                    </div>
                  ))}

                  {/* Calendar days */}
                  {calendarDays.map((day, index) => {
                    if (day === null) {
                      return <div key={`empty-${index}`} className="aspect-square" />;
                    }

                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const isToday = isSameDay(date, new Date());
                    const isSelected = selectedDate && isSameDay(date, selectedDate);
                    const hasBookings = hasBookingsOnDate(date);
                    const dayBookings = getBookingsForDate(date);

                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(date)}
                        className={`
                          aspect-square p-2 rounded-lg border-2 transition-all
                          ${isSelected ? "border-primary bg-primary/10" : "border-transparent hover:border-gray-200"}
                          ${isToday ? "bg-blue-50 font-bold" : ""}
                          ${hasBookings ? "bg-green-50" : ""}
                          relative
                        `}
                      >
                        <div className="text-sm">{day}</div>
                        {hasBookings && (
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                            {dayBookings.slice(0, 3).map((booking, i) => (
                              <div
                                key={i}
                                className={`w-1.5 h-1.5 rounded-full ${getStatusColor(booking.status)}`}
                              />
                            ))}
                            {dayBookings.length > 3 && (
                              <div className="text-[8px] ml-0.5">+{dayBookings.length - 3}</div>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Legend */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm font-semibold mb-3">Status Legend:</p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-xs">Pending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-xs">Confirmed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-xs">Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-xs">Cancelled</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Date Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {selectedDate
                  ? selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })
                  : "Select a date"}
              </CardTitle>
              <CardDescription>
                {selectedDateBookings.length > 0
                  ? `${selectedDateBookings.length} booking${selectedDateBookings.length > 1 ? "s" : ""}`
                  : "No bookings"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                <div className="space-y-4">
                  {selectedDateBookings.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p className="text-sm">No bookings on this date</p>
                    </div>
                  ) : (
                    selectedDateBookings.map((booking) => (
                      <div
                        key={booking._id}
                        className="p-4 border rounded-lg space-y-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">{booking.service}</h4>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <User className="h-3 w-3" />
                              <span>{booking.customer?.name || "N/A"}</span>
                            </div>
                          </div>
                          <Badge variant={getStatusBadgeVariant(booking.status)} className="capitalize">
                            {booking.status}
                          </Badge>
                        </div>

                        {booking.startTime && booking.endTime && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {booking.startTime} - {booking.endTime}
                            </span>
                          </div>
                        )}

                        <div className="text-sm">
                          <p className="text-muted-foreground">{booking.location}</p>
                          <p className="font-semibold mt-1">{formatLKR(booking.totalAmount)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <CalendarIcon className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p>Click on a date to view bookings</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Bookings Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardDescription>Your next scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground py-4">Loading...</p>
            ) : (
              <div className="space-y-3">
                {bookings
                  .filter((booking) => {
                    const bookingDate = new Date(booking.bookingDate || booking.date);
                    return bookingDate >= new Date() && ["pending", "accepted", "confirmed"].includes(booking.status);
                  })
                  .sort((a, b) => {
                    const dateA = new Date(a.bookingDate || a.date);
                    const dateB = new Date(b.bookingDate || b.date);
                    return dateA.getTime() - dateB.getTime();
                  })
                  .slice(0, 5)
                  .map((booking) => (
                    <div
                      key={booking._id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(booking.status)}`} />
                          <div>
                            <p className="font-medium">{booking.service}</p>
                            <p className="text-sm text-muted-foreground">{booking.customer?.name}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {new Date(booking.bookingDate || booking.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        {booking.startTime && (
                          <p className="text-xs text-muted-foreground">{booking.startTime}</p>
                        )}
                      </div>
                    </div>
                  ))}
                {bookings.filter((b) => {
                  const bookingDate = new Date(b.bookingDate || b.date);
                  return bookingDate >= new Date() && ["pending", "accepted", "confirmed"].includes(b.status);
                }).length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No upcoming bookings</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ArtistLayout>
  );
}
