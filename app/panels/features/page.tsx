"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Profile } from "@/types";
import { Users, UserCheck, UserX, CalendarClock } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const stats = [
  {
    title: "Total Employees",
    value: "128",
    icon: Users,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/30",
    border: "border-blue-200 dark:border-blue-800",
  },
  {
    title: "Present Today",
    value: "102",
    icon: UserCheck,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/30",
    border: "border-green-200 dark:border-green-800",
  },
  {
    title: "On Leave",
    value: "18",
    icon: CalendarClock,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/30",
    border: "border-amber-200 dark:border-amber-800",
  },
  {
    title: "Absent",
    value: "8",
    icon: UserX,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/30",
    border: "border-red-200 dark:border-red-800",
  },
];

const attendanceData = [
  { name: "Present", value: 102, color: "#16a34a" },
  { name: "On Leave", value: 18, color: "#d97706" },
  { name: "Absent", value: 8, color: "#dc2626" },
];

const trendData = [
  { day: "Mon", present: 98, absent: 10 },
  { day: "Tue", present: 105, absent: 7 },
  { day: "Wed", present: 102, absent: 8 },
  { day: "Thu", present: 108, absent: 5 },
  { day: "Fri", present: 102, absent: 8 },
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
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <span className="text-lg text-slate-600 dark:text-slate-300 font-medium">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-slate-900 relative overflow-hidden">
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
              Authentication Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Overview of employee attendance and access status
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((item) => (
              <div
                key={item.title}
                className={`bg-white dark:bg-slate-800 border-2 ${item.border} rounded-2xl p-5 shadow-sm`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {item.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
                      {item.value}
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
            {/* Attendance Status */}
            <div className="bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                Attendance Status
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Distribution of employee attendance
              </p>

              {/* Pie Chart */}
              <ResponsiveContainer width="100%" height={224}>
                <PieChart>
                  <Pie
                    data={attendanceData}
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
                    {attendanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--tooltip-bg, #fff)",
                      border: "1px solid var(--tooltip-border, #e5e7eb)",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Daily Attendance Trend */}
            <div className="bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                Daily Attendance Trend
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Attendance movement across days
              </p>

              {/* Line Chart */}
              <ResponsiveContainer width="100%" height={224}>
                <LineChart data={trendData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#374151"
                    strokeOpacity={0.3}
                  />
                  <XAxis
                    dataKey="day"
                    stroke="#9ca3af"
                    tick={{ fill: "#9ca3af" }}
                  />
                  <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--tooltip-bg, #fff)",
                      border: "1px solid var(--tooltip-border, #e5e7eb)",
                      borderRadius: "8px",
                      color: "#374151",
                    }}
                  />
                  <Legend wrapperStyle={{ color: "#9ca3af" }} />
                  <Line
                    type="monotone"
                    dataKey="present"
                    stroke="#16a34a"
                    strokeWidth={2}
                    name="Present"
                    dot={{ fill: "#16a34a" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="absent"
                    stroke="#dc2626"
                    strokeWidth={2}
                    name="Absent"
                    dot={{ fill: "#dc2626" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
