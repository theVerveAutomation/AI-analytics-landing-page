import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { ids } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Missing or invalid snapshot ids" }, { status: 400 });
    }

    // Fetch urls for all snapshots
    const { data: snapRows, error: fetchError } = await supabaseAdmin
      .from("camera_snaps")
      .select("id, url")
      .in("id", ids);

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // Extract storage paths
    const storagePaths = (snapRows || []).map((row) => {
      if (row.url) {
        const match = row.url.match(/storage\/v1\/object\/public\/snapshots\/(.+)$/);
        if (match) {
          return match[1];
        }
      }
      return null;
    }).filter(Boolean);

    // Delete from table
    const { error } = await supabaseAdmin
      .from("camera_snaps")
      .delete()
      .in("id", ids);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Remove from Supabase storage bucket
    if (storagePaths.length > 0) {
      const { error: storageError } = await supabaseAdmin.storage
        .from("snapshots")
        .remove(storagePaths);
      if (storageError) {
        // Log but don't fail the request
        console.error("Bulk storage deletion error:", storageError.message);
      }
    } else {
      console.warn("No storage paths extracted for bulk delete.");
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unhandled error in bulk snapshot delete:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
