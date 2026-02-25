import { createServerSupabaseAlertClient } from "@/lib/supabaseAlertServer";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const supabase = await createServerSupabaseAlertClient();
        const { searchParams } = new URL(req.url);
        const organization_id = searchParams.get("organization_id");
        console.log("Received organization_id:", organization_id);
        
        if (!organization_id) {
            console.error("Missing organization_id in request");
            return NextResponse.json({ error: "Missing organization_id" }, { status: 400 });
        }

        const { data: alerts, error: alertError } = await supabase
            .from("alerts")
            .select("id, alert_type, camera, message, created_at")
            .order("created_at", { ascending: false })
            .limit(5);

        if ( alertError) {
            console.error("Error fetching dashboard state:", alertError);
            return NextResponse.json({ error: alertError?.message }, { status: 500 });
        }
        return NextResponse.json({ recentAlerts: alerts }, { status: 200 });
  
    } catch (err) {
        console.error("Error in GET /api/alerts/recent:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}