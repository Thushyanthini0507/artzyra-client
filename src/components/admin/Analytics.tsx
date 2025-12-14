"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { adminService } from "@/services/admin.service";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Users, DollarSign, ShoppingBag, Calendar, Activity } from "lucide-react";
import { toast } from "sonner";
import { formatLKR } from "@/lib/utils/currency";

interface AnalyticsData {
  period: string;
  startDate: string;
  endDate: string;
  userRegistrations: Array<{
    date: string;
    artists: number;
    customers: number;
  }>;
  bookingsOverTime: Array<{
    date: string;
    pending: number;
    accepted: number;
    completed: number;
    cancelled: number;
    rejected: number;
    totalAmount: number;
  }>;
  revenueOverTime: Array<{
    _id: string;
    revenue: number;
    count: number;
  }>;
  bookingsByStatus: Array<{
    _id: string;
    count: number;
    totalAmount: number;
  }>;
  revenueByCategory: Array<{
    _id: string;
    categoryName: string;
    revenue: number;
    bookings: number;
  }>;
  topArtistsByBookings: Array<{
    artistId: string;
    artistName: string;
    bookings: number;
    revenue: number;
  }>;
  monthlySummary: Array<{
    _id: string;
    bookings: number;
    revenue: number;
  }>;
}

const COLORS = ["#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899"];

const PERIODS = [
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "90d", label: "3 Months" },
  { value: "1y", label: "1 Year" },
  { value: "all", label: "All Time" },
];

export function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30d");

  const fetchAnalytics = async (selectedPeriod: string) => {
    try {
      setLoading(true);
      const response = await adminService.getAnalytics(selectedPeriod);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        toast.error("Failed to load analytics data");
      }
    } catch (error: any) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(period);
  }, [period]);

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Analytics</h2>
            <p className="text-muted-foreground">Platform performance metrics</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-white/10 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <Activity className="h-12 w-12 text-gray-500 mb-4" />
            <p className="text-lg font-medium text-white">No analytics data available</p>
            <p className="text-sm text-gray-400">Try selecting a different time period</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate summary stats
  const totalUsers = data.userRegistrations.reduce(
    (sum, day) => sum + day.artists + day.customers,
    0
  );
  const totalRevenue = data.revenueOverTime.reduce((sum, day) => sum + day.revenue, 0);
  const totalBookings = data.bookingsByStatus.reduce((sum, status) => sum + status.count, 0);
  const completedBookings = data.bookingsByStatus.find((s) => s._id === "completed")?.count || 0;

  // Format revenue over time for chart
  const revenueChartData = data.revenueOverTime.map((item) => ({
    date: new Date(item._id).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    revenue: item.revenue,
  }));

  // Format bookings by status for pie chart
  const bookingsStatusData = data.bookingsByStatus.map((item) => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.count,
    amount: item.totalAmount,
  }));

  // Format revenue by category
  const categoryRevenueData = data.revenueByCategory.map((item) => ({
    name: item.categoryName || "Unknown",
    revenue: item.revenue,
    bookings: item.bookings,
  }));

  // Format top artists
  const topArtistsData = data.topArtistsByBookings.map((item) => ({
    name: item.artistName || "Unknown",
    bookings: item.bookings,
    revenue: item.revenue,
  }));

  const CustomTooltip = ({ active, payload, label, formatter }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1625] border border-white/10 p-3 rounded-lg shadow-xl">
          <p className="text-gray-300 text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-gray-400">{entry.name}:</span>
              <span className="text-white font-medium">
                {formatter ? formatter(entry.value) : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Analytics Overview
          </h2>
          <p className="text-muted-foreground mt-1">
            Detailed insights into platform performance.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 bg-black/20 p-1 rounded-lg border border-white/5">
          {PERIODS.map((p) => (
            <Button
              key={p.value}
              variant="ghost"
              size="sm"
              onClick={() => setPeriod(p.value)}
              className={`
                text-sm transition-all rounded-md
                ${period === p.value 
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"}
              `}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-purple-500/20 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-400">New Users</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalUsers}</div>
            <p className="text-xs text-purple-500/70 mt-1">
              {data.userRegistrations.length} days tracked
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/20 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-400">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatLKR(totalRevenue)}</div>
            <p className="text-xs text-emerald-500/70 mt-1">
              {data.revenueOverTime.length} days tracked
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-400">Total Bookings</CardTitle>
            <ShoppingBag className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalBookings}</div>
            <p className="text-xs text-blue-500/70 mt-1">{completedBookings} completed</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-orange-500/20 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-400">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {totalBookings > 0
                ? Math.round((completedBookings / totalBookings) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-orange-500/70 mt-1">Booking success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* User Registrations Over Time */}
        <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white">User Growth</CardTitle>
            <CardDescription className="text-gray-400">New artists and customers over time</CardDescription>
          </CardHeader>
          <CardContent>
            {data.userRegistrations.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.userRegistrations}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    stroke="#ffffff20"
                  />
                  <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} stroke="#ffffff20" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="artists"
                    stroke="#8b5cf6"
                    name="Artists"
                    strokeWidth={3}
                    dot={{ fill: "#8b5cf6", strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: "#fff" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="customers"
                    stroke="#10b981"
                    name="Customers"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: "#fff" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue Over Time */}
        <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white">Revenue Trend</CardTitle>
            <CardDescription className="text-gray-400">Daily revenue from completed payments</CardDescription>
          </CardHeader>
          <CardContent>
            {revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueChartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    stroke="#ffffff20"
                  />
                  <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} stroke="#ffffff20" />
                  <Tooltip 
                    content={<CustomTooltip formatter={(val: any) => formatLKR(val)} />} 
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bookings by Status */}
        <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white">Booking Status</CardTitle>
            <CardDescription className="text-gray-400">Distribution of booking outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            {bookingsStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={bookingsStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {bookingsStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.5)" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue by Category */}
        <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white">Revenue by Category</CardTitle>
            <CardDescription className="text-gray-400">Top performing categories</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryRevenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    stroke="#ffffff20"
                  />
                  <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} stroke="#ffffff20" />
                  <Tooltip 
                    content={<CustomTooltip formatter={(val: any) => formatLKR(val)} />} 
                  />
                  <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Artists */}
      {topArtistsData.length > 0 && (
        <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white">Top Artists</CardTitle>
            <CardDescription className="text-gray-400">Most booked artists in the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topArtistsData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#9ca3af" }} stroke="#ffffff20" />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  width={150}
                  stroke="#ffffff20"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="bookings" fill="#8b5cf6" name="Bookings" radius={[0, 4, 4, 0]} />
                <Bar dataKey="revenue" fill="#10b981" name="Revenue (LKR)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
