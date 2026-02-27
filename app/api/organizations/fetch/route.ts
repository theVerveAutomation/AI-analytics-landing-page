import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { CORS_HEADERS } from "@/lib/cors";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    // If ID is provided, fetch single organization
    if (id) {
      const { data: organization, error } = await supabaseAdmin
        .from("organizations")
        .select(`
          *,
          profiles (
            id
          )
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error("Fetch organization error:", error);
        return NextResponse.json(
          { error: error.message || "Failed to fetch organization" },
          { status: 500 }
        );
      }

      const organizationWithCount = {
        id: organization.id,
        name: organization.name,
        displayid: organization.displayid,
        email: organization.email,
        created_at: organization.created_at,
        user_count: organization.profiles?.length || 0,
        alerts: organization.alerts || [],
      };

      return NextResponse.json(
        { organization: organizationWithCount },
        { status: 200 }
      );
    }

    // Fetch all organizations with user count from profiles
    const { data: organizations, error } = await supabaseAdmin
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

    return NextResponse.json(
      { organizations: organizationsWithCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}
