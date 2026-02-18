import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  try {
    const { searchParams } = new URL(req.url);
    const camera_id = searchParams.get("camera_id");
    if (!camera_id) {
      return NextResponse.json({ error: "Missing camera_id" }, { status: 400 });
    }
    const { data, error } = await supabase
      .from("camera_features")
      .select("feature_id")
      .eq("camera_id", camera_id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ feature_ids: data.map((row) => row.feature_id) }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
