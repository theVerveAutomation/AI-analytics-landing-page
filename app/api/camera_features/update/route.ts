import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  try {
    const { camera_id, feature_ids } = await req.json();
    if (!camera_id || !Array.isArray(feature_ids)) {
      return NextResponse.json({ error: "Missing camera_id or feature_ids" }, { status: 400 });
    }
    // Remove all existing assignments for this camera
    const { error: delError } = await supabase
      .from("camera_features")
      .delete()
      .eq("camera_id", camera_id);
    if (delError) {
      return NextResponse.json({ error: delError.message }, { status: 500 });
    }
    // Insert new assignments
    if (feature_ids.length > 0) {
      const { error: insError } = await supabase
        .from("camera_features")
        .insert(feature_ids.map((feature_id) => ({ camera_id, feature_id })));
      if (insError) {
        return NextResponse.json({ error: insError.message }, { status: 500 });
      }
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
