"use client";

import { useEffect, useState } from "react";
import { AlertDetail, DashboardState } from "@/types";
import {
  Camera,
  Bell,
  Eye,
  Activity,
  UserCheck,
  Shield,
  Clock,
  AlertTriangle,
  AlertCircle,
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
import { userLoginStore } from "@/store/loginUserStore";

const barColors: Record<string, string> = {
  "Object Detection": "#10b981",
  "Motion Detection": "#3b82f6",
  "Staff Detection": "#8b5cf6",
  "Pacing Detection": "#f59e42",
  "Erratic Movements Detection": "#ef4444",
  "Arm Flailing Detection": "#f472b6",
  "Facial Expressions Detection": "#fbbf24",
  "Thermal Indicators Detection": "#14b8a6",
  "Fall Detection": "#a21caf",
  "Escape Attempts Detection": "#eab308",
  "Loitering Detection": "#06b6d4",
};

export default function DashboardPage() {
  const profile = userLoginStore((state) => state.user);
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    features: [],
    systemHealth: 0,
    cameras: {
      camerasOnline: 0,
      totalCameras: 0,
      cameraStatus: [],
    },
    alerts: {
      alertsToday: 0,
      recentAlerts: [],
    },
    detections: {
      totalDetections: 0,
      objectDetected: 0,
      staffDetected: 0,
      motionDetected: 0,
      pacingDetected: 0,
      erraticMovementsDetected: 0,
      armFlailingDetected: 0,
      facialExpressionsDetected: 0,
      thermalIndicatorsDetected: 0,
      fallDetectionDetected: 0,
      escapeAttemptsDetected: 0,
      loiteringDetected: 0,
    },
    hourlyDetections: [],
  });

  const stats = [
    {
      title: "Healthy Cameras",
      value: `${dashboardState.cameras.camerasOnline}`,
      subtitle: `of ${dashboardState.cameras.totalCameras} total`,
      icon: Camera,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/30",
      border: "border-blue-200 dark:border-blue-800",
    },
    {
      title: "Alerts Today",
      value: dashboardState.alerts.alertsToday.toString(),
      subtitle: "+0 from yesterday",
      icon: Bell,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/30",
      border: "border-amber-200 dark:border-amber-800",
    },
    {
      title: "Total Detections",
      value: dashboardState.detections.totalDetections.toString(),
      subtitle: "Last 24 hours",
      icon: Eye,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/30",
      border: "border-blue-200 dark:border-blue-800",
    },
    {
      title: "System Health",
      value: `${dashboardState.systemHealth}%`,
      subtitle: "System summary",
      icon: Shield,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/30",
      border: "border-purple-200 dark:border-purple-800",
    },
  ];

  const allDetectionTypes = [
    {
      name: "Object Detection",
      value: dashboardState.detections.objectDetected,
      color: "#10b981",
    },
    {
      name: "Motion Detection",
      value: dashboardState.detections.motionDetected,
      color: "#3b82f6",
    },
    {
      name: "Staff Detection",
      value: dashboardState.detections.staffDetected,
      color: "#8b5cf6",
    },
    {
      name: "Pacing Detection",
      value: dashboardState.detections.pacingDetected || 0,
      color: "#f59e42",
    },
    {
      name: "Erratic Movements Detection",
      value: dashboardState.detections.erraticMovementsDetected || 0,
      color: "#ef4444",
    },
    {
      name: "Arm Flailing Detection",
      value: dashboardState.detections.armFlailingDetected || 0,
      color: "#f472b6",
    },
    {
      name: "Facial Expressions Detection",
      value: dashboardState.detections.facialExpressionsDetected || 0,
      color: "#fbbf24",
    },
    {
      name: "Thermal Indicators Detection",
      value: dashboardState.detections.thermalIndicatorsDetected || 0,
      color: "#14b8a6",
    },
    {
      name: "Fall Detection",
      value: dashboardState.detections.fallDetectionDetected || 0,
      color: "#a21caf",
    },
    {
      name: "Escape Attempts Detection",
      value: dashboardState.detections.escapeAttemptsDetected || 0,
      color: "#eab308",
    },
    {
      name: "Loitering Detection",
      value: dashboardState.detections.loiteringDetected || 0,
      color: "#06b6d4",
    },
  ];

  const detectionsByType = allDetectionTypes.filter((type) =>
    dashboardState.features.includes(type.name),
  );

  useEffect(() => {
    const fetchDashboardState = async () => {
      try {
        const res = await fetch(
          "/api/dashboard/state?organization_id=" + profile?.organization_id,
        );
        if (!res.ok) throw new Error("Failed to fetch dashboard state");
        const {
          features,
          systemHealth,
          cameras,
          alerts,
          detections,
          hourlyDetections,
        } = await res.json();

        console.log("Features:", features);

        setDashboardState({
          features,
          systemHealth,
          cameras: cameras,
          alerts: alerts,
          detections: detections,
          hourlyDetections: hourlyDetections,
        });
      } catch (error) {
        console.error("Error fetching dashboard state:", error);
      }
    };
    if (profile) {
      fetchDashboardState();
    }
  }, [profile]);

  if (!profile) {
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
                <BarChart data={dashboardState.hourlyDetections}>
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
                  {dashboardState.features.map((feature) => (
                    <Bar
                      key={feature}
                      dataKey={feature}
                      name={feature}
                      fill={barColors[feature] || "#8884d8"}
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
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
                {dashboardState.alerts.recentAlerts.map(
                  (alert: AlertDetail) => (
                    <div
                      key={alert.id}
                      className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl"
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${getSeverityColor("")}`}
                      >
                        <AlertCircle className="w-5 h-5" />
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
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {alert.timestamp}
                        </p>
                      </div>
                    </div>
                  ),
                )}
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
                  {
                    dashboardState.cameras.cameraStatus.filter(
                      (c) => c.status === "normal",
                    ).length
                  }
                  /{dashboardState.cameras.cameraStatus.length} Normal
                </span>
              </div>

              <div className="space-y-3">
                {dashboardState.cameras.cameraStatus.map((camera) => (
                  <div
                    key={camera.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          camera.status === "normal"
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
