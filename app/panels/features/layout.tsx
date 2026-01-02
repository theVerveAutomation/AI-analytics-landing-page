"use client";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import React, { useEffect, useState } from "react";
import MobileHeader from "@/components/MobileHeader";
import { Feature, Profile } from "@/types";
import { useTheme } from "next-themes";
import Sidebar from "@/components/SideBar";

export default function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [features, setFeatures] = useState<Feature[]>([]);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!profile) {
        router.push("/login");
        return;
      }
      setProfile(profile as Profile);

      const { data: userFeatures, error: featuresError } = await supabase
        .from("user_features")
        .select("feature_id, features!inner(*)")
        .eq("user_id", user.id)
        .eq("features.enabled", true);

      if (featuresError) {
        console.error("Error fetching features:", featuresError);
      }
      const assignedFeatures: Feature[] =
        userFeatures
          ?.map((uf: unknown) => (uf as { features: Feature }).features)
          .filter((f: Feature) => f !== null) || [];
      setFeatures(assignedFeatures);
    };
    fetchData();
  }, []);

  return (
    <div
      className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
      suppressHydrationWarning
    >
      {/* Mobile Header */}
      <MobileHeader profile={profile} setSidebarOpen={setSidebarOpen} />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        // openEmployees={openEmployees}
        // setOpenEmployees={setOpenEmployees}
        profile={profile}
        features={features}
        theme={theme}
        setTheme={setTheme}
        profileMenuOpen={profileMenuOpen}
        setProfileMenuOpen={setProfileMenuOpen}
      />

      {/* Main content */}
      <main className="flex-1 flex overflow-auto pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
