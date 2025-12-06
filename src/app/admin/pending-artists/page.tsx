"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/api/services/adminService";
import { AdminLayout } from "@/components/layout/admin-layout";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api/apiClient";
import Cookies from "js-cookie";

export default function PendingArtistsPage() {
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);

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
        const me = await api.get("/api/auth/me");
        addLog(`✅ Auth OK: ${me.data.user?.email} (${me.data.user?.role})`);
      } catch (e: any) {
        addLog(`❌ Auth Failed: ${e.response?.status} - ${e.message}`);
      }

      // Check Dashboard Status
      addLog("Checking /api/admin/dashboard/status...");
      try {
        const status = await api.get("/api/admin/dashboard/status");
        addLog(
          `✅ Status Response Keys: ${Object.keys(status.data).join(", ")}`
        );
        if (status.data.data && status.data.data.stats) {
          addLog(
            `✅ Pending Count (nested): ${status.data.data.stats.pendingArtists}`
          );
        } else if (status.data.data) {
          addLog(`✅ Pending Count (data): ${status.data.data.pendingArtists}`);
        } else {
          addLog(`✅ Pending Count (root): ${status.data.pendingArtists}`);
        }
      } catch (e: any) {
        addLog(`❌ Status Failed: ${e.response?.status} - ${e.message}`);
      }

      // Check Specific ID (from test-registration)
      const targetId = "693388526aaf282a39c938a4";
      addLog(`Probing ID: ${targetId}...`);
      const idEndpoints = [
        `/api/admin/users/${targetId}`,
        `/api/admin/artists/${targetId}`,
        `/api/admin/pending/${targetId}`,
        `/api/users/${targetId}`,
        `/api/artists/${targetId}`,
      ];

      for (const ep of idEndpoints) {
        try {
          const res = await api.get(ep);
          addLog(`✅ ID Found at ${ep}: ${res.status}`);
          addLog(`   Data: ${JSON.stringify(res.data).substring(0, 100)}...`);
        } catch (e: any) {
          // addLog(`❌ ID Probe ${ep}: ${e.response?.status}`);
        }
      }

      // Check Endpoints with Fuzzing
      const endpoints = [
        "/api/admin/users?role=artist",
        "/api/admin/users?role=Artist",
        "/api/admin/users?role=artist&status=pending",
        "/api/admin/users?role=artist&approved=false",
        "/api/admin/users?role=artist&isApproved=false",
        "/api/admin/users?role=pending",
        "/api/admin/users?status=pending",
        "/api/admin/pending/artists?limit=100",
        "/api/admin/pending/artists?all=true",
      ];

      for (const endpoint of endpoints) {
        addLog(`Checking ${endpoint}...`);
        try {
          const res = await api.get(endpoint);
          const data = Array.isArray(res.data) ? res.data : res.data.data || [];
          const isArray = Array.isArray(data);
          addLog(
            `✅ ${res.status} - ${
              isArray ? `Array(${data.length})` : "Not Array"
            }`
          );

          if (isArray && data.length > 0) {
            // Show first 3 items
            data.slice(0, 3).forEach((item: any, idx: number) => {
              addLog(`   [${idx}] ${item.name} (${item.email})`);
              addLog(`       Role: ${item.role}, Status: ${item.status}`);
            });
          }
        } catch (e: any) {
          addLog(`❌ Failed: ${e.response?.status} - ${e.message}`);
        }
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
      console.log("🔵 Pending Artists Page - Fetching pending artists...");
      const response = await adminService.getPendingArtists();
      console.log(
        "🔵 Pending Artists Page - Full response:",
        JSON.stringify(response, null, 2)
      );

      if (response.success) {
        const artistsList = Array.isArray(response.data) ? response.data : [];
        console.log(
          "🔵 Pending Artists Page - Setting artists:",
          artistsList.length
        );

        if (artistsList.length > 0) {
          console.log(
            "🔵 Pending Artists Page - Artists found:",
            artistsList.map((a: any) => ({
              id: a._id,
              name: a.name || a.shopName,
              email: a.email,
              status: a.status,
            }))
          );
        }

        setArtists(artistsList);

        if (artistsList.length === 0) {
          console.log("🔵 Pending Artists Page - No pending artists found");
          toast.info("No pending artists - all approved!");
        } else {
          toast.success(
            `Found ${artistsList.length} pending artist${
              artistsList.length !== 1 ? "s" : ""
            }`
          );
        }
      } else {
        console.error(
          "🔴 Pending Artists Page - Failed to fetch:",
          response.error
        );
        if (response.error) {
          toast.error(response.error);
        }
        setArtists([]);
      }
    } catch (error: any) {
      console.error("🔴 Pending Artists Page - Error fetching:", error);
      const errorMsg =
        error.message ||
        error.response?.data?.message ||
        "Failed to fetch pending artists";
      toast.error(errorMsg);
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
    if (processingId) return; // Prevent double clicks

    setProcessingId(id);
    try {
      console.log("🔵 Pending Artists - Approving artist:", id);
      const response = await adminService.approveArtist(id);
      console.log("🔵 Pending Artists - Approval response:", response);

      if (response.success) {
        toast.success("Artist approved successfully");
        // Wait a bit before refreshing to ensure backend has updated
        setTimeout(() => {
          fetchPendingArtists();
        }, 500);
      } else {
        const errorMsg = response.error || "Failed to approve artist";
        console.error("🔴 Pending Artists - Approval failed:", errorMsg);
        toast.error(errorMsg);
      }
    } catch (error: any) {
      console.error("🔴 Pending Artists - Approval error:", error);
      const errorMsg =
        error.message ||
        error.response?.data?.message ||
        "Failed to approve artist";
      toast.error(errorMsg);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (processingId) return; // Prevent double clicks

    setProcessingId(id);
    try {
      console.log("🔵 Pending Artists - Rejecting artist:", id);
      const response = await adminService.rejectArtist(id);
      console.log("🔵 Pending Artists - Rejection response:", response);

      if (response.success) {
        toast.success("Artist rejected successfully");
        // Wait a bit before refreshing to ensure backend has updated
        setTimeout(() => {
          fetchPendingArtists();
        }, 500);
      } else {
        const errorMsg = response.error || "Failed to reject artist";
        console.error("🔴 Pending Artists - Rejection failed:", errorMsg);
        toast.error(errorMsg);
      }
    } catch (error: any) {
      console.error("🔴 Pending Artists - Rejection error:", error);
      const errorMsg =
        error.message ||
        error.response?.data?.message ||
        "Failed to reject artist";
      toast.error(errorMsg);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Pending Artists
            </h1>
            <p className="text-muted-foreground">
              Review and approve artist applications.
            </p>
          </div>
          <Button
            onClick={fetchPendingArtists}
            disabled={loading}
            variant="outline"
          >
            <RefreshCcw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Artist</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : artists.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No pending applications.
                    </TableCell>
                  </TableRow>
                ) : (
                  artists.map((artist) => (
                    <TableRow key={artist._id}>
                      <TableCell className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={artist.profileImage} />
                          <AvatarFallback>
                            {artist.name?.charAt(0) || "A"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{artist.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {artist.email}
                          </div>
                          {artist.status === "approved" && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-1 rounded">
                              API says: Approved
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const cat = artist.category;
                          if (!cat) return "N/A";
                          if (Array.isArray(cat)) {
                            return cat.length > 0
                              ? cat[0].name || "Unknown"
                              : "N/A";
                          }
                          if (typeof cat === "object") {
                            return cat.name || "Unknown";
                          }
                          return String(cat);
                        })()}
                      </TableCell>
                      <TableCell>
                        {new Date(artist.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleApprove(artist._id)}
                            disabled={
                              processingId === artist._id ||
                              processingId !== null
                            }
                          >
                            {processingId === artist._id ? (
                              <>
                                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                Approve
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleReject(artist._id)}
                            disabled={
                              processingId === artist._id ||
                              processingId !== null
                            }
                          >
                            {processingId === artist._id ? (
                              <>
                                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <X className="mr-2 h-4 w-4" />
                                Reject
                              </>
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Debug Info Section */}
        <Card className="mt-8 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 text-lg">
              Debug Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-yellow-700 space-y-2">
              <p>
                <strong>Total Artists Found:</strong> {artists.length}
              </p>
              <p>
                <strong>Backend Pending Count (Dashboard):</strong>{" "}
                {stats?.pendingArtists ?? "Unknown"}
              </p>
              <p>
                <strong>Status Check:</strong> If you see artists here but they
                are not pending, the status filter might be wrong.
              </p>

              <div className="mt-4">
                <Button
                  onClick={runDiagnostics}
                  size="sm"
                  variant="outline"
                  className="mb-2"
                >
                  Run Diagnostics
                </Button>
                {diagnosticLogs.length > 0 && (
                  <div className="bg-black text-white p-2 rounded text-xs font-mono h-40 overflow-y-auto">
                    {diagnosticLogs.map((log, i) => (
                      <div key={i}>{log}</div>
                    ))}
                  </div>
                )}
              </div>

              <details>
                <summary className="cursor-pointer font-medium hover:underline">
                  View Raw Data (First Item)
                </summary>
                <pre className="mt-2 p-2 bg-black text-white rounded text-xs overflow-auto max-h-60">
                  {artists.length > 0
                    ? JSON.stringify(artists[0], null, 2)
                    : "No data"}
                </pre>
              </details>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
