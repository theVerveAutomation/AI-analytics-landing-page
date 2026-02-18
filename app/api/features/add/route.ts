import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const body = await req.json();

  const { name, description, icon, enabled } = body;
  if (!name || !description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("features")
    .insert([{ name, description, icon: icon || "⚙️", enabled }])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ feature: data[0] }, { status: 201 });
}
