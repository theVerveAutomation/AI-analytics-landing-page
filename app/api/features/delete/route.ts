import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const body = await req.json();

  const { id } = body;
  if (!id) {
    return NextResponse.json({ error: "Missing feature id" }, { status: 400 });
  }

  const { error } = await supabase
    .from("features")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true }, { status: 200 });
}
