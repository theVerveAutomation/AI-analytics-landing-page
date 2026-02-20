import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function GET(req: Request) {
    const supabase = await createServerSupabaseClient();
    try {
    
        const { data, error } = await supabase
        .from("features")
        .select("*")
        .eq("enabled", true)
        .order("created_at", { ascending: true });;
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ features: data });
    } catch (err) {
        return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
    }
}