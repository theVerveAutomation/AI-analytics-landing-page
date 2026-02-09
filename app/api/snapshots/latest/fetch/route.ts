import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const cameras = searchParams.get("cameras");
    console.log("Received request for latest snapshots with cameras:", cameras);

    if (!cameras) {
        return NextResponse.json({ error: "Missing cameras parameter" }, { status: 400 });
    }

    const cameraIds = JSON.parse(cameras);

    const { data, error } = await supabase
        .from("camera_snaps")
        .select("*")
        .in("camera_id", cameraIds)
        .eq("capture_method", "time")
        .order("created_at", { ascending: false })
        .limit(3);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ snapshots: data });
}
