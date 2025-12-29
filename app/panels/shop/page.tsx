"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import ShopNavbar from "@/components/ShopNavbar";
import { ShieldCheck } from "lucide-react";
import { Profile, Feature } from "@/types";

export default function ServicesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) return router.replace("/login");

      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      // Fetch user's assigned features with full feature details
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
          ?.map((uf: any) => uf.features)
          .filter((f: Feature) => f !== null) || [];

      setFeatures(assignedFeatures);
      console.log("Assigned features for user:", assignedFeatures);
      setProfile(prof);
      setLoading(false);
    })();
  }, []);

  if (loading || !profile) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <span className="text-lg text-slate-300 font-medium">
            Loading features...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 mt-20 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <ShopNavbar
        fullName={profile.full_name}
        role={profile.role}
        organizationLogo={profile.organization_logo}
      />

      <div className="max-w-5xl mx-auto px-6 py-10 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 blur-xl opacity-40 rounded-full"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-sm border border-slate-800 p-3 rounded-2xl shadow-lg shadow-primary/20">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-inner">
                  <ShieldCheck className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Your Features
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Access your enabled features and services
          </p>
        </div>

        {/* No features */}
        {features.length === 0 && (
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl shadow-xl p-12 text-center">
            <ShieldCheck className="w-16 h-16 mx-auto text-slate-700 mb-4" />
            <p className="text-slate-400 font-medium">
              No features have been enabled for your account.
            </p>
            <p className="text-slate-500 text-sm mt-2">
              Contact your administrator to request access.
            </p>
          </div>
        )}

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              onClick={() => router.push(`/panels/shop/services/${feature.id}`)}
              className="cursor-pointer group relative"
            >
              <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 pb-10 transition-all duration-300 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 hover:border-primary/50">
                <div className="mb-4 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-600 blur-lg opacity-30 rounded-full"></div>
                  <div className="relative w-16 h-16 mx-auto bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-2xl flex items-center justify-center border border-primary/40">
                    <span className="text-3xl">{feature.icon || "🔧"}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 text-center">
                  {feature.name}
                </h3>
                <p className="text-slate-400 mb-3 leading-relaxed text-sm text-center">
                  {feature.description}
                </p>
                <div className="flex justify-center">
                  <button className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary text-xs font-semibold rounded-full border border-primary/40 cursor-pointer transition-all hover:shadow-md hover:shadow-primary/20">
                    Open →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
