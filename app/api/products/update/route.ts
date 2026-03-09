import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const { id, name, description, price, imageUrl, categoryId, showPrice, brand } = await req.json();

    if (!id || !name || price === undefined) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from("products")
      .update({
        name,
        description,
        brand,
        price,
        showPrice,
        image_url: imageUrl,
        category_id: categoryId || null,
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
