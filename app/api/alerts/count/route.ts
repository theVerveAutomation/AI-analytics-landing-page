import { createServerSupabaseAlertClient } from "@/lib/supabaseAlertServer";
import { NextRequest, NextResponse } from "next/server";

// Utility function to count alerts by type
async function countAlertsByType(supabase: any, organization_id: string) {
    const { data, error } = await supabase
        .from("alerts")
        .select("alert_type, count:id", { groupBy: "alert_type" })
        .eq("organization_id", organization_id);
    if (error) {
        throw new Error(error.message);
    }
    return data || [];
}

export async function GET(req: NextRequest) {
    try {
        const supabase = await createServerSupabaseAlertClient();
        const { searchParams } = new URL(req.url);
        const organization_id = searchParams.get("organization_id");

        if (!organization_id) {
            return NextResponse.json({ error: "Missing organization_id" }, { status: 400 });
        }

        // Use the utility function
        const counts = await countAlertsByType(supabase, organization_id);
        return NextResponse.json({ counts });
    } catch (err) {
        console.error("Error in GET /api/alerts/count:", err);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}