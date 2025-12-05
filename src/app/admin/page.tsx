"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { adminService, DashboardStats } from "@/lib/api/services/adminService";
import { Users, Palette, ShoppingBag, Clock } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalArtists: 0,
    pendingArtists: 0,
    totalBookings: 0,
    pendingBookings: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getDashboardStatus();
        console.log("Dashboard response:", response);
        
        if (response.success && response.data) {
          const statsData = response.data as DashboardStats;
          setStats(statsData);
        } else if (response.error) {
          console.error("Dashboard error:", response.error);
        }
      } catch (error: any) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };
    fetchStats();
  }, []);

  const totalUsers = stats.totalCustomers + stats.totalArtists;

  const cards = [
    {
      title: "Total Users",
      value: totalUsers,
      description: "Customers & Artists",
      icon: Users,
    },
    {
      title: "Pending Artists",
      value: stats.pendingArtists,
      description: "Awaiting Approval",
      icon: Palette,
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      description: "All time bookings",
      icon: ShoppingBag,
    },
    {
      title: "Pending Bookings",
      value: stats.pendingBookings,
      description: "Active requests",
      icon: Clock,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your platform's performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value || 0}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              You have {stats.pendingArtists} pending artist approvals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Activity feed coming soon...
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Platform breakdown</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Customers</span>
                  <span className="font-bold">{stats.totalCustomers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Artists</span>
                  <span className="font-bold">{stats.totalArtists}</span>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
