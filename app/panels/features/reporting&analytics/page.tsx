"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Eye,
  Activity,
  UserCheck,
  Camera,
  AlertTriangle,
  Clock,
  Filter,
  ChevronDown,
} from "lucide-react";

type TimeRange = "7d" | "30d" | "90d" | "1y";
type ReportType = "daily" | "weekly" | "monthly";

const detectionTrendData = [
  { date: "Jan 1", object: 45, motion: 32, face: 28 },
  { date: "Jan 2", object: 52, motion: 38, face: 31 },
  { date: "Jan 3", object: 48, motion: 35, face: 29 },
  { date: "Jan 4", object: 61, motion: 42, face: 35 },
  { date: "Jan 5", object: 55, motion: 40, face: 33 },
  { date: "Jan 6", object: 67, motion: 48, face: 41 },
  { date: "Jan 7", object: 59, motion: 44, face: 37 },
];

const alertDistribution = [
  { name: "Critical", value: 12, color: "#dc2626" },
  { name: "High", value: 28, color: "#f59e0b" },
  { name: "Medium", value: 45, color: "#3b82f6" },
  { name: "Low", value: 68, color: "#10b981" },
];

const cameraPerformance = [
  { camera: "Cam 1", uptime: 99.8, detections: 234, alerts: 12 },
  { camera: "Cam 2", uptime: 98.5, detections: 189, alerts: 8 },
  { camera: "Cam 3", uptime: 100, detections: 156, alerts: 5 },
  { camera: "Cam 4", uptime: 97.2, detections: 201, alerts: 15 },
  { camera: "Cam 5", uptime: 99.1, detections: 178, alerts: 9 },
  { camera: "Cam 6", uptime: 99.6, detections: 212, alerts: 11 },
];

const hourlyActivityData = [
  { hour: "00:00", activity: 12 },
  { hour: "03:00", activity: 8 },
  { hour: "06:00", activity: 25 },
  { hour: "09:00", activity: 68 },
  { hour: "12:00", activity: 89 },
  { hour: "15:00", activity: 95 },
  { hour: "18:00", activity: 78 },
  { hour: "21:00", activity: 42 },
];

const weeklyComparison = [
  { week: "Week 1", thisYear: 420, lastYear: 380 },
  { week: "Week 2", thisYear: 445, lastYear: 395 },
  { week: "Week 3", thisYear: 468, lastYear: 410 },
  { week: "Week 4", thisYear: 490, lastYear: 425 },
];

const reports = [
  {
    id: 1,
    title: "Daily Detection Summary",
    type: "Daily Report",
    date: "Jan 5, 2026",
    size: "2.4 MB",
    icon: FileText,
  },
  {
    id: 2,
    title: "Weekly Analytics Report",
    type: "Weekly Report",
    date: "Jan 1-7, 2026",
    size: "5.8 MB",
    icon: FileText,
  },
  {
    id: 3,
    title: "Monthly Performance Review",
    type: "Monthly Report",
    date: "December 2025",
    size: "12.3 MB",
    icon: FileText,
  },
  {
    id: 4,
    title: "Alert Analysis Report",
    type: "Custom Report",
    date: "Last 30 days",
    size: "3.7 MB",
    icon: FileText,
  },
];

const metrics = [
  {
    title: "Total Detections",
    value: "8,547",
    change: "+12.5%",
    trend: "up",
    icon: Eye,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/30",
  },
  {
    title: "Active Cameras",
    value: "14/14",
    change: "100%",
    trend: "stable",
    icon: Camera,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
  },
  {
    title: "Total Alerts",
    value: "153",
    change: "-8.3%",
    trend: "down",
    icon: AlertTriangle,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/30",
  },
  {
    title: "Avg Response Time",
    value: "2.3s",
    change: "-15.2%",
    trend: "down",
    icon: Clock,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/30",
  },
];

export default function ReportingAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [reportType, setReportType] = useState<ReportType>("daily");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <BarChart className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            Reporting & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive insights and performance metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none pr-10"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            <Calendar className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          {/* Export Button */}
          <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
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
              <span
                className={`text-sm font-medium px-2 py-1 rounded-full ${
                  metric.trend === "up"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                    : metric.trend === "down"
                    ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                    : "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400"
                }`}
              >
                {metric.change}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {metric.title}
            </p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detection Trends */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Detection Trends
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Daily detection activity by type
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={detectionTrendData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                strokeOpacity={0.3}
              />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
              />
              <YAxis
                stroke="#9ca3af"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#f1f5f9",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line
                type="monotone"
                dataKey="object"
                stroke="#10b981"
                strokeWidth={2}
                name="Object"
              />
              <Line
                type="monotone"
                dataKey="motion"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Motion"
              />
              <Line
                type="monotone"
                dataKey="face"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="Face"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Alert Distribution */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Alert Distribution
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Alerts by severity level
              </p>
            </div>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={alertDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${Math.round((percent ?? 0) * 100)}%`
                }
                outerRadius={80}
                dataKey="value"
              >
                {alertDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Activity */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Hourly Activity Pattern
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Detection activity by hour
              </p>
            </div>
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={hourlyActivityData}>
              <defs>
                <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                strokeOpacity={0.3}
              />
              <XAxis
                dataKey="hour"
                stroke="#9ca3af"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
              />
              <YAxis
                stroke="#9ca3af"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="activity"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorActivity)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Comparison */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Year-over-Year Comparison
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Weekly detection comparison
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyComparison}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                strokeOpacity={0.3}
              />
              <XAxis
                dataKey="week"
                stroke="#9ca3af"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
              />
              <YAxis
                stroke="#9ca3af"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar
                dataKey="thisYear"
                name="2026"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="lastYear"
                name="2025"
                fill="#6b7280"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Camera Performance Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Camera Performance
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Individual camera statistics and uptime
            </p>
          </div>
          <Camera className="w-5 h-5 text-emerald-500" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Camera
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Uptime
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Detections
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Alerts
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {cameraPerformance.map((camera, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-gray-800 dark:text-white font-medium">
                    {camera.camera}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden max-w-[100px]">
                        <div
                          className={`h-full ${
                            camera.uptime >= 99
                              ? "bg-emerald-500"
                              : camera.uptime >= 95
                              ? "bg-amber-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${camera.uptime}%` }}
                        />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-xs">
                        {camera.uptime}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                    {camera.detections}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                    {camera.alerts}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        camera.uptime >= 99
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {camera.uptime >= 99 ? "Excellent" : "Good"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generated Reports */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Generated Reports
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Download previously generated reports
            </p>
          </div>
          <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors">
            Generate New Report
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <report.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                  {report.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {report.type} • {report.date}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {report.size}
                </span>
                <button className="p-2 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors">
                  <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
