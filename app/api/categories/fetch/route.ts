import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function GET() {
  const supabase = await createServerSupabaseClient();

  try {
    const { data, error } = await supabase
    .from("categories")
    .select("id, name, image_url")
    .order("name");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ categories: data });
  } catch (err) {
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
