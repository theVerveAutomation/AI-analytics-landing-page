"use client";

import { useState } from "react";
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
} from "lucide-react";

interface CameraConfig {
  id: number;
  name: string;
  status: "normal" | "warning" | "offline";
  detection: boolean;
  alertSound: boolean;
  frameRate: number;
  resolution: string;
  lastUpdated: string;
}

const initialCameras: CameraConfig[] = [
  {
    id: 1,
    name: "Cam 1",
    status: "normal",
    detection: true,
    alertSound: true,
    frameRate: 15,
    resolution: "1080p",
    lastUpdated: "2s ago",
  },
  {
    id: 2,
    name: "Cam 2",
    status: "normal",
    detection: true,
    alertSound: false,
    frameRate: 30,
    resolution: "1080p",
    lastUpdated: "2s ago",
  },
  {
    id: 3,
    name: "Cam 3",
    status: "warning",
    detection: false,
    alertSound: true,
    frameRate: 15,
    resolution: "720p",
    lastUpdated: "5s ago",
  },
  {
    id: 4,
    name: "Cam 4",
    status: "normal",
    detection: true,
    alertSound: true,
    frameRate: 24,
    resolution: "1080p",
    lastUpdated: "2s ago",
  },
  {
    id: 5,
    name: "Cam 5",
    status: "normal",
    detection: true,
    alertSound: true,
    frameRate: 15,
    resolution: "1080p",
    lastUpdated: "2s ago",
  },
  {
    id: 6,
    name: "Cam 6",
    status: "normal",
    detection: true,
    alertSound: false,
    frameRate: 30,
    resolution: "4K",
    lastUpdated: "2s ago",
  },
  {
    id: 7,
    name: "Cam 7",
    status: "normal",
    detection: true,
    alertSound: true,
    frameRate: 15,
    resolution: "1080p",
    lastUpdated: "2s ago",
  },
  {
    id: 8,
    name: "Cam 8",
    status: "offline",
    detection: false,
    alertSound: false,
    frameRate: 15,
    resolution: "1080p",
    lastUpdated: "N/A",
  },
];

export default function CameraSettingPage() {
  const [cameras, setCameras] = useState<CameraConfig[]>(initialCameras);
  const [selectedCameraId, setSelectedCameraId] = useState<number>(1);
  const [hasChanges, setHasChanges] = useState(false);

  const selectedCamera =
    cameras.find((c) => c.id === selectedCameraId) || cameras[0];

  const updateCameraSetting = (
    cameraId: number,
    key: keyof CameraConfig,
    value: any
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
    setCameras(initialCameras);
    setHasChanges(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30";
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
            <Camera className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            Camera Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Configure camera settings for optimal performance
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
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
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Connected Cameras
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {cameras.map((camera) => (
            <button
              key={camera.id}
              onClick={() => setSelectedCameraId(camera.id)}
              className={`relative group rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                selectedCameraId === camera.id
                  ? "border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-200 dark:ring-emerald-800"
                  : "border-gray-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-600"
              }`}
            >
              {/* Camera Preview Thumbnail */}
              <div className="aspect-video bg-gray-900 dark:bg-slate-950 flex items-center justify-center">
                {camera.status === "offline" ? (
                  <WifiOff className="w-8 h-8 text-gray-500" />
                ) : (
                  <div className="text-gray-500 text-xs">
                    <Camera className="w-8 h-8 mx-auto mb-1" />
                    Live Feed
                  </div>
                )}
              </div>
              {/* Camera Info */}
              <div className="p-3 bg-white dark:bg-slate-800 flex items-center justify-between">
                <span className="font-medium text-gray-800 dark:text-white text-sm">
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
              {/* Selection Indicator */}
              {selectedCameraId === camera.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
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
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">
                Select Camera:
              </label>
              <select
                value={selectedCameraId}
                onChange={(e) => setSelectedCameraId(Number(e.target.value))}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              >
                {cameras.map((camera) => (
                  <option key={camera.id} value={camera.id}>
                    {camera.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Large Preview */}
          <div className="aspect-video bg-gray-900 dark:bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center mb-4">
            {selectedCamera.status === "offline" ? (
              <div className="text-center text-gray-500">
                <WifiOff className="w-16 h-16 mx-auto mb-2" />
                <p>Camera Offline</p>
              </div>
            ) : (
              <div className="text-gray-500 text-center">
                <Camera className="w-16 h-16 mx-auto mb-2" />
                <p>Live Camera Feed - {selectedCamera.name}</p>
                <p className="text-sm mt-1">
                  {selectedCamera.resolution} @ {selectedCamera.frameRate}fps
                </p>
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between text-sm">
            <span
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full capitalize ${getStatusColor(
                selectedCamera.status
              )}`}
            >
              {getStatusIcon(selectedCamera.status)}
              {selectedCamera.status}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              Status updates every 2s
            </span>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
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
                  onClick={() =>
                    updateCameraSetting(
                      selectedCameraId,
                      "detection",
                      !selectedCamera.detection
                    )
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    selectedCamera.detection
                      ? "bg-emerald-500"
                      : "bg-gray-300 dark:bg-slate-600"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      selectedCamera.detection ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                {selectedCamera.detection ? (
                  <Eye className="w-4 h-4 text-emerald-500" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
                <span>{selectedCamera.detection ? "Enabled" : "Disabled"}</span>
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
                  onClick={() =>
                    updateCameraSetting(
                      selectedCameraId,
                      "alertSound",
                      !selectedCamera.alertSound
                    )
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    selectedCamera.alertSound
                      ? "bg-emerald-500"
                      : "bg-gray-300 dark:bg-slate-600"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      selectedCamera.alertSound ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                {selectedCamera.alertSound ? (
                  <Volume2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
                <span>{selectedCamera.alertSound ? "On" : "Off"}</span>
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
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  {selectedCamera.frameRate} fps
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={selectedCamera.frameRate}
                onChange={(e) =>
                  updateCameraSetting(
                    selectedCameraId,
                    "frameRate",
                    Number(e.target.value)
                  )
                }
                className="w-full h-2 bg-gray-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-emerald-500"
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
                value={selectedCamera.resolution}
                onChange={(e) =>
                  updateCameraSetting(
                    selectedCameraId,
                    "resolution",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
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
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
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

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Note: Server-side must respect Detection ON/OFF and frame rate
              settings for them to be effective.
            </p>
          </div>
        </div>
      </div>

      {/* Version Footer */}
      <div className="text-right text-xs text-gray-400 dark:text-gray-500">
        v1.3.0
      </div>
    </div>
  );
}
