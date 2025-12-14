"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, RefreshCcw, Mail, Shield, User as UserIcon } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
  status?: string;
  profileImage?: string;
  createdAt?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "artist" | "customer">("all");

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const [artistsResponse, customersResponse] = await Promise.allSettled([
        adminService.getUsers("artist"),
        adminService.getUsers("customer"),
      ]);

      const allUsers: User[] = [];

      if (artistsResponse.status === "fulfilled") {
        const result = artistsResponse.value;
        if (result.success && result.data && Array.isArray(result.data)) {
          allUsers.push(...result.data.map((user: any) => ({ ...user, role: user.role || "artist" })));
        }
      }

      if (customersResponse.status === "fulfilled") {
        const result = customersResponse.value;
        if (result.success && result.data && Array.isArray(result.data)) {
          allUsers.push(...result.data.map((user: any) => ({ ...user, role: user.role || "customer" })));
        }
      }

      // Sort by creation date (newest first)
      allUsers.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });

      setUsers(allUsers);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Users Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor all registered users.
            </p>
          </div>
          <Button 
            onClick={fetchUsers} 
            variant="outline" 
            disabled={loading}
            className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/30 text-foreground hover:text-foreground transition-all"
          >
            <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh List
          </Button>
        </div>

        <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-md shadow-xl">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-xl text-white">All Users</CardTitle>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    className="pl-9 bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50 w-full sm:w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={roleFilter === "all" ? "default" : "outline"}
                    onClick={() => setRoleFilter("all")}
                    className={roleFilter === "all" ? "bg-purple-600 hover:bg-purple-700" : "bg-black/20 border-white/10 text-gray-300 hover:bg-white/5"}
                  >
                    All
                  </Button>
                  <Button
                    variant={roleFilter === "artist" ? "default" : "outline"}
                    onClick={() => setRoleFilter("artist")}
                    className={roleFilter === "artist" ? "bg-purple-600 hover:bg-purple-700" : "bg-black/20 border-white/10 text-gray-300 hover:bg-white/5"}
                  >
                    Artists
                  </Button>
                  <Button
                    variant={roleFilter === "customer" ? "default" : "outline"}
                    onClick={() => setRoleFilter("customer")}
                    className={roleFilter === "customer" ? "bg-purple-600 hover:bg-purple-700" : "bg-black/20 border-white/10 text-gray-300 hover:bg-white/5"}
                  >
                    Customers
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="h-8 w-8 opacity-50" />
                </div>
                <p className="text-lg font-medium">No users found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="rounded-md border border-white/10 overflow-hidden">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-gray-300">User</TableHead>
                      <TableHead className="text-gray-300">Role</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user._id} className="border-white/10 hover:bg-white/5 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 ring-2 ring-purple-500/20">
                              <AvatarImage src={user.profileImage} />
                              <AvatarFallback className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-purple-300">
                                {user.name?.charAt(0)?.toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-white">{user.name || "Unknown"}</div>
                              <div className="text-xs text-gray-400 flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`
                              capitalize border-0
                              ${user.role === 'admin' ? 'bg-red-500/20 text-red-400' : 
                                user.role === 'artist' ? 'bg-purple-500/20 text-purple-400' : 
                                'bg-blue-500/20 text-blue-400'}
                            `}
                          >
                            {user.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                            {user.role || "Customer"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            className={`
                              capitalize border-0
                              ${user.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 
                                user.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                                'bg-gray-500/20 text-gray-400'}
                            `}
                          >
                            {user.status || "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-400 text-sm">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
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
