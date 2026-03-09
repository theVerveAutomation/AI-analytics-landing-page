import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing snapshot id" }, { status: 400 });
    }
    const supabase = await createServerSupabaseClient();
    // Fetch the snapshot row to get the url
    const { data: snapData, error: fetchError } = await supabase
      .from("camera_snaps")
      .select("url")
      .eq("id", id)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // Extract storage path from url
    let storagePath = undefined;
    if (snapData?.url) {
      // Example: https://<project>.supabase.co/storage/v1/object/public/snapshots/myfolder/file.jpg
      const match = snapData.url.match(/storage\/v1\/object\/public\/snapshots\/(.+)$/);
      if (match) {
        storagePath = match[1];
      }
    }

    // Delete from table
    const { error } = await supabase
      .from("camera_snaps")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Remove from Supabase storage bucket if storagePath exists
    if (storagePath) {
      const { error: storageError } = await supabase.storage
        .from("snapshots")
        .remove([storagePath]);
      if (storageError) {
        // Log but don't fail the request
        console.error("Storage deletion error:", storageError.message);
      }
    } else {
      console.warn("No storage path extracted for snapshot id:", id);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unhandled error in snapshot delete:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
