import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
export async function GET(req: Request) {
  const supabase = await createServerSupabaseClient();
  try {
    const query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ products: data });
  } catch (err) {
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
  
}
