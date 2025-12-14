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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, X, RefreshCcw, AlertCircle, Calendar, Mail, User } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";
import Cookies from "js-cookie";

export default function PendingArtistsPage() {
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);

  // ... (Keep existing diagnostic logic but hidden by default)
  const runDiagnostics = async () => {
    const logs: string[] = [];
    const addLog = (msg: string) =>
      logs.push(
        `${new Date().toISOString().split("T")[1].split(".")[0]} - ${msg}`
      );

    setDiagnosticLogs(["Running diagnostics..."]);

    try {
      // Check Token
      const cookieToken = Cookies.get("token");
      const localToken = localStorage.getItem("token");
      addLog(`Token in Cookie: ${cookieToken ? "✅ Present" : "❌ Missing"}`);
      addLog(
        `Token in LocalStorage: ${localToken ? "✅ Present" : "❌ Missing"}`
      );

      // Check Auth
      addLog("Checking /api/auth/me...");
      try {
        const me = await apiClient.get("/api/auth/me");
        addLog(`✅ Auth OK: ${me.data.user?.email} (${me.data.user?.role})`);
      } catch (e: any) {
        addLog(`❌ Auth Failed: ${e.response?.status} - ${e.message}`);
      }

      // Check Dashboard Status
      addLog("Checking /api/admin/dashboard/status...");
      try {
        const status = await apiClient.get("/api/admin/dashboard/status");
        addLog(
          `✅ Status Response Keys: ${Object.keys(status.data).join(", ")}`
        );
      } catch (e: any) {
        addLog(`❌ Status Failed: ${e.response?.status} - ${e.message}`);
      }
    } catch (error: any) {
      addLog(`Critical Error: ${error.message}`);
    }

    setDiagnosticLogs(logs);
  };

  const fetchStats = async () => {
    try {
      const response = await adminService.getDashboardStatus();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const fetchPendingArtists = async () => {
    setLoading(true);
    try {
      const response = await adminService.getPendingArtists();
      if (response.success) {
        const artistsList = Array.isArray(response.data) ? response.data : [];
        setArtists(artistsList);
        if (artistsList.length === 0) {
          toast.info("No pending artists - all approved!");
        }
      } else {
        toast.error(response.error || "Failed to fetch pending artists");
        setArtists([]);
      }
    } catch (error: any) {
      console.error("Error fetching:", error);
      toast.error("Failed to fetch pending artists");
      setArtists([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingArtists();
    fetchStats();
  }, []);

  const handleApprove = async (id: string) => {
    if (processingId) return;
    setProcessingId(id);
    try {
      const response = await adminService.approveArtist(id);
      if (response.success) {
        toast.success("Artist approved successfully");
        setTimeout(() => fetchPendingArtists(), 500);
      } else {
        toast.error(response.error || "Failed to approve artist");
      }
    } catch (error: any) {
      toast.error("Failed to approve artist");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (processingId) return;
    setProcessingId(id);
    try {
      const response = await adminService.rejectArtist(id);
      if (response.success) {
        toast.success("Artist rejected successfully");
        setTimeout(() => fetchPendingArtists(), 500);
      } else {
        toast.error(response.error || "Failed to reject artist");
      }
    } catch (error: any) {
      toast.error("Failed to reject artist");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Pending Applications
            </h1>
            <p className="text-muted-foreground mt-1">
              Review and approve artist applications.
            </p>
          </div>
          <Button
            onClick={fetchPendingArtists}
            disabled={loading}
            variant="outline"
            className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all"
          >
            <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-400" />
              Pending Requests
              <Badge variant="secondary" className="ml-2 bg-orange-500/20 text-orange-400 border-orange-500/30">
                {artists.length}
              </Badge>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Artists waiting for your approval to join the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
              </div>
            ) : artists.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-emerald-500" />
                </div>
                <p className="text-lg font-medium text-white">All Caught Up!</p>
                <p className="text-sm">No pending artist applications at the moment.</p>
              </div>
            ) : (
              <div className="rounded-md border border-white/10 overflow-hidden">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-gray-300">Artist Details</TableHead>
                      <TableHead className="text-gray-300">Category</TableHead>
                      <TableHead className="text-gray-300">Applied On</TableHead>
                      <TableHead className="text-right text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {artists.map((artist) => (
                      <TableRow key={artist._id} className="border-white/10 hover:bg-white/5 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 ring-2 ring-orange-500/20">
                              <AvatarImage src={artist.profileImage} />
                              <AvatarFallback className="bg-gradient-to-br from-orange-500/20 to-red-500/20 text-orange-400">
                                {artist.name?.charAt(0) || "A"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-white">{artist.name}</div>
                              <div className="text-xs text-gray-400 flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {artist.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-white/5 border-white/10 text-gray-300">
                            {(() => {
                              const cat = artist.category;
                              if (!cat) return "N/A";
                              if (Array.isArray(cat)) {
                                return cat.length > 0 ? cat[0].name || "Unknown" : "N/A";
                              }
                              if (typeof cat === "object") {
                                return cat.name || "Unknown";
                              }
                              return String(cat);
                            })()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-400 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            {new Date(artist.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all"
                              onClick={() => handleApprove(artist._id)}
                              disabled={processingId === artist._id || processingId !== null}
                            >
                              {processingId === artist._id ? (
                                <RefreshCcw className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Check className="mr-1 h-4 w-4" />
                                  Approve
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all"
                              onClick={() => handleReject(artist._id)}
                              disabled={processingId === artist._id || processingId !== null}
                            >
                              {processingId === artist._id ? (
                                <RefreshCcw className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <X className="mr-1 h-4 w-4" />
                                  Reject
                                </>
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Debug Info Toggle */}
        <div className="flex justify-center">
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowDebug(!showDebug)}
                className="text-xs text-gray-500 hover:text-gray-300"
            >
                {showDebug ? "Hide Debug Info" : "Show Debug Info"}
            </Button>
        </div>

        {showDebug && (
            <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardHeader>
                <CardTitle className="text-yellow-500 text-sm">Debug Info</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-xs text-yellow-200/70 space-y-2 font-mono">
                <p>Total Artists Found: {artists.length}</p>
                <p>Backend Pending Count: {stats?.pendingArtists ?? "Unknown"}</p>
                <div className="mt-4">
                    <Button onClick={runDiagnostics} size="sm" variant="outline" className="mb-2 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10">
                    Run Diagnostics
                    </Button>
                    {diagnosticLogs.length > 0 && (
                    <div className="bg-black/50 p-2 rounded text-xs h-40 overflow-y-auto border border-white/10">
                        {diagnosticLogs.map((log, i) => (
                        <div key={i}>{log}</div>
                        ))}
                    </div>
                    )}
                </div>
                </div>
            </CardContent>
            </Card>
        )}
      </div>
    </AdminLayout>
  );
}
