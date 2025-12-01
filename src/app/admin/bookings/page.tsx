"use client";

import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminBookings } from "@/hooks/useAdminHooks";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminBookingsPage() {
  const { bookings, loading } = useAdminBookings();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">All Bookings</h1>
          <p className="text-muted-foreground">View all platform bookings</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Booking List</CardTitle>
            <CardDescription>Complete list of all bookings in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">No bookings found</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Artist</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking._id}>
                        <TableCell className="font-medium">{booking.service || "N/A"}</TableCell>
                        <TableCell>
                          {typeof booking.customer === 'object' ? booking.customer.name : "N/A"}
                        </TableCell>
                        <TableCell>
                          {typeof booking.artist === 'object' ? booking.artist.name : "N/A"}
                        </TableCell>
                        <TableCell>
                          {booking.date ? new Date(booking.date).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell>{booking.location || "N/A"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              booking.status === "completed"
                                ? "default"
                                : booking.status === "accepted"
                                ? "secondary"
                                : booking.status === "cancelled"
                                ? "destructive"
                                : "outline"
                            }
                            className="capitalize"
                          >
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
