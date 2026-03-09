import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateFields } = body;
    if (!id) {
      return NextResponse.json({ error: "Missing camera id" }, { status: 400 });
    }
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("cameras")
      .update(updateFields)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ camera: data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
