"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Image as ImageIcon,
  Camera,
  Calendar,
  Clock,
  Download,
  Search,
  HardDrive,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
  ZoomIn,
  XCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Profile, CameraConfig } from "@/types";

// Snapshot type definition (matches camera_snaps table)
interface Snapshot {
  id: string;
  camera_id: number;
  camera_name: string;
  url: string;
  organization_id: string;
  created_at: string;
}

export default function SnapshotPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [cameras, setCameras] = useState<CameraConfig[]>([]);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [filteredSnapshots, setFilteredSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCameraId, setSelectedCameraId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("");

  // Preview
  const [selectedSnapshot, setSelectedSnapshot] = useState<Snapshot | null>(
    null
  );
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const snapshotsPerPage = 12;

  // Fetch user profile
  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        router.push("/Login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!profile) {
        router.push("/Login");
        return;
      }
      setProfile(profile);
    };
    fetchUserAndProfile();
  }, [router]);

  // Fetch cameras when profile is available
  useEffect(() => {
    if (!profile) return;

    const fetchCameras = async () => {
      try {
        const res = await fetch(
          `/api/camera/fetch?organization_id=${encodeURIComponent(
            profile.organization_id
          )}`
        );
        const data = await res.json();
        if (res.ok && Array.isArray(data.cameras)) {
          setCameras(data.cameras);
        }
      } catch (err) {
        console.error("Error fetching cameras:", err);
      }
    };

    fetchCameras();
  }, [profile]);

  // Fetch snapshots from API (camera_snaps table)
  useEffect(() => {
    if (!profile) return;

    const fetchSnapshots = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/snapshots/fetch?organization_id=${encodeURIComponent(
            profile.organization_id
          )}`
        );
        const data = await res.json();

        if (res.ok && Array.isArray(data.snapshots)) {
          // Map camera names from cameras array
          const snapshotList: Snapshot[] = data.snapshots.map(
            (snap: Snapshot) => {
              const matchingCamera = cameras.find(
                (cam) => cam.id === snap.camera_id
              );
              return {
                ...snap,
                camera_name: matchingCamera?.name || `Camera ${snap.camera_id}`,
              };
            }
          );

          setSnapshots(snapshotList);
          setFilteredSnapshots(snapshotList);
        }
      } catch (err) {
        console.error("Error fetching snapshots:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSnapshots();
  }, [profile, cameras]);

  // Apply filters
  useEffect(() => {
    let filtered = [...snapshots];

    // Camera filter
    if (selectedCameraId !== "all") {
      filtered = filtered.filter(
        (s) => s.camera_id === parseInt(selectedCameraId)
      );
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((s) =>
        s.camera_name.toLowerCase().includes(query)
      );
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter((s) => s.created_at.startsWith(dateFilter));
    }

    setFilteredSnapshots(filtered);
    setCurrentPage(1);
  }, [snapshots, selectedCameraId, searchQuery, dateFilter]);

  // Format date/time
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Pagination
  const totalPages = Math.ceil(filteredSnapshots.length / snapshotsPerPage);
  const paginatedSnapshots = filteredSnapshots.slice(
    (currentPage - 1) * snapshotsPerPage,
    currentPage * snapshotsPerPage
  );

  // Delete snapshot handler
  const handleDeleteSnapshot = async (snapshot: Snapshot) => {
    if (!confirm("Are you sure you want to delete this snapshot?")) return;

    try {
      // Delete from camera_snaps table
      const { error } = await supabase
        .from("camera_snaps")
        .delete()
        .eq("id", snapshot.id);

      if (error) {
        console.error("Error deleting snapshot:", error);
        alert("Failed to delete snapshot");
        return;
      }

      setSnapshots((prev) => prev.filter((s) => s.id !== snapshot.id));
      if (selectedSnapshot?.id === snapshot.id) {
        setSelectedSnapshot(null);
      }
      alert("Snapshot deleted successfully!");
    } catch (err) {
      console.error("Error deleting snapshot:", err);
      alert("Failed to delete snapshot");
    }
  };

  // Download snapshot
  const handleDownload = async (snapshot: Snapshot) => {
    try {
      // Open URL in new tab or trigger download
      const link = document.createElement("a");
      link.href = snapshot.url;
      link.download = `snapshot_${snapshot.camera_id}_${snapshot.created_at}.jpg`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error downloading snapshot:", err);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <span className="text-lg text-slate-600 dark:text-slate-300 font-medium">
            Loading snapshots...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Snapshots
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and manage camera snapshots for your organization
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
            <ImageIcon className="w-4 h-4" />
            {snapshots.length} Snapshots
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by camera name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Camera Filter */}
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCameraId}
              onChange={(e) => setSelectedCameraId(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="all">All Cameras</option>
              {cameras.map((camera) => (
                <option key={camera.id} value={camera.id}>
                  {camera.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Clear Filters */}
          {(searchQuery || selectedCameraId !== "all" || dateFilter) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCameraId("all");
                setDateFilter("");
              }}
              className="px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Snapshots List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Results count */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              Showing {paginatedSnapshots.length} of {filteredSnapshots.length}{" "}
              snapshots
            </span>
            {filteredSnapshots.length > snapshotsPerPage && (
              <span>
                Page {currentPage} of {totalPages}
              </span>
            )}
          </div>

          {/* Snapshots Grid */}
          {paginatedSnapshots.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                No snapshots found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {snapshots.length === 0
                  ? "No snapshots available for your cameras yet."
                  : "Try adjusting your filters to find snapshots."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {paginatedSnapshots.map((snapshot) => (
                <div
                  key={snapshot.id}
                  onClick={() => setSelectedSnapshot(snapshot)}
                  className={`group bg-white dark:bg-slate-800 rounded-xl shadow-md border transition-all cursor-pointer hover:shadow-lg ${
                    selectedSnapshot?.id === snapshot.id
                      ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800"
                      : "border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gray-900 rounded-t-xl overflow-hidden">
                    {snapshot.url ? (
                      <img
                        src={snapshot.url}
                        alt={`Snapshot from ${snapshot.camera_name}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Camera className="w-10 h-10 text-gray-600" />
                      </div>
                    )}
                    {/* Zoom overlay */}
                    <div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSnapshot(snapshot);
                        setIsLightboxOpen(true);
                      }}
                    >
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                        <ZoomIn className="w-6 h-6 text-gray-800" />
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 dark:text-white text-sm truncate">
                          {snapshot.camera_name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDateTime(snapshot.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-slate-700">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(snapshot);
                        }}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSnapshot(snapshot);
                        }}
                        className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === pageNum
                          ? "bg-blue-500 text-white"
                          : "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Preview Panel */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-500" />
              Preview
            </h3>

            {selectedSnapshot ? (
              <div className="space-y-4">
                {/* Image Preview */}
                <div
                  className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden cursor-pointer"
                  onClick={() => setIsLightboxOpen(true)}
                >
                  {selectedSnapshot.url ? (
                    <img
                      src={selectedSnapshot.url}
                      alt={`Snapshot from ${selectedSnapshot.camera_name}`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Camera className="w-12 h-12 text-gray-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <ZoomIn className="w-6 h-6 text-gray-800" />
                    </div>
                  </div>
                </div>

                {/* Snapshot Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Camera</span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {selectedSnapshot.camera_name}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Captured</span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {formatDateTime(selectedSnapshot.created_at)}
                    </span>
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={() => handleDownload(selectedSnapshot)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Snapshot
                </button>
              </div>
            ) : (
              <div className="aspect-video bg-gray-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Select a snapshot to preview</p>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <HardDrive className="w-5 h-5" />
              Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm opacity-90">Total Snapshots</span>
                <span className="font-bold">{snapshots.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm opacity-90">Cameras</span>
                <span className="font-bold">{cameras.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && selectedSnapshot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            onClick={() => setIsLightboxOpen(false)}
          >
            <XCircle className="w-8 h-8 text-white" />
          </button>
          <img
            src={selectedSnapshot.url}
            alt={`Snapshot from ${selectedSnapshot.camera_name}`}
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-2 rounded-lg text-white text-sm">
            {selectedSnapshot.camera_name} •{" "}
            {formatDateTime(selectedSnapshot.created_at)}
          </div>
        </div>
      )}
    </div>
  );
}
