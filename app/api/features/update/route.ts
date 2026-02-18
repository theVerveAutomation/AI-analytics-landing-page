import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const body = await req.json();

  const { id, ...fields } = body;
  if (!id) {
    return NextResponse.json({ error: "Missing feature id" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("features")
    .update(fields)
    .eq("id", id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ feature: data[0] }, { status: 200 });
}
