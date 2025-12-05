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
import { formatLKR } from "@/lib/utils/currency";

// ... imports

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
        try {
            const response = await adminService.getPayments(); 
            if (response.success && response.data) {
                setPayments(response.data as any[]);
            }
        } catch (error) {
            console.error("Failed to fetch payments", error);
            toast.error("Failed to load payments");
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
                    <TableCell>{formatLKR(payment.totalAmount)}</TableCell>
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
