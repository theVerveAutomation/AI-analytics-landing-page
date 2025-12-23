"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import ShopNavbar from "@/components/ShopNavbar";
import { Users, Video, Settings, BarChart3 } from "lucide-react";

export default function AdminHome() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) return router.push("/Login");

      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(prof);
      setLoading(false);
    })();
  }, [router]);

  if (loading || !profile) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <span className="text-lg text-gray-600 font-medium">
            Loading admin panel...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 mt-20 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-56 h-56 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-10 right-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/3 left-1/2 w-48 h-48 bg-indigo-200/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <ShopNavbar
        fullName={profile.full_name}
        role={profile.role}
        organizationLogo={profile.organization_logo}
      />

      <div className="max-w-6xl mx-auto px-6 py-10 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-40 rounded-full"></div>
              <div className="relative bg-white p-3 rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Video className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
            VAP Admin Panel
          </h1>
          <p className="text-gray-600 text-base max-w-xl mx-auto">
            AI-powered video analytics platform for intelligent surveillance and
            insights
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Management card */}
          <div className="group relative">
            <div className="relative bg-white border-2 border-blue-100 rounded-2xl p-6 pb-10 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
              <div className="mb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 blur-lg opacity-30 rounded-full"></div>
                <div className="relative w-16 h-16 mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center border-2 border-blue-200">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                User Management
              </h3>
              <p className="text-gray-600 mb-3 leading-relaxed text-sm text-center">
                Manage users, permissions, and access control for your
                organization
              </p>
              <div className="flex flex-wrap gap-2 mb-3 justify-center">
                {/* User Management */}
                <button
                  onClick={() => router.push("/panels/admin/users")}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-full border border-blue-700 cursor-pointer transition-all hover:shadow-md"
                >
                  View Users
                </button>
                {/* New User */}
                <button
                  onClick={() => router.push("/panels/admin/user-registration")}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-full border border-indigo-700 cursor-pointer transition-all hover:shadow-md"
                >
                  Add New User
                </button>
              </div>
            </div>
          </div>

          {/* Shop Management card */}
          <div className="group relative">
            <div className="relative bg-white border-2 border-purple-100 rounded-2xl p-6 pb-10 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
              <div className="mb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 blur-lg opacity-30 rounded-full"></div>
                <div className="relative w-16 h-16 mx-auto bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl flex items-center justify-center border-2 border-purple-200">
                  <Video className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                Shop Management
              </h3>
              <p className="text-gray-600 mb-3 leading-relaxed text-sm text-center">
                Manage shop products, inventory, and business operations
              </p>
              <div className="flex flex-wrap gap-2 mb-3 justify-center">
                <button
                  onClick={() => router.push("/panels/admin/products")}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-full border border-purple-700 cursor-pointer transition-all hover:shadow-md"
                >
                  View Products
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/70 backdrop-blur-sm rounded-full shadow-lg border border-gray-200">
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-gray-700">
              VAP System Active - All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
