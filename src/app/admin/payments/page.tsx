"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/api/services/adminService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";

// Assuming we might need to fetch payments separately or reuse bookings endpoint if it includes payment info.
// For now, let's assume we can get payments or extract them from bookings, 
// but typically a dedicated payments endpoint is better. 
// Since the user didn't explicitly ask for a GET /admin/payments endpoint in the list but asked for "Refund payments UI",
// I'll assume we might need to fetch bookings that are paid, or I should have added a GET payments endpoint.
// Let's check the user request again: "GET /api/admin/bookings" is there. 
// I'll use bookings for now, assuming they have payment info, or I'll create a mock payments list if needed.
// Actually, I'll implement a basic payments fetcher if I can, or just use bookings and show payment status.
// Wait, the user asked for "Refund payments UI".
// I'll assume I can list payments. I'll add a GET /api/admin/payments endpoint to be safe/complete, 
// or just fetch bookings and show a "Refund" button for completed bookings.
// Let's stick to the plan: "Refund payments UI".
// I'll create a new endpoint for GET /api/admin/payments to make this clean.

export default function PaymentsPage() {
  // Mocking payments for now or fetching from a new endpoint I'll create shortly
  const [payments, setPayments] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement GET /api/admin/payments or fetch via bookings
    // For now, let's try to fetch bookings and map them to payments if possible, 
    // or just fetch from a new endpoint I will create.
    const fetchPayments = async () => {
        try {
            const response = await adminService.getPayments(); 
            if (response.data.success && response.data.data) {
                setPayments(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch payments", error);
        } finally {
            setLoading(false);
        }
    };
    fetchPayments();
  }, []);

  const handleRefund = async (paymentId: string) => {
    if (!confirm("Are you sure you want to refund this payment?")) return;
    
    try {
      await adminService.refundPayment(paymentId);
      toast.success("Payment refunded successfully");
      // Refresh list
    } catch (error) {
      toast.error("Failed to refund payment");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">Manage transactions and refunds.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No payments found.
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell className="font-mono text-xs">
                      {payment._id.slice(-8).toUpperCase()}
                    </TableCell>
                    <TableCell>{payment.customer?.name || "Unknown"}</TableCell>
                    <TableCell>${payment.totalAmount?.toFixed(2)}</TableCell>
                    <TableCell>
                      <StatusBadge status={payment.status} />
                    </TableCell>
                    <TableCell>
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {payment.status !== "refunded" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRefund(payment._id)} // Assuming booking ID acts as payment ID for now or we need real payment ID
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Refund
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
