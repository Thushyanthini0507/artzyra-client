"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminService, DashboardStats } from "@/services/admin.service";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Analytics } from "@/components/admin/Analytics";
import { 
  Users, 
  Palette, 
  ShoppingBag, 
  Clock, 
  UserCheck, 
  AlertCircle, 
  TrendingUp,
  DollarSign,
  CheckCircle,
  XCircle,
  ArrowRight,
  Activity
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface RecentUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  createdAt?: string;
}

interface Booking {
  _id: string;
  customer?: { name: string; email: string };
  artist?: { name: string; email: string };
  status: string;
  createdAt?: string;
  totalAmount?: number;
}

interface Payment {
  _id: string;
  amount: number;
  status: string;
  createdAt?: string;
  booking?: { _id: string };
}

interface PendingArtist {
  _id: string;
  name: string;
  email: string;
  status: string;
  createdAt?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: userLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalArtists: 0,
    pendingArtists: 0,
    totalBookings: 0,
    pendingBookings: 0,
  });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [pendingArtistsList, setPendingArtistsList] = useState<PendingArtist[]>([]);
  const [allArtists, setAllArtists] = useState<any[]>([]);
  const [allCustomers, setAllCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Protect admin route - redirect non-admins immediately
  useEffect(() => {
    if (!userLoading) {
      // If no user, try to decode from JWT token as fallback
      if (!user) {
        const token = typeof window !== "undefined" 
          ? (document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || localStorage.getItem("token"))
          : null;
        
        if (token) {
          try {
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              const userRole = String(payload.role || "").toLowerCase().trim();
              console.log("🔵 AdminDashboard - Decoded role from JWT:", userRole);
              
              if (userRole === "admin") {
                console.log("✅ AdminDashboard - Admin role found in JWT, allowing access");
                // Don't redirect - user is admin, just wait for context to update
                return;
              } else {
                console.log("🔴 AdminDashboard - Non-admin role in JWT, redirecting. Role:", userRole);
                if (userRole === "artist") {
                  router.replace("/artist/dashboard");
                } else if (userRole === "customer") {
                  router.replace("/customer");
                } else {
                  router.replace("/");
                }
                return;
              }
            }
          } catch (e) {
            console.warn("🔵 AdminDashboard - Could not decode JWT:", e);
          }
        }
        
        console.log("🔴 AdminDashboard - No user and no valid token, redirecting to home");
        router.replace("/");
      } else if (user.role !== "admin") {
        console.log("🔴 AdminDashboard - User is not admin, role is:", user.role);
        // Redirect based on actual role
        if (user.role === "artist") {
          console.log("🔴 AdminDashboard - Redirecting artist to /artist/dashboard");
          router.replace("/artist/dashboard");
        } else if (user.role === "customer") {
          router.replace("/customer");
        } else {
          router.replace("/");
        }
      } else {
        console.log("✅ AdminDashboard - User is admin, showing dashboard");
      }
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    // Only fetch data if user is loaded and is an admin
    if (userLoading || !user || user.role !== "admin") {
      console.log("🔵 Admin Dashboard - Skipping data fetch. Loading:", userLoading, "User:", user ? user.role : "none");
      return;
    }

    const fetchData = async () => {
      // Track if we got a successful API response (used to determine if we should use API values or fetched data)
      let apiStatsReceived = false;
      
      try {
        setLoading(true);
        console.log("🔵 Admin Dashboard - Fetching stats...");
        
        // Fetch dashboard stats
        const statsResponse = await adminService.getDashboardStatus();
        console.log("🔵 Admin Dashboard - Response:", statsResponse);
        
        if (statsResponse.success && statsResponse.data) {
          // API returns data.stats, not data directly
          const statsData = statsResponse.data.stats || statsResponse.data;
          console.log("🔵 Admin Dashboard - Setting stats:", statsData);
          // Ensure all values are numbers, not NaN or undefined
          // Use the API values directly (even if 0) - these are the source of truth
          setStats({
            totalCustomers: Number(statsData.totalCustomers) ?? 0,
            totalArtists: Number(statsData.totalArtists) ?? 0,
            pendingArtists: Number(statsData.pendingArtists) ?? 0, // Will be updated from pending artists fetch
            totalBookings: Number(statsData.totalBookings) ?? 0,
            pendingBookings: Number(statsData.pendingBookings) ?? 0,
          });
          apiStatsReceived = true;
        } else if ('error' in statsResponse && statsResponse.error) {
          console.error("🔴 Admin Dashboard - Error:", statsResponse.error);
          // Don't show error toast - we'll calculate from fetched data instead
          console.log("🔵 Admin Dashboard - Will calculate stats from fetched data");
        }
        
        // Fetch all data in parallel (optional - don't break dashboard if any fails)
        // IMPORTANT: Fetch pending artists FIRST so we can use it as fallback
        const [
          pendingArtistsResult,
          usersResult,
          bookingsResult,
          paymentsResult,
        ] = await Promise.allSettled([
          // Fetch pending artists FIRST (most important for admin)
          adminService.getPendingArtists().catch((e) => {
            console.warn("🔵 Admin Dashboard - Pending artists fetch failed, will use fallback:", e);
            return { success: false, data: [] };
          }),
          // Fetch users (will be used as fallback for pending artists)
          Promise.allSettled([
            adminService.getUsers("artist").catch(() => ({ success: false, data: [] })),
            adminService.getUsers("customer").catch(() => ({ success: false, data: [] })),
          ]),
          // Fetch bookings
          adminService.getBookings().catch(() => ({ success: false, data: [] })),
          // Fetch payments
          adminService.getPayments().catch(() => ({ success: false, data: [] })),
        ]);

        // Process users and calculate stats
        try {
          if (usersResult.status === "fulfilled") {
            const [artistsResponse, customersResponse] = usersResult.value as PromiseSettledResult<any>[];
            const allUsers: RecentUser[] = [];
            let totalArtistsCount = 0;
            let totalCustomersCount = 0;
            let pendingArtistsCount = 0;

            // Process artists
            if (artistsResponse.status === "fulfilled") {
              const result = artistsResponse.value;
              if (result.success && result.data && Array.isArray(result.data)) {
                const artists = result.data.map((user: any) => ({ ...user, role: "artist" }));
                allUsers.push(...artists);
                setAllArtists(artists);
                totalArtistsCount = artists.length;
                // Count pending artists - check multiple status variations
                pendingArtistsCount = artists.filter((a: any) => 
                  a.status === "pending" || 
                  a.status === "Pending" ||
                  a.status === "pending approval" ||
                  !a.status || // If status is undefined/null, might be pending
                  (a.role === "artist" && !a.status) // Artists without status are likely pending
                ).length;
                console.log("🔵 Admin Dashboard - Artists:", totalArtistsCount, "Pending:", pendingArtistsCount);
                console.log("🔵 Admin Dashboard - Artist statuses:", artists.map((a: any) => ({ name: a.name, status: a.status })));
              }
            }

            // Process customers
            if (customersResponse.status === "fulfilled") {
              const result = customersResponse.value;
              if (result.success && result.data && Array.isArray(result.data)) {
                const customers = result.data.map((user: any) => ({ ...user, role: "customer" }));
                allUsers.push(...customers);
                setAllCustomers(customers);
                totalCustomersCount = customers.length;
                console.log("🔵 Admin Dashboard - Customers:", totalCustomersCount);
              }
            }

            // Update stats from fetched data only if API stats were not received
            // If API stats were received, only update pendingArtists (which comes from separate endpoint)
            setStats(prev => ({
              totalCustomers: apiStatsReceived ? prev.totalCustomers : (totalCustomersCount >= 0 ? totalCustomersCount : 0),
              totalArtists: apiStatsReceived ? prev.totalArtists : (totalArtistsCount >= 0 ? totalArtistsCount : 0),
              pendingArtists: pendingArtistsCount >= 0 ? pendingArtistsCount : (prev.pendingArtists ?? 0),
              totalBookings: apiStatsReceived ? prev.totalBookings : (prev.totalBookings ?? 0),
              pendingBookings: apiStatsReceived ? prev.pendingBookings : (prev.pendingBookings ?? 0),
            }));

            // Get most recent 5 users
            const recent = allUsers
              .filter((user: any) => user && user._id)
              .sort((a: any, b: any) => {
                const dateA = new Date(a.createdAt || a.created_at || 0).getTime();
                const dateB = new Date(b.createdAt || b.created_at || 0).getTime();
                return dateB - dateA;
              })
              .slice(0, 5);
            
            setRecentUsers(recent);
          }
        } catch (e) {
          setRecentUsers([]);
        }

        // Process bookings and calculate stats
        try {
          if (bookingsResult.status === "fulfilled") {
            const result = bookingsResult.value;
            if (result.success && result.data && Array.isArray(result.data)) {
              const bookings = result.data;
              const totalBookingsCount = bookings.length;
              const pendingBookingsCount = bookings.filter((b: any) => 
                b.status === "pending" || b.status === "Pending"
              ).length;
              
              console.log("🔵 Admin Dashboard - Bookings:", totalBookingsCount, "Pending:", pendingBookingsCount);
              
              // Update stats from fetched bookings data only if API stats were not received
              setStats(prev => ({
                totalCustomers: apiStatsReceived ? prev.totalCustomers : (prev.totalCustomers ?? 0),
                totalArtists: apiStatsReceived ? prev.totalArtists : (prev.totalArtists ?? 0),
                pendingArtists: prev.pendingArtists ?? 0,
                totalBookings: apiStatsReceived ? prev.totalBookings : (totalBookingsCount >= 0 ? totalBookingsCount : 0),
                pendingBookings: apiStatsReceived ? prev.pendingBookings : (pendingBookingsCount >= 0 ? pendingBookingsCount : 0),
              }));

              const recent = bookings
                .sort((a: any, b: any) => {
                  const dateA = new Date(a.createdAt || a.created_at || 0).getTime();
                  const dateB = new Date(b.createdAt || b.created_at || 0).getTime();
                  return dateB - dateA;
                })
                .slice(0, 5);
              setRecentBookings(recent);
            }
          }
        } catch (e) {
          setRecentBookings([]);
        }

        // Process payments
        try {
          if (paymentsResult.status === "fulfilled") {
            const result = paymentsResult.value;
            if (result.success && result.data && Array.isArray(result.data)) {
              const recent = result.data
                .sort((a: any, b: any) => {
                  const dateA = new Date(a.createdAt || a.created_at || 0).getTime();
                  const dateB = new Date(b.createdAt || b.created_at || 0).getTime();
                  return dateB - dateA;
                })
                .slice(0, 5);
              setRecentPayments(recent);
            }
          }
        } catch (e) {
          setRecentPayments([]);
        }

        // Process pending artists and update stats
        try {
          let pendingList: PendingArtist[] = [];
          
          if (pendingArtistsResult.status === "fulfilled") {
            const result = pendingArtistsResult.value;
            if (result.success && result.data && Array.isArray(result.data)) {
              pendingList = result.data;
              console.log("🔵 Admin Dashboard - Pending Artists from dedicated endpoint:", pendingList.length);
            } else if ('error' in result && result.error) {
              console.warn("🔵 Admin Dashboard - Pending artists endpoint failed, trying fallback...");
            }
          }
          
          // Fallback: If no pending artists from dedicated endpoint, get from all artists
          if (pendingList.length === 0 && allArtists.length > 0) {
            console.log("🔵 Admin Dashboard - Using fallback: filtering pending from all artists");
            pendingList = allArtists
              .filter((a: any) => 
                a.status === "pending" || 
                a.status === "Pending" ||
                a.status === "pending approval" ||
                !a.status || // If status is undefined/null, might be pending
                (a.role === "artist" && !a.status) // Artists without status are likely pending
              )
              .map((a: any) => ({
                _id: a._id,
                name: a.name || a.shopName || "Unknown",
                email: a.email || "",
                status: a.status || "pending",
                createdAt: a.createdAt || a.created_at,
              }));
            console.log("🔵 Admin Dashboard - Found", pendingList.length, "pending artists from all artists");
          }
          
          if (pendingList.length > 0) {
            setPendingArtistsList(pendingList);
            console.log("🔵 Admin Dashboard - Setting pending artists list:", pendingList.length);
            setStats(prev => ({
              ...prev,
              pendingArtists: pendingList.length, // Always use the actual count
            }));
          } else {
            setPendingArtistsList([]);
            console.log("🔵 Admin Dashboard - No pending artists found");
          }
        } catch (e) {
          console.error("🔴 Admin Dashboard - Error processing pending artists:", e);
          setPendingArtistsList([]);
        }
      } catch (error: any) {
        // Handle network errors with user-friendly messages
        if (error.code === "ERR_NETWORK" || 
            error.code === "ECONNREFUSED" || 
            error.isNetworkError ||
            error.message?.includes("Network Error")) {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL
          console.log("🔵 Admin Dashboard - Backend appears to be down, using fallback data.");
          console.log(`🔵 Admin Dashboard - Expected API URL: ${apiUrl}`);
          toast.error(
            `Cannot connect to backend server. Please ensure the API server is running at ${apiUrl}`,
            { duration: 5000 }
          );
        } else {
          // Only log unexpected errors (not network/connection errors)
          console.error("🔴 Admin Dashboard - Failed to fetch stats:", error);
          toast.error(error.userMessage || error.message || "Failed to load dashboard statistics");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, userLoading]);

  // Don't render if user is not admin (redirect is happening)
  if (userLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p>Loading...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!user || user.role !== "admin") {
    return null; // Redirect is happening
  }

  // Ensure all values are numbers to prevent NaN
  // Use nullish coalescing (??) instead of || to properly handle 0 values
  const totalCustomers = Number(stats.totalCustomers ?? 0);
  const totalArtists = Number(stats.totalArtists ?? 0);
  const pendingArtists = Number(stats.pendingArtists ?? 0);
  const totalBookings = Number(stats.totalBookings ?? 0);
  const pendingBookings = Number(stats.pendingBookings ?? 0);
  
  // Calculate total users (customers + artists, excluding admins)
  const totalUsers = totalCustomers + totalArtists;

  // Calculate percentages and growth
  const approvedArtists = totalArtists - pendingArtists;
  const approvalRate = totalArtists > 0 
    ? Math.round((approvedArtists / totalArtists) * 100) 
    : 100;
  const completedBookings = totalBookings - pendingBookings;
  const completionRate = totalBookings > 0 
    ? Math.round((completedBookings / totalBookings) * 100) 
    : 100;

  const cards = [
    {
      title: "Total Users",
      value: totalUsers,
      description: `${totalCustomers} customers + ${totalArtists} artists`,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      link: "/admin/users",
    },
    {
      title: "Total Customers",
      value: totalCustomers,
      description: "Registered customers",
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
      link: "/admin/users",
    },
    {
      title: "Total Artists",
      value: totalArtists,
      description: `${approvedArtists} approved, ${pendingArtists} pending`,
      icon: Palette,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      link: "/admin/artists",
    },
    {
      title: "Pending Artists",
      value: pendingArtists,
      description: pendingArtists > 0 ? "Requires your attention" : "All approved",
      icon: AlertCircle,
      color: pendingArtists > 0 ? "text-orange-600" : "text-green-600",
      bgColor: pendingArtists > 0 ? "bg-orange-50" : "bg-green-50",
      link: "/admin/pending-artists",
      urgent: pendingArtists > 0,
    },
    {
      title: "Total Bookings",
      value: totalBookings,
      description: `${completedBookings} completed, ${pendingBookings} pending`,
      icon: ShoppingBag,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      link: "/admin/bookings",
    },
    {
      title: "Pending Bookings",
      value: pendingBookings,
      description: pendingBookings > 0 ? "Active requests" : "No pending",
      icon: Clock,
      color: pendingBookings > 0 ? "text-yellow-600" : "text-gray-600",
      bgColor: pendingBookings > 0 ? "bg-yellow-50" : "bg-gray-50",
      link: "/admin/bookings",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of your platform's performance.</p>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {cards.map((card) => (
              <Link key={card.title} href={card.link || "#"}>
                <Card className={`hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary ${card.bgColor}`}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                    <div className={`p-2 rounded-lg ${card.bgColor}`}>
                      <card.icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold">
                        {isNaN(card.value) ? 0 : card.value}
                      </div>
                      {card.urgent && (
                        <Badge variant="destructive" className="animate-pulse">
                          Action Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{card.description}</p>
                    <div className="flex items-center gap-1 text-xs text-primary mt-2">
                      <span>View details</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Recent Users */}
          <Card className="col-span-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>Latest registered users on the platform</CardDescription>
              </div>
              <Link href="/admin/users">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentUsers.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8">
                  No users found
                </div>
              ) : (
                <div className="space-y-3">
                  {recentUsers.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{user.name || "Unknown"}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            user.role === "admin"
                              ? "default"
                              : user.role === "artist"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {user.role || "customer"}
                        </Badge>
                        {user.status && (
                          <Badge
                            variant={
                              user.status === "approved"
                                ? "default"
                                : user.status === "pending"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {user.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions & Stats */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common admin tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingArtists > 0 && (
                <Link href="/admin/artists">
                  <Button className="w-full justify-start" variant="destructive">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Review {pendingArtists} Pending Artist{pendingArtists !== 1 ? "s" : ""}
                  </Button>
                </Link>
              )}
              <Link href="/admin/artists">
                <Button className="w-full justify-start" variant="outline">
                  <Palette className="h-4 w-4 mr-2" />
                  Manage Artists
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
              </Link>
              <Link href="/admin/bookings">
                <Button className="w-full justify-start" variant="outline">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  View Bookings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Artist Approval Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvalRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {approvedArtists} of {totalArtists} approved
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${approvalRate}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Booking Completion</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {completedBookings} of {totalBookings} completed
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <UserCheck className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isNaN(totalCustomers) ? 0 : totalCustomers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Registered customers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Activity</CardTitle>
              <Activity className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isNaN(totalBookings) ? 0 : totalBookings}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total bookings created
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Data Sections */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Pending Artists List */}
          {pendingArtistsList.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Pending Artists</span>
                  <Badge variant="destructive">{pendingArtistsList.length}</Badge>
                </CardTitle>
                <CardDescription>Artists awaiting approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pendingArtistsList.slice(0, 5).map((artist) => (
                    <div key={artist._id} className="flex items-center justify-between p-2 rounded border">
                      <div>
                        <p className="text-sm font-medium">{artist.name}</p>
                        <p className="text-xs text-muted-foreground">{artist.email}</p>
                      </div>
                      <Link href="/admin/pending-artists">
                        <Button size="sm" variant="outline">Review</Button>
                      </Link>
                    </div>
                  ))}
                  {pendingArtistsList.length > 5 && (
                    <Link href="/admin/pending-artists">
                      <Button variant="ghost" className="w-full" size="sm">
                        View All {pendingArtistsList.length} Pending Artists
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Bookings */}
          {recentBookings.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>Latest booking activity</CardDescription>
                </div>
                <Link href="/admin/bookings">
                  <Button variant="outline" size="sm">
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentBookings.map((booking) => (
                    <div key={booking._id} className="flex items-center justify-between p-2 rounded border">
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {booking.customer?.name || booking.artist?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {booking.status} • {booking.totalAmount ? `$${booking.totalAmount}` : "N/A"}
                        </p>
                      </div>
                      <Badge variant={booking.status === "completed" ? "default" : "secondary"}>
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Payments */}
          {recentPayments.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Payments</CardTitle>
                  <CardDescription>Latest payment transactions</CardDescription>
                </div>
                <Link href="/admin/payments">
                  <Button variant="outline" size="sm">
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentPayments.map((payment) => (
                    <div key={payment._id} className="flex items-center justify-between p-2 rounded border">
                      <div className="flex-1">
                        <p className="text-sm font-medium">${payment.amount || 0}</p>
                        <p className="text-xs text-muted-foreground">
                          {payment.status} • {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <Badge variant={payment.status === "completed" ? "default" : "secondary"}>
                        {payment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Artists Summary */}
          {allArtists.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>All Artists</span>
                  <Badge>{allArtists.length}</Badge>
                </CardTitle>
                <CardDescription>Total registered artists</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Approved</span>
                    <span className="font-bold text-green-600">
                      {allArtists.filter((a: any) => a.status === "approved").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pending</span>
                    <span className="font-bold text-orange-600">
                      {allArtists.filter((a: any) => a.status === "pending").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rejected</span>
                    <span className="font-bold text-red-600">
                      {allArtists.filter((a: any) => a.status === "rejected").length}
                    </span>
                  </div>
                  <Link href="/admin/artists">
                    <Button variant="outline" className="w-full mt-2" size="sm">
                      Manage All Artists
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Customers Summary */}
          {allCustomers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>All Customers</span>
                  <Badge>{allCustomers.length}</Badge>
                </CardTitle>
                <CardDescription>Total registered customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active</span>
                    <span className="font-bold text-green-600">
                      {allCustomers.filter((c: any) => c.status !== "banned").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Banned</span>
                    <span className="font-bold text-red-600">
                      {allCustomers.filter((c: any) => c.status === "banned").length}
                    </span>
                  </div>
                  <Link href="/admin/users">
                    <Button variant="outline" className="w-full mt-2" size="sm">
                      Manage All Customers
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Analytics Section */}
        <div className="mt-8">
          <Analytics />
        </div>
      </div>
    </AdminLayout>
  );
}
