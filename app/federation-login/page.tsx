"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

function FederationContent() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (!access_token || !refresh_token) {
      router.push("/login");
      return;
    }

    supabase.auth.setSession({
      access_token,
      refresh_token,
    }).then(() => {
      router.push("/panels/features"); // or admin
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