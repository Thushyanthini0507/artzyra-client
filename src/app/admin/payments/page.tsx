"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { AdminLayout } from "@/components/layout/admin-layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { toast } from "sonner";
import { RotateCcw, DollarSign, CreditCard, Calendar, Search, RefreshCcw } from "lucide-react";
import { formatLKR } from "@/lib/utils/currency";
import { Input } from "@/components/ui/input";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPayments = async () => {
    setLoading(true);
    try {
        const response = await adminService.getPayments(); 
        if (response.success && response.data) {
            // Sort by date (newest first)
            const sortedPayments = (response.data as any[]).sort((a, b) => {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            setPayments(sortedPayments);
        }
    } catch (error) {
        console.error("Failed to fetch payments", error);
        toast.error("Failed to load payments");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleRefund = async (paymentId: string) => {
    if (!confirm("Are you sure you want to refund this payment?")) return;
    
    try {
      await adminService.refundPayment(paymentId);
      toast.success("Payment refunded successfully");
      fetchPayments();
    } catch (error) {
      toast.error("Failed to refund payment");
    }
  };

  const filteredPayments = payments.filter((payment) => {
    return (
      payment._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalRevenue = payments
    .filter(p => p.status === "completed" || p.status === "succeeded")
    .reduce((acc, curr) => acc + (curr.totalAmount || curr.amount || 0), 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Payments & Transactions
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor revenue and manage refunds.
            </p>
          </div>
          <Button 
            onClick={fetchPayments} 
            variant="outline" 
            disabled={loading}
            className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/30 text-white hover:text-white transition-all"
          >
            <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/20 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-400">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatLKR(totalRevenue)}</div>
              <p className="text-xs text-emerald-500/70 mt-1">Lifetime earnings</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-400">Transactions</CardTitle>
              <CreditCard className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{payments.length}</div>
              <p className="text-xs text-blue-500/70 mt-1">Total payments processed</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-md shadow-xl">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-xl text-white">Transaction History</CardTitle>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transaction ID or customer..."
                  className="pl-9 bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 opacity-50" />
                </div>
                <p className="text-lg font-medium">No transactions found</p>
              </div>
            ) : (
              <div className="rounded-md border border-white/10 overflow-hidden">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-gray-300">Transaction ID</TableHead>
                      <TableHead className="text-gray-300">Customer</TableHead>
                      <TableHead className="text-gray-300">Amount</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Date</TableHead>
                      <TableHead className="text-right text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment._id} className="border-white/10 hover:bg-white/5 transition-colors">
                        <TableCell className="font-mono text-xs text-purple-300">
                          {payment._id.slice(-8).toUpperCase()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400">
                              {payment.customer?.name?.charAt(0) || "C"}
                            </div>
                            <span className="text-gray-200">{payment.customer?.name || "Unknown"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-white">
                          {formatLKR(payment.totalAmount || payment.amount)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={payment.status} />
                        </TableCell>
                        <TableCell className="text-gray-400 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {payment.status !== "refunded" && 
                           (payment.status === "succeeded" || payment.status === "completed" || payment.status === "paid") && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive border-destructive/30 hover:bg-destructive/20 hover:text-destructive transition-all"
                              onClick={() => handleRefund(payment._id)}
                            >
                              <RotateCcw className="mr-2 h-3 w-3" />
                              Refund
                            </Button>
                          )}
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
