import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const {id} = params;
  if (!id) {
    console.error("Product ID is missing in the request");
    return NextResponse.json({ error: "Missing product id" }, { status: 400 });
  }

  console.log("Fetching product with ID:", id);

  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  console.log("Fetched product data:", data);

  return NextResponse.json({ product: data });
}
