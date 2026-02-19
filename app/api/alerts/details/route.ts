import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseAlertClient } from "@/lib/supabaseAlertServer";


export async function GET(req: NextRequest) {
    const supabase = await createServerSupabaseAlertClient();
  const { searchParams } = new URL(req.url);
  const alertId = searchParams.get("id");

  if (!alertId) {
    return NextResponse.json({ error: "Missing alert id" }, { status: 400 });
  }
  const { data: alert, error } = await supabase
    .from("alerts")
    .select("*")
    .eq("id", alertId)
    .single();
  
  if (!alert) {
    return NextResponse.json({ error: "Alert not found" }, { status: 404 });
  }

  return NextResponse.json({ alert });
}
