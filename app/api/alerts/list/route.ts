import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseAlertClient } from "@/lib/supabaseAlertServer";

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabaseAlertClient();
  const { data: alerts, error } = await supabase
    .from("alerts")
    .select("*")

  if (error) {
    console.error("Error fetching alerts:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ alerts });
}
