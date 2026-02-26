import { createServerSupabaseAlertClient } from "@/lib/supabaseAlertServer";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const supabase = await createServerSupabaseAlertClient();
        const { searchParams } = new URL(req.url);
        const organization_id = searchParams.get("organization_id");

        if (!organization_id) {
            return NextResponse.json({ error: "Missing organization_id" }, { status: 400 });
        }

        // Use the utility function
        const { data: alerts, error } = await supabase
            .from("alerts")
            .select("*")
            // .eq("organization_id", organization_id);
        if (error) {
            throw new Error(error.message);
        }  
        const alertCounts = alerts.reduce((acc: Record<string, number>, alert) => {
            const type = alert.alert_type || "Unknown";
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});
        const totalAlerts = alerts.length;
        alertCounts["Total"] = totalAlerts;
        return NextResponse.json({ counts: alertCounts }, { status: 200 });
    } catch (err) {
        console.error("Error in GET /api/alerts/count:", err);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}