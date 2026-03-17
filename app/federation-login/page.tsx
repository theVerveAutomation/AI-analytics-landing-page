"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

function FederationContent() {
  const params = useSearchParams();

  useEffect(() => {
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
    const returnUrl = params.get("returnUrl");

    if (!access_token || !refresh_token) {
      window.location.href = "/login";
      return;
    }

    supabase.auth
      .setSession({
        access_token,
        refresh_token,
      })
      .then(() => {
        // ✅ Redirect BACK to THK root dashboard
        window.location.href =
          returnUrl || "https://thk-org.onrender.com/?vapLogged=true";
      });
  }, []);

  return <div style={{ padding: 20 }}>Logging into Video Analytics...</div>;
}

export default function FederationLoginPage() {
  return (
    <Suspense fallback={<div style={{ padding: 20 }}>Preparing...</div>}>
      <FederationContent />
    </Suspense>
  );
}