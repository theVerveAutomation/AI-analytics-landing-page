"use client";
import { Feature, Profile } from "@/types";
import {
  Camera,
  ChevronDown,
  Key,
  LayoutDashboard,
  LogOut,
  Moon,
  Settings,
  Sun,
  User,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface SidebarProps {
  openEmployees?: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  theme: string | undefined;
  setTheme: (theme: string) => void;
  setOpenEmployees?: (open: boolean) => void;
  profile: Profile;
  features: Feature[];
  profileMenuOpen: boolean;
  setProfileMenuOpen: (open: boolean) => void;
}

export default function Sidebar({
  openEmployees,
  sidebarOpen,
  setSidebarOpen,
  theme,
  setTheme,
  setOpenEmployees,
  profile,
  features,
  profileMenuOpen,
  setProfileMenuOpen,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 lg:w-1/5 bg-white dark:bg-slate-900 shadow-xl border-r border-slate-200 dark:border-slate-700
        max-h-screen flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      {/* Logo & Header Section */}
      <div className="flex-shrink-0 p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                AI VAP
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                AI Video Analytics Platform
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Theme Toggle - Desktop */}

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden lg:flex p-2 rounded-lg hover:bg-emerald-100 dark:hover:bg-slate-700 transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              )}
            </button>

            {/* Close button for mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-emerald-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Dashboard */}
        <button
          onClick={() => router.push("/panels/features")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200
              ${
                pathname === "/panels/features"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 scale-105"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105"
              }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </button>

        {/* Employees Dropdown */}
        {/* <div className="space-y-1">
          <button
            onClick={() => setOpenEmployees(!openEmployees)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold transition-all duration-200
                ${
                  pathname.startsWith("/panels/features/employees")
                    ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5" />
              <span>Employees</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                openEmployees ? "rotate-180" : ""
              }`}
            />
          </button>
          Dropdown Items
          <div
            className={`ml-4 pl-4 border-l-2 border-emerald-200 dark:border-emerald-700 space-y-1 overflow-hidden transition-all duration-300 ${
              openEmployees ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            Employee Registration
            <button
              onClick={() => router.push("/panels/features/employees/register")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200
                  ${
                    pathname === "/panels/features/employees/register"
                      ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-semibold shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
            >
              <UserPlus className="w-4 h-4" />
              <span className="text-sm">Registration</span>
            </button>
            Attendance
            <button
              onClick={() =>
                router.push("/panels/features/employees/attendance")
              }
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200
                  ${
                    pathname === "/panels/features/employees/attendance"
                      ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-semibold shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
            >
              <ClipboardCheck className="w-4 h-4" />
              <span className="text-sm">Attendance</span>
            </button>
            Reports
            <button
              onClick={() => router.push("/panels/features/employees/reports")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200
                  ${
                    pathname === "/panels/features/employees/reports"
                      ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-semibold shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm">Reports</span>
            </button>
          </div>
        </div> */}

        {/* Schedule */}
        {/* <button
            onClick={() => router.push("/panels/features/schedule")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200
              ${
                pathname === "/panels/features/schedule"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200 scale-105"
                  : "text-slate-700 hover:bg-slate-100 hover:scale-105"
              }`}
          >
            <CalendarDays className="w-5 h-5" />
            <span>Schedule</span>
          </button> */}

        {/* enabled feature links*/}
        {features.map((feature) => (
          <button
            key={feature.id}
            onClick={() => {
              router.push(
                `/panels/features/${feature.name
                  .toLowerCase()
                  .split(" ")
                  .join("-")}`
              );
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200
              ${
                pathname ===
                `/panels/features/${feature.name
                  .toLowerCase()
                  .split(" ")
                  .join("-")}`
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 scale-105"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105"
              }`}
          >
            <span>{feature.name}</span>
          </button>
        ))}
        {/* Camera Settings */}
        <button
          onClick={() => router.push("/panels/features/camera-settings")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200
              ${
                pathname === "/panels/features/camera-settings"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 scale-105"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105"
              }`}
        >
          <Camera className="w-5 h-5" />
          <span>Camera Settings</span>
        </button>
      </nav>

      {/* Profile Section */}
      <div className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-700">
        {/* Profile Button */}
        <button
          onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl 
            bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800 
            hover:from-emerald-50 hover:to-teal-50 dark:hover:from-emerald-900/30 dark:hover:to-teal-900/30
            border border-slate-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-700 transition-all duration-300"
        >
          <div
            className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 
            flex items-center justify-center text-white font-bold text-sm shadow-md"
          >
            {profile.full_name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
              {profile.full_name || "User"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize truncate">
              {profile.role || "Member"}
            </p>
          </div>
          {profileMenuOpen ? (
            <ChevronDown className="w-4 h-4 flex-shrink-0 text-slate-400 dark:text-slate-500 transition-transform rotate-180" />
          ) : (
            <ChevronDown className="w-4 h-4 flex-shrink-0 text-slate-400 dark:text-slate-500 transition-transform" />
          )}
        </button>

        {/* Profile Menu Options */}
        <div
          className={`mt-2 space-y-1 overflow-hidden transition-all duration-300 ${
            profileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {/* View Profile */}
          <button
            onClick={() => router.push("/panels/features/profile")}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 
              hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-all duration-200"
          >
            <User className="w-4 h-4" />
            <span className="text-sm">View Profile</span>
          </button>

          {/* Change Password */}
          <button
            onClick={() => router.push("/panels/features/change-password")}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 
              hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-all duration-200"
          >
            <Key className="w-4 h-4" />
            <span className="text-sm">Change Password</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => router.push("/panels/features/settings")}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 
              hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-all duration-200"
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </button>

          {/* Divider */}
          <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>

          {/* Logout */}
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.replace("/login");
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-600 dark:text-red-400 
              hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex-shrink-0 w-full p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
          <p className="font-medium">Version 1.0.0</p>
          <p className="mt-1">© 2025 AI VAP</p>
        </div>
      </div>
    </aside>
  );
}
