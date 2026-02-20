import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    const supabase = await createServerSupabaseClient();
    try {
        const {searchParams} = new URL(req.url);
        const category_id = searchParams.get("category_id");
        if (!category_id) {
            return NextResponse.json({error: "Missing category_id"}, {status: 400});
        }
        const { error } = await supabase.from("categories").delete().eq("id", category_id);
        if (error) {
            return NextResponse.json({error: error.message}, {status: 500});
        }
        return NextResponse.json({message: "Category deleted"}, {status: 200});
    } catch (err) {
        return NextResponse.json({error: "An unexpected error occurred"}, {status: 500});
    }
}