import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { NextRequest ,NextResponse} from "next/server";

export async function GET(req: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const { searchParams } = new URL(req.url);
        const organization_id = searchParams.get("organization_id");
        
        if (!organization_id) {
            console.error("Missing organization_id in request");
            return NextResponse.json({ error: "Missing organization_id" }, { status: 400 });
        }

        const { data: cameras, error: camerasError } = await supabase
            .from("cameras")
            .select("id")
            .eq("organization_id", organization_id);

        if (camerasError) {
            console.error("Error fetching cameras:", camerasError);
            return NextResponse.json({ error: "Failed to fetch cameras" }, { status: 500 });
        }


        const { data: features, error } = await supabase
            .from("camera_features")
            .select("*, features(*)")
            .in("camera_id", cameras.map(c => c.id));
        if (error) {
            console.error("Error fetching assigned features:", error);
            return NextResponse.json({ error: "Failed to fetch assigned features" }, { status: 500 });
        }
        return NextResponse.json({ features }, { status: 200 });
    } catch (err) {
        console.error("Error in GET /api/features/assigned:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}