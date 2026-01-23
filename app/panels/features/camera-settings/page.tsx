"use client";

import { useState, useEffect } from "react";
import io from "socket.io-client";
import {
  Camera,
  Settings,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  RotateCcw,
  Save,
  CheckCircle,
  AlertCircle,
  Wifi,
  WifiOff,
  Plus,
  X,
  Pencil,
  Trash2,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { CameraConfig, Profile } from "@/types";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import CameraFeed from "@/components/CameraFeed";

export default function CameraSettingPage() {
  const router = useRouter();
  const socket = io(
    process.env.NEXT_PUBLIC_CLOUD_URL || "http://localhost:3001"
  );

  const [cameras, setCameras] = useState<CameraConfig[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<number>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showAddCameraModal, setShowAddCameraModal] = useState(false);
  const [newCameraUrl, setNewCameraUrl] = useState("");
  const [newCameraName, setNewCameraName] = useState("");
  const [editingCamera, setEditingCamera] = useState<CameraConfig | null>(null);
  const [editCameraName, setEditCameraName] = useState("");
  const [editCameraUrl, setEditCameraUrl] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

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
        .select("*, organizations!inner(displayid)")
        .eq("id", user.id)
        .single();

      if (!profile) {
        router.push("/Login");
        return;
      }
      console.log("Fetched profile:", profile);
      setProfile(profile);
    };
    fetchUserAndProfile();
  }, [router]);

  // Fetch cameras from database when profile becomes available
  useEffect(() => {
    if (!profile) return;

    const fetchCameras = async () => {
      try {
        const res = await fetch(
          `/api/camera/fetch?organization_id=${encodeURIComponent(
            profile.organization_id
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        console.log("Fetched cameras:", data);
        if (res.ok && Array.isArray(data.cameras)) {
          setCameras(data.cameras);
        } else {
          console.error("Failed to fetch cameras:", data);
        }
      } catch (err) {
        console.error("Error fetching cameras:", err);
      }
    };

    fetchCameras();
  }, [profile]);

  useEffect(() => {
    if (!profile || cameras.length === 0) return;

    socket.on("connect", () => {
      console.log("Connected to Cloud server via Socket.io");
    });
    for (const camera of cameras) {
      socket.emit("start_relay", {
        targetEdgeId: profile?.organizations?.displayid || "000",
        camId: camera.name,
      });
    }
    // socket.on(
    //   "relay_info",
    //   (relay_info: { success: boolean; data: string }) => {
    //     console.log("Received relay data:", relay_info.data);
    //     if (relay_info.success) {
    //       console.log("Relay data success:", relay_info.data);
    //       const { CameraId, url } = JSON.parse(relay_info.data);
    //       const camera = cameras.find((c) => c.id.toString() === CameraId);
    //       if (camera) {
    //         camera.stream_url = url;
    //         console.log(`Camera ${CameraId} URL: ${url}`);
    //       }
    //       console.log("Relay data processed successfully");
    //     } else {
    //       console.error(`Failed to receive relay data: ${relay_info.data}`); // Error message
    //     }
    //   }
    // );

    socket.on("disconnect", () => {
      console.log("Disconnected from Cloud server");
    });

    // return () => {
    //   socket.emit("stop_relay", { targetEdgeId: "org08", camId: "camera1" });
    // };
  }, [cameras, socket, profile]);

  function getSelectedCamera() {
    return cameras.find((c: CameraConfig) => c.id === selectedCameraId);
  }

  const updateCameraSetting = (
    cameraId: number,
    key: keyof CameraConfig,
    value: number | string | boolean
  ) => {
    setCameras((prev) =>
      prev.map((cam) => (cam.id === cameraId ? { ...cam, [key]: value } : cam))
    );
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    // Save logic here
    setHasChanges(false);
    alert("Settings saved successfully!");
  };

  const handleReset = () => {
    // setCameras(initialCameras);
    setHasChanges(false);
  };

  const handleAddCamera = async () => {
    if (!newCameraUrl.trim() || !newCameraName.trim()) {
      alert("Please enter both camera name and URL");
      return;
    }

    try {
      const res = await fetch("/api/camera/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCameraName,
          url: newCameraUrl,
          status: "normal",
          detection: false,
          alert_sound: false,
          frame_rate: 30,
          resolution: "1080p",
          organization_id: profile?.organization_id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to add camera");
        return;
      }
      setCameras((prev) => [...prev, data.camera]);
      setNewCameraUrl("");
      setNewCameraName("");
      setShowAddCameraModal(false);
      alert(`Camera "${newCameraName}" added successfully!`);
    } catch (err) {
      alert(`Failed to add camera "${newCameraName}" - ${err}`);
    }
  };

  const handleDeleteCamera = async (cameraId: number) => {
    if (!confirm("Are you sure you want to delete this camera?")) return;

    try {
      const res = await fetch("/api/camera/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cameraId }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to delete camera");
        return;
      }
      setCameras((prev) => prev.filter((c) => c.id !== cameraId));
      if (selectedCameraId === cameraId) {
        setSelectedCameraId(cameras.find((c) => c.id !== cameraId)?.id);
      }
      alert("Camera deleted successfully!");
    } catch (err) {
      alert("Failed to delete camera (network error)");
    }
  };

  const handleEditCamera = (camera: CameraConfig) => {
    setEditingCamera(camera);
    setEditCameraName(camera.name);
    setEditCameraUrl(camera.url || "");
  };

  const handleUpdateCamera = async () => {
    if (!editingCamera) return;
    if (!editCameraName.trim()) {
      alert("Please enter a camera name");
      return;
    }

    try {
      const res = await fetch("/api/camera/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingCamera.id,
          name: editCameraName,
          url: editCameraUrl || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to update camera");
        return;
      }
      setCameras((prev) =>
        prev.map((c) => (c.id === editingCamera.id ? data.camera : c))
      );
      setEditingCamera(null);
      setEditCameraName("");
      setEditCameraUrl("");
      alert("Camera updated successfully!");
    } catch (err) {
      alert("Failed to update camera (network error)");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30";
      case "warning":
        return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30";
      case "offline":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
        return <Wifi className="w-3 h-3" />;
      case "warning":
        return <AlertCircle className="w-3 h-3" />;
      case "offline":
        return <WifiOff className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <Camera className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Camera Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Configure camera settings for optimal performance
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
            <CheckCircle className="w-4 h-4" />
            {cameras.filter((c) => c.status === "normal").length} Online
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400">
            <WifiOff className="w-4 h-4" />
            {cameras.filter((c) => c.status === "offline").length} Offline
          </span>
        </div>
      </div>

      {/* Camera Grid */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Connected Cameras
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddCameraModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Add Camera
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {cameras.map((camera) => (
            <div
              key={camera.id}
              className={`relative group rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                selectedCameraId === camera.id
                  ? "border-blue-500 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-800"
                  : "border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-600"
              }`}
            >
              {/* Camera Preview Thumbnail */}
              <button
                onClick={() => setSelectedCameraId(camera.id)}
                className="w-full aspect-video bg-gray-900 dark:bg-slate-950 flex items-center justify-center overflow-hidden"
              >
                <CameraFeed
                  camera={camera}
                  orgDisplayId={profile?.organizations?.displayid}
                />
              </button>

              {/* Camera Info */}
              <div className="p-3 bg-white dark:bg-slate-800 flex items-center justify-between">
                <span className="font-medium text-gray-800 dark:text-white text-sm truncate">
                  {camera.name}
                </span>
                <span
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(
                    camera.status
                  )}`}
                >
                  {getStatusIcon(camera.status)}
                  {camera.status}
                </span>
              </div>

              {/* Edit/Delete Buttons - Show on hover */}
              <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCamera(camera);
                    }}
                    className="p-1.5 bg-white/90 dark:bg-slate-800/90 rounded-lg hover:bg-blue-500 hover:text-white transition-colors shadow-sm"
                    title="Edit Camera"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCamera(camera.id);
                    }}
                    className="p-1.5 bg-white/90 dark:bg-slate-800/90 rounded-lg hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                    title="Delete Camera"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              </div>
              {/* Selection Indicator */}
              {selectedCameraId === camera.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Camera Preview & Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera Preview */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Selected Camera Preview
            </h2>
            {getSelectedCamera() && (
              <button
                onClick={() => setIsFullscreen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all text-sm font-medium"
              >
                <Maximize2 className="w-4 h-4" />
                Fullscreen
              </button>
            )}
          </div>

          {/* Large Preview */}
          <div className="aspect-video bg-gray-900 dark:bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center mb-4">
            <CameraFeed
              camera={getSelectedCamera()}
              orgDisplayId={profile?.organizations?.displayid}
            />
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between text-sm">
            <span
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full capitalize ${getStatusColor(
                getSelectedCamera()?.status || "unknown"
              )}`}
            >
              {getStatusIcon(getSelectedCamera()?.status || "unknown")}
              {getSelectedCamera()?.status || "unknown"}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              Status updates every 2s
            </span>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              System Settings
            </h2>
          </div>

          <div className="space-y-6">
            {/* Detection Toggle */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-medium text-gray-800 dark:text-white">
                  Detection
                </label>
                <button
                  onClick={() => {
                    const cam = getSelectedCamera();
                    if (cam)
                      updateCameraSetting(cam.id, "detection", !cam.detection);
                  }}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    getSelectedCamera()?.detection ?? false
                      ? "bg-blue-500"
                      : "bg-gray-300 dark:bg-slate-600"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      getSelectedCamera()?.detection ?? false
                        ? "left-7"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                {getSelectedCamera()?.detection ?? false ? (
                  <Eye className="w-4 h-4 text-blue-500" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
                <span>
                  {getSelectedCamera()?.detection ?? false
                    ? "Enabled"
                    : "Disabled"}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Toggle to enable or disable model detection (server-side must
                support this).
              </p>
            </div>

            {/* Alert Sound Toggle */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-medium text-gray-800 dark:text-white">
                  Alert Sound
                </label>
                <button
                  onClick={() => {
                    const cam = getSelectedCamera();
                    if (cam)
                      updateCameraSetting(
                        cam.id,
                        "alert_sound",
                        !cam.alert_sound
                      );
                  }}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    getSelectedCamera()?.alert_sound ?? false
                      ? "bg-blue-500"
                      : "bg-gray-300 dark:bg-slate-600"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      getSelectedCamera()?.alert_sound ?? false
                        ? "left-7"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                {getSelectedCamera()?.alert_sound ?? false ? (
                  <Volume2 className="w-4 h-4 text-blue-500" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
                <span>
                  {getSelectedCamera()?.alert_sound ?? false ? "On" : "Off"}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                When enabled, the UI will play a sound when a detection occurs
                (frontend).
              </p>
            </div>

            {/* Frame Rate Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-medium text-gray-800 dark:text-white">
                  Frame Rate
                </label>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  {getSelectedCamera()?.frame_rate ?? 30} fps
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={getSelectedCamera()?.frame_rate ?? 30}
                onChange={(e) => {
                  const cam = getSelectedCamera();
                  if (cam)
                    updateCameraSetting(
                      cam.id,
                      "frame_rate",
                      Number(e.target.value)
                    );
                }}
                className="w-full h-2 bg-gray-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>5 fps</span>
                <span>60 fps</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Lower frame rate reduces CPU/GPU load; server must use this
                setting.
              </p>
            </div>

            {/* Resolution Selector */}
            <div>
              <label className="font-medium text-gray-800 dark:text-white block mb-2">
                Resolution
              </label>
              <select
                value={getSelectedCamera()?.resolution ?? "1080p"}
                onChange={(e) => {
                  const cam = getSelectedCamera();
                  if (cam)
                    updateCameraSetting(cam.id, "resolution", e.target.value);
                }}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="480p">480p</option>
                <option value="720p">720p</option>
                <option value="1080p">1080p</option>
                <option value="4K">4K</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
              <button
                onClick={handleSaveSettings}
                disabled={!hasChanges}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                  hasChanges
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                }`}
              >
                <Save className="w-4 h-4" />
                Save Settings
              </button>
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Camera Modal */}
      {isFullscreen && getSelectedCamera() && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-black/80">
            <div className="flex items-center gap-3">
              <Camera className="w-6 h-6 text-blue-400" />
              <span className="text-white font-semibold text-lg">
                {getSelectedCamera()?.name}
              </span>
              <span
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(
                  getSelectedCamera()?.status || "unknown"
                )}`}
              >
                {getStatusIcon(getSelectedCamera()?.status || "unknown")}
                {getSelectedCamera()?.status}
              </span>
            </div>
            <button
              onClick={() => setIsFullscreen(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <Minimize2 className="w-5 h-5" />
              Exit Fullscreen
            </button>
          </div>
          {/* Camera Feed */}
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full h-full max-w-7xl rounded-xl overflow-hidden bg-gray-900">
              <CameraFeed
                camera={getSelectedCamera()}
                orgDisplayId={profile?.organizations?.displayid}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add Camera Modal */}
      {showAddCameraModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Camera className="w-6 h-6 text-blue-500" />
                Add New Camera
              </h3>
              <button
                onClick={() => {
                  setShowAddCameraModal(false);
                  setNewCameraUrl("");
                  setNewCameraName("");
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Camera Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Camera Name
                </label>
                <input
                  type="text"
                  value={newCameraName}
                  onChange={(e) => setNewCameraName(e.target.value)}
                  placeholder="e.g., Front Door Camera"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              {/* Camera URL Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Camera URL
                </label>
                <input
                  type="text"
                  value={newCameraUrl}
                  onChange={(e) => setNewCameraUrl(e.target.value)}
                  placeholder="https://www.URL.com/ or rtsp://..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Enter RTSP, or HTTP stream URL
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddCameraModal(false);
                    setNewCameraUrl("");
                    setNewCameraName("");
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCamera}
                  className="flex-1 px-4 py-2.5 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Camera
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Camera Modal */}
      {editingCamera && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Pencil className="w-6 h-6 text-blue-500" />
                Edit Camera
              </h3>
              <button
                onClick={() => {
                  setEditingCamera(null);
                  setEditCameraName("");
                  setEditCameraUrl("");
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Camera Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Camera Name
                </label>
                <input
                  type="text"
                  value={editCameraName}
                  onChange={(e) => setEditCameraName(e.target.value)}
                  placeholder="e.g., Front Door Camera"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              {/* Camera URL Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Camera URL
                </label>
                <input
                  type="text"
                  value={editCameraUrl}
                  onChange={(e) => setEditCameraUrl(e.target.value)}
                  placeholder="https://www.URL.com/ or rtsp://..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Enter RTSP, or HTTP stream URL
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setEditingCamera(null);
                    setEditCameraName("");
                    setEditCameraUrl("");
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCamera}
                  className="flex-1 px-4 py-2.5 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
