"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

function IframeEntryContent() {
  const params = useSearchParams();

  useEffect(() => {
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (!access_token || !refresh_token) {
      return;
    }

    supabase.auth
      .setSession({ access_token, refresh_token })
      .then(({ error }: { error: { message: string } | null }) => {
        if (error) {
          console.error("iframe-entry setSession failed:", error.message);
          return;
        }
        window.location.replace("/panels/features");
      });
  }, []);

  return (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      height: "100vh",
      fontFamily: "sans-serif",
      color: "#666"
    }}>
      Loading dashboard...
    </div>
  );
}

export default function IframeEntryPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        height: "100vh" 
      }}>
        Preparing...
      </div>
    }>
      <IframeEntryContent />
    </Suspense>
  );
}