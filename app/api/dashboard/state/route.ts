import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseAlertClient } from "@/lib/supabaseAlertServer";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabaseAlertClient();
  const supabaseMain = await createServerSupabaseClient();

  const {data: cameras, error: cameraError} = await supabaseMain
    .from("cameras")
    .select("id, name, status");

  if (cameraError) {
    console.error("Error fetching cameras:", cameraError);
    return NextResponse.json({ error: cameraError?.message }, { status: 500 });
  }
  const camerasOnline = cameras?.filter((c) => c.status === "normal").length || 0;
  const totalCameras = cameras?.length || 0;


  // Alerts today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { data: alerts, error: alertError } = await supabase
    .from("alerts")
    .select("id, created_at");

  // You can replace this with a real query if you have a detections table
  const totalDetections = 1284;

  // System health (dummy for now)
  const systemHealth = 98;

  if ( alertError) {
    console.error("Error fetching dashboard state:", alertError);
    return NextResponse.json({ error: alertError?.message }, { status: 500 });
  }

  const alertsToday = alerts?.length || 0;
  // Object detection breakdown (dummy data for now)
  const objectDetected = 500;
  const staffDetected = 300;
  const motionDetected = 484;
  const hourlyDetections =  [
      { hour: "3AM", object: 0, motion: 0, Staff: 0 },
      { hour: "6AM", object: 45, motion: 30, Staff: 28 },
      { hour: "9AM", object: 78, motion: 65, Staff: 42 },
      { hour: "12PM", object: 92, motion: 71, Staff: 55 },
      { hour: "3PM", object: 68, motion: 52, Staff: 38 },
    ]
  const cameraStatus = 
    cameras?.map((c) => ({
      id: c.id,
      name: c.name,
      status: c.status,
      detections: 0,
    })) || []
  ;


  return NextResponse.json({
    camerasOnline,
    totalCameras,
    alertsToday,
    totalDetections,
    systemHealth,
    objectDetected,
    staffDetected,
    motionDetected,
    hourlyDetections,
    cameraStatus
   }

  );
}
