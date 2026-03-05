import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";


export async function GET() {

  try {
    const supabase = await createServerSupabaseClient();
    // Fetch all organizations with user count from profiles
    const { data: organizations, error } = await supabase
      .from("organizations")
      .select(`
        *,
        profiles (
          id
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch organizations error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to fetch organizations" },
        { status: 500 }
      );
    }
    // Transform data to include user count
    const organizationsWithCount = organizations.map((org) => ({
        id: org.id,
        name: org.name,
        displayid: org.displayid,
        email: org.email,
        created_at: org.created_at,
        user_count: org.profiles?.length || 0,
        alerts: org.alerts || [],
    }));
    return NextResponse.json({ organizations: organizationsWithCount }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error fetching organizations:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching organizations" },
      { status: 500 }
    );
  }
}