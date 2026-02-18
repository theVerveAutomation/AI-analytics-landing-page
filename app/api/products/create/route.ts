import { supabase } from "@/lib/supabaseClient";
import { withCors, corsOptions } from "@/lib/cors";

// OPTIONS handler (required for CORS)
export function OPTIONS() {
  return corsOptions();
}

export async function POST(req: Request) {
  try {
    const { name, description, price, imageUrl, categoryId } = await req.json();
    console.log("Received product data:", { name, description, price, imageUrl, categoryId });

    if (!name || !imageUrl || price === undefined) {
      return withCors({ error: "Missing fields" }, 400);
    }

    // Insert product using normal client
    const { error } = await supabase.from("products").insert({
      name,
      description,
      price,
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
