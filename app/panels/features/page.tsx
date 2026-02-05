"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Profile } from "@/types";
import {
  Camera,
  Bell,
  Eye,
  Activity,
  UserCheck,
  Shield,
  Clock,
  AlertTriangle,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const stats = [
  {
    title: "Cameras Online",
    value: "3",
    subtitle: "of 3 total",
    icon: Camera,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/30",
    border: "border-blue-200 dark:border-blue-800",
  },
  {
    title: "Alerts Today",
    value: "0",
    subtitle: "+0 from yesterday",
    icon: Bell,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/30",
    border: "border-amber-200 dark:border-amber-800",
  },
  {
    title: "Total Detections",
    value: "1,284",
    subtitle: "Last 24 hours",
    icon: Eye,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/30",
    border: "border-blue-200 dark:border-blue-800",
  },
  {
    title: "System Health",
    value: "98%",
    subtitle: "All systems operational",
    icon: Shield,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/30",
    border: "border-purple-200 dark:border-purple-800",
  },
];

const detectionsByType = [
  { name: "Object", value: 524, color: "#10b981" },
  { name: "Motion", value: 412, color: "#3b82f6" },
  { name: "Staff", value: 348, color: "#8b5cf6" },
];

const hourlyDetections = [
  { hour: "6AM", object: 0, motion: 0, Staff: 0 },
  { hour: "9AM", object: 45, motion: 32, Staff: 28 },
  { hour: "12PM", object: 78, motion: 65, Staff: 42 },
  { hour: "3PM", object: 92, motion: 71, Staff: 55 },
  { hour: "6PM", object: 68, motion: 52, Staff: 38 },
  { hour: "9PM", object: 0, motion: 0, Staff: 0 },
];

const recentAlerts = [
  {
    id: 2,
    type: "Motion Detection",
    message: "Movement detected in restricted area",
    camera: "Cam 1",
    time: "8 min ago",
    severity: "medium",
    icon: Activity,
  },
  {
    id: 3,
    type: "Staff Recognition",
    message: "Unknown person identified at entrance",
    camera: "Cam 2",
    time: "15 min ago",
    severity: "high",
    icon: UserCheck,
  },
  {
    id: 4,
    type: "Motion Detection",
    message: "Activity detected after hours",
    camera: "Cam 3",
    time: "32 min ago",
    severity: "low",
    icon: Activity,
  },
];

const cameraStatus = [
  { id: 1, name: "Main Entrance", status: "online", detections: 145 },
  { id: 2, name: "Server Room", status: "online", detections: 23 },
  { id: 3, name: "Office Area", status: "online", detections: 0 },
];

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) return router.replace("/Login");

      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(prof);
      setLoading(false);
    })();
  }, []);

  if (loading || !profile) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <span className="text-lg text-slate-600 dark:text-slate-300 font-medium">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
      case "medium":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400";
      case "low":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-slate-900 relative overflow-hidden">
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                Video Analytics Pro Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Real-time video analytics and monitoring overview
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Last updated: Just now</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((item) => (
              <div
                key={item.title}
                className={`bg-white dark:bg-slate-800 border-2 ${item.border} rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {item.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
                      {item.value}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {item.subtitle}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg}`}
                  >
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Detection by Type */}
            <div className="bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                Detections by Type
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Distribution of detection events (24h)
              </p>

              <ResponsiveContainer width="100%" height={224}>
                <PieChart>
                  <Pie
                    data={detectionsByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                  >
                    {detectionsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--tooltip-bg, #1e293b)",
                      border: "1px solid var(--tooltip-border, #334155)",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Hourly Detection Trend */}
            <div className="bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                Hourly Detection Trend
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Detection activity throughout the day
              </p>

              <ResponsiveContainer width="100%" height={224}>
                <BarChart data={hourlyDetections}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#374151"
                    strokeOpacity={0.3}
                  />
                  <XAxis
                    dataKey="hour"
                    stroke="#9ca3af"
                    tick={{ fill: "#9ca3af" }}
                  />
                  <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                  />
                  <Legend wrapperStyle={{ color: "#9ca3af" }} />
                  <Bar
                    dataKey="object"
                    name="Object"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="motion"
                    name="Motion"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Staff"
                    name="Staff"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Recent Alerts */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Recent Alerts
                  </h3>
                </div>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${getSeverityColor(
                        alert.severity
                      )}`}
                    >
                      <alert.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                        {alert.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {alert.type} • {alert.camera}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(
                          alert.severity
                        )}`}
                      >
                        {alert.severity}
                      </span>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {alert.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Camera Status */}
            <div className="bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Camera Status
                  </h3>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {cameraStatus.filter((c) => c.status === "online").length}/
                  {cameraStatus.length} online
                </span>
              </div>

              <div className="space-y-3">
                {cameraStatus.map((camera) => (
                  <div
                    key={camera.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          camera.status === "online"
                            ? "bg-blue-500"
                            : "bg-red-500"
                        }`}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {camera.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {camera.detections} detections
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
