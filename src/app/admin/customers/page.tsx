"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { AdminLayout } from "@/components/layouts/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { nextApi } from "@/lib/api";
import { toast } from "sonner";

interface Customer {
  _id: string;
  id?: string; // For backward compatibility
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  status: string;
  createdAt: string;
}

export default function CustomerApprovalsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, loading, router]);

  const fetchCustomers = async () => {
    setLoadingData(true);
    const response = await nextApi.get<Customer[]>("/api/admin/customers/pending");
    if (response.success && response.data) {
      setCustomers(response.data);
    }
    setLoadingData(false);
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchCustomers();
    }
  }, [user]);



  const handleAction = async () => {
    if (!selectedCustomer || !action) return;

    setProcessing(true);
    const endpoint = `/api/admin/customers/${selectedCustomer.id}/${action}`;
    const response = await nextApi.put(endpoint);

    if (response.success) {
      toast.success(`Customer ${action === "approve" ? "approved" : "rejected"} successfully`);
      setCustomers(customers.filter((c) => c.id !== selectedCustomer.id));
    } else {
      toast.error(response.error || "Action failed");
    }

    setProcessing(false);
    setSelectedCustomer(null);
    setAction(null);
  };

  if (loading || !user || user.role !== "admin") {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Customer Approvals</h1>

        {loadingData ? (
          <p>Loading...</p>
        ) : customers.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">No pending customer registrations</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {customers.map((customer) => (
              <Card key={customer.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{customer.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{customer.email}</p>
                    </div>
                    <Badge variant="secondary">{customer.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-gray-600">{customer.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-gray-600">
                        {customer.address.street}, {customer.address.city},{" "}
                        {customer.address.state} {customer.address.zipCode},{" "}
                        {customer.address.country}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setAction("approve");
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setAction("reject");
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <AlertDialog open={!!selectedCustomer && !!action} onOpenChange={() => {
          setSelectedCustomer(null);
          setAction(null);
        }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {action === "approve" ? "Approve Customer" : "Reject Customer"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to {action} {selectedCustomer?.name}? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleAction} disabled={processing}>
                {processing ? "Processing..." : "Confirm"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}