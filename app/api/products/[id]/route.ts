import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const {id} = params;
  if (!id) {
    console.error("Product ID is missing in the request");
    return NextResponse.json({ error: "Missing product id" }, { status: 400 });
  }
  const supabase = await createServerSupabaseClient(); 

  console.log("Fetching product with ID:", id);

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ product: data }, { status: 200 });
}
