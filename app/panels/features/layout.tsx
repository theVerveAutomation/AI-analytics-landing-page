"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  LayoutDashboard,
  Bell,
  Users,
  UserPlus,
  ClipboardCheck,
  BarChart3,
  CalendarDays,
  ChevronDown,
} from "lucide-react";
import { Profile } from "@/types";

export default function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [openEmployees, setOpenEmployees] = useState(
    pathname.startsWith("/panels/features/employees")
  );
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!prof) {
        router.replace("/login");
        return;
      }

      setProfile(prof);
      setLoading(false);
    })();
  }, [router]);

  if (loading || !profile) {
    return null;
  }
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navbar */}
      {/* <div className="fixed top-0 left-0 right-0 z-40">
        <ShopNavbar
          fullName={profile.full_name}
          role={profile.role}
          organizationLogo={profile.organization_logo}
          hideBrandLogo
        />
      </div> */}

      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-xl border-r border-slate-200 fixed left-0 top-0 h-screen flex flex-col z-50">
        {/* Logo & Header Section */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center gap-3">
            {/* <div className="w-20 h-20 rounded-xl flex items-center justify-center">
              <Image
                src="/assets/images/logo.png"
                alt="Logo"
                className="w-16 h-16 object-contain"
                width={64}
                height={64}
              />
            </div> */}
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                AI VAP
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                AI Video Analytics Platform
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {/* Dashboard */}
          <button
            onClick={() => router.push("/panels/features")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200
              ${
                pathname === "/panels/features"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200 scale-105"
                  : "text-slate-700 hover:bg-slate-100 hover:scale-105"
              }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>

          {/* Alerts */}
          <button
            onClick={() => router.push("/panels/features/alerts")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200
              ${
                pathname === "/panels/features/alerts"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200 scale-105"
                  : "text-slate-700 hover:bg-slate-100 hover:scale-105"
              }`}
          >
            <Bell className="w-5 h-5" />
            <span>Alerts</span>
          </button>

          {/* Employees Dropdown */}
          <div className="space-y-1">
            <button
              onClick={() => setOpenEmployees(!openEmployees)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold transition-all duration-200
                ${
                  pathname.startsWith("/panels/features/employees")
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-700 hover:bg-slate-100"
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

            {/* Dropdown Items */}
            <div
              className={`ml-4 pl-4 border-l-2 border-emerald-200 space-y-1 overflow-hidden transition-all duration-300 ${
                openEmployees ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {/* Employee Registration */}
              <button
                onClick={() =>
                  router.push("/panels/features/employees/register")
                }
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200
                  ${
                    pathname === "/panels/features/employees/register"
                      ? "bg-emerald-100 text-emerald-700 font-semibold shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                <UserPlus className="w-4 h-4" />
                <span className="text-sm">Registration</span>
              </button>

              {/* Attendance */}
              <button
                onClick={() =>
                  router.push("/panels/features/employees/attendance")
                }
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200
                  ${
                    pathname === "/panels/features/employees/attendance"
                      ? "bg-emerald-100 text-emerald-700 font-semibold shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                <ClipboardCheck className="w-4 h-4" />
                <span className="text-sm">Attendance</span>
              </button>

              {/* Reports */}
              <button
                onClick={() =>
                  router.push("/panels/features/employees/reports")
                }
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200
                  ${
                    pathname === "/panels/features/employees/reports"
                      ? "bg-emerald-100 text-emerald-700 font-semibold shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm">Reports</span>
              </button>
            </div>
          </div>

          {/* Schedule */}
          <button
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
          </button>
        </nav>

        {/* Profile Section */}
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={() => router.push("/panels/features/change-password")}
            className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl 
            bg-gradient-to-r from-slate-50 to-slate-100 hover:from-emerald-50 hover:to-teal-50
            border border-slate-200 hover:border-emerald-200 transition-all duration-300"
          >
            <div
              className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 
            flex items-center justify-center text-white font-bold text-sm shadow-md"
            >
              {profile.full_name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {profile.full_name || "User"}
              </p>
              <p className="text-xs text-slate-500 capitalize">
                {profile.role || "Member"}
              </p>
            </div>
            <svg
              className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>

        {/* Footer Info */}
        <div className="w-full p-4 border-t border-slate-200 bg-slate-50">
          <div className="text-xs text-slate-500 text-center">
            <p className="font-medium">Version 1.0.0</p>
            <p className="mt-1">© 2025 AI VAP</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto ml-72 mt-20">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
