"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Video,
  Play,
  Pause,
  Eye,
  Activity,
  AlertTriangle,
  HardDrive,
  TrendingUp,
  Camera,
  Clock,
  User,
  Package,
  Car,
  Users,
  Zap,
  Download,
  Search,
  Filter,
  MapPin,
} from "lucide-react";

const metrics = [
  {
    title: "Active Video Feeds",
    value: "12/14",
    change: "+2 today",
    icon: Video,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/30",
  },
  {
    title: "Total Detections",
    value: "1,247",
    change: "+156 today",
    icon: Eye,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/30",
  },
  {
    title: "Active Events",
    value: "23",
    change: "5 critical",
    icon: AlertTriangle,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/30",
  },
  {
    title: "Storage Used",
    value: "2.4 TB",
    change: "68% capacity",
    icon: HardDrive,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/30",
  },
];

const detectionData = [
  { name: "Person", value: 542, color: "#10b981" },
  { name: "Vehicle", value: 318, color: "#3b82f6" },
  { name: "Object", value: 267, color: "#8b5cf6" },
  { name: "Motion", value: 120, color: "#f59e0b" },
];

const hourlyActivity = [
  { hour: "00:00", detections: 12 },
  { hour: "03:00", detections: 8 },
  { hour: "06:00", detections: 28 },
  { hour: "09:00", detections: 76 },
  { hour: "12:00", detections: 95 },
  { hour: "15:00", detections: 102 },
  { hour: "18:00", detections: 88 },
  { hour: "21:00", detections: 45 },
];

const cameraFeeds = [
  { id: 1, name: "Entrance", status: "active", detections: 45 },
  { id: 2, name: "Parking Lot", status: "active", detections: 67 },
  { id: 3, name: "Hallway A", status: "active", detections: 23 },
  { id: 4, name: "Reception", status: "active", detections: 38 },
  { id: 5, name: "Back Door", status: "inactive", detections: 0 },
  { id: 6, name: "Storage", status: "active", detections: 12 },
];

const recentEvents = [
  {
    id: 1,
    type: "Person Detected",
    camera: "Entrance",
    time: "2 min ago",
    severity: "low",
    icon: User,
    color: "text-cyan-500",
  },
  {
    id: 2,
    type: "Vehicle Detected",
    camera: "Parking Lot",
    time: "5 min ago",
    severity: "low",
    icon: Car,
    color: "text-blue-500",
  },
  {
    id: 3,
    type: "Unauthorized Access",
    camera: "Back Door",
    time: "12 min ago",
    severity: "critical",
    icon: AlertTriangle,
    color: "text-red-500",
  },
  {
    id: 4,
    type: "Group Detected",
    camera: "Reception",
    time: "18 min ago",
    severity: "medium",
    icon: Users,
    color: "text-amber-500",
  },
  {
    id: 5,
    type: "Object Movement",
    camera: "Storage",
    time: "25 min ago",
    severity: "low",
    icon: Package,
    color: "text-purple-500",
  },
];

export default function VideoAnalyticsPage() {
  const [selectedCamera, setSelectedCamera] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <Video className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Video Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Real-time video monitoring and intelligent detection
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search
          </button>
          <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.title}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${metric.bg}`}
              >
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {metric.title}
            </p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
              {metric.value}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {metric.change}
            </p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Video Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Video Player */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Live Feed -{" "}
                  {cameraFeeds.find((c) => c.id === selectedCamera)?.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Camera {selectedCamera} • Real-time monitoring
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  LIVE
                </span>
              </div>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden mb-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="w-16 h-16 text-gray-600" />
              </div>
              {/* Overlay Info */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <div className="px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg text-white text-sm">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {new Date().toLocaleTimeString()}
                </div>
                <div className="px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg text-white text-sm">
                  <MapPin className="w-3 h-3 inline mr-1" />
                  Main Entrance
                </div>
              </div>
            </div>

            {/* Video Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {isPlaying ? "Playing" : "Paused"}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Activity className="w-4 h-4" />
                <span>45 detections today</span>
              </div>
            </div>
          </div>

          {/* Camera Grid */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Camera Feeds
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {cameraFeeds.map((camera) => (
                <button
                  key={camera.id}
                  onClick={() => setSelectedCamera(camera.id)}
                  className={`relative aspect-video rounded-xl overflow-hidden transition-all ${
                    selectedCamera === camera.id
                      ? "ring-2 ring-blue-600"
                      : "hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600"
                  }`}
                >
                  <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-600" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-xs font-medium">
                        {camera.name}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          camera.status === "active"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                        }`}
                      ></span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Detection by Type */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Detection by Type
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Today&apos;s distribution
                  </p>
                </div>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={detectionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={70}
                    dataKey="value"
                  >
                    {detectionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Hourly Activity */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Hourly Activity
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Detection trends
                  </p>
                </div>
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={hourlyActivity}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#374151"
                    strokeOpacity={0.3}
                  />
                  <XAxis
                    dataKey="hour"
                    stroke="#9ca3af"
                    tick={{ fill: "#9ca3af", fontSize: 11 }}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    tick={{ fill: "#9ca3af", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="detections"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Recent Events */}
        <div className="space-y-6">
          {/* Recent Events */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Recent Events
              </h3>
              <Zap className="w-5 h-5 text-amber-500" />
            </div>
            <div className="space-y-3">
              {recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${
                        event.severity === "critical"
                          ? "bg-red-100 dark:bg-red-900/30"
                          : event.severity === "medium"
                          ? "bg-amber-100 dark:bg-amber-900/30"
                          : "bg-blue-100 dark:bg-blue-900/30"
                      } flex items-center justify-center flex-shrink-0`}
                    >
                      <event.icon className={`w-5 h-5 ${event.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
                        {event.type}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {event.camera} • {event.time}
                      </p>
                    </div>
                    {event.severity === "critical" && (
                      <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-xs font-medium">
                        Critical
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Today&apos;s Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-90">Total Events</span>
                <span className="text-xl font-bold">247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-90">Critical Alerts</span>
                <span className="text-xl font-bold">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-90">Avg Response</span>
                <span className="text-xl font-bold">1.2s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-90">Accuracy</span>
                <span className="text-xl font-bold">98.5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
