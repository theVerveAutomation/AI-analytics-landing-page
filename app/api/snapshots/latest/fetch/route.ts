import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const cameras = searchParams.get("cameras");

    if (!cameras) {
        return NextResponse.json({ error: "Missing cameras parameter" }, { status: 400 });
    }

    const cameraIds = JSON.parse(cameras);
    const { data, error } = await supabase
        .from("camera_snaps")
        .select("camera_id, url, created_at")
        .in("camera_id", cameraIds)
        .eq("capture_method", "time")
        .order("created_at", { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const latestSnapshots: Record<string, string> = {};
    for (const snap of data || []) {
    if (!latestSnapshots[snap.camera_id]) {
        latestSnapshots[snap.camera_id] = snap.url;
    }
    }

    return NextResponse.json({ snapshots: latestSnapshots });
}
