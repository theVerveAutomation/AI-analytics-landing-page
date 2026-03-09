import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { withCors, corsOptions } from "@/lib/cors";

// OPTIONS handler (required for CORS)
export function OPTIONS() {
  return corsOptions();
}

export async function POST(req: Request) {
  try {
    const { name, description, price, imageUrl, categoryId, showPrice, brand } = await req.json();

    if (!name || !imageUrl || price === undefined) {
      return withCors({ error: "Missing fields" }, 400);
    }

    const supabase = await createServerSupabaseClient();

    // Insert product using normal client
    const { error } = await supabase.from("products").insert({
      name,
      description,
      brand,
      price,
      showPrice,
      image_url: imageUrl,
      category_id: categoryId || null,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error inserting product:", error);
      return withCors({ error: error.message }, 500);
    }

    return withCors({ success: true }, 200);
  } catch (err: any) {
    return withCors({ error: err.message }, 500);
  }
}
