import { createServerSupabaseAlertClient } from "@/lib/supabaseAlertServer";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const supabaseAlert = await createServerSupabaseAlertClient();

        const { searchParams } = new URL(req.url);
        const organization_id = searchParams.get("organization_id");
    
        if (!organization_id) {
          return NextResponse.json({ error: "Missing organization_id" }, { status: 400 });
        }
          
        const { data, error } = await supabaseAlert
            .from("alerts")
            .select("id, alert_type, camera, message, created_at");
          
                    
        if (error) {
          console.error("Error fetching alerts:", error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ alerts: data }, { status: 200 });
      } catch (err) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
      }
    
}