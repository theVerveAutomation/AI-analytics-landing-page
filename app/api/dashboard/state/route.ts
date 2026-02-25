import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseAlertClient } from "@/lib/supabaseAlertServer";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { CameraConfig, CameraFeatures } from "@/types";

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabaseAlertClient();
  const supabaseMain = await createServerSupabaseClient();

  const { searchParams } = new URL(req.url);
  const organization_id = searchParams.get("organization_id");

  if (!organization_id) {
    return NextResponse.json({ error: "Missing organization_id" }, { status: 400 });
  }

  const {data: cameras, error: cameraError} = await supabaseMain
    .from("cameras")
    .select("id, name, camera_features(*, features(*)), status")
    .eq("organization_id", organization_id);

  if (cameraError) {
    console.error("Error fetching cameras:", cameraError);
    return NextResponse.json({ error: cameraError?.message }, { status: 500 });
  }
  const camerasOnline = cameras?.filter((c) => c.status === "normal").length || 0;
  const totalCameras = cameras?.length || 0;
  const features = cameras?.reduce((acc: string[], camera: CameraConfig) => {
    camera.camera_features?.forEach((cf: CameraFeatures) => {
      if (cf.features) {
        acc.push(cf.features.name);
      }
    });
    return acc;
  }, []) || [];

  // Alerts today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // return all alerts
  const { data: alerts, error: alertError } = await supabase
    .from("alerts")
    .select("id, alert_type, camera, message, created_at");

  // You can replace this with a real query if you have a detections table
  const totalDetections = 1284;
  // System health (dummy for now)
  const systemHealth = 98;

  if ( alertError) {
    console.error("Error fetching dashboard state:", alertError);
    return NextResponse.json({ error: alertError?.message }, { status: 500 });
  }

  const alertsToday = alerts?.length || 0;
  
  const hourlyDetections = [
  { hour: "3AM", "Object Detection": 0, "Motion Detection": 0, "Staff Detection": 0, "Pacing Detection": 10, "Erratic Movements Detection": 5, "Facial Expressions Detection": 3, "Thermal Indicators Detection": 2, "Fall Detection": 1, "Escape Attempts Detection": 2, "Arm Flailing Detection": 2, "Loitering Detection": 1 },
  { hour: "6AM", "Object Detection": 45, "Motion Detection": 30, "Staff Detection": 28, "Pacing Detection": 15, "Erratic Movements Detection": 10, "Facial Expressions Detection": 8, "Thermal Indicators Detection": 5, "Fall Detection": 3, "Escape Attempts Detection": 4, "Arm Flailing Detection": 6, "Loitering Detection": 3 },
  { hour: "9AM", "Object Detection": 78, "Motion Detection": 65, "Staff Detection": 42, "Pacing Detection": 20, "Erratic Movements Detection": 15, "Facial Expressions Detection": 12, "Thermal Indicators Detection": 8, "Fall Detection": 5, "Escape Attempts Detection": 6, "Arm Flailing Detection": 10, "Loitering Detection": 5 },
  { hour: "12PM", "Object Detection": 92, "Motion Detection": 71, "Staff Detection": 55, "Pacing Detection": 25, "Erratic Movements Detection": 20, "Facial Expressions Detection": 18, "Thermal Indicators Detection": 10, "Fall Detection": 7, "Escape Attempts Detection": 8, "Arm Flailing Detection": 12, "Loitering Detection": 8 },
  { hour: "3PM", "Object Detection": 68, "Motion Detection": 52, "Staff Detection": 38, "Pacing Detection": 18, "Erratic Movements Detection": 12, "Facial Expressions Detection": 10, "Thermal Indicators Detection": 6, "Fall Detection": 4, "Escape Attempts Detection": 5, "Arm Flailing Detection": 8, "Loitering Detection": 4 },
  { hour: "9PM", "Object Detection": 80, "Motion Detection": 60, "Staff Detection": 45, "Pacing Detection": 20, "Erratic Movements Detection": 15, "Facial Expressions Detection": 10, "Thermal Indicators Detection": 8, "Fall Detection": 5, "Escape Attempts Detection": 6, "Arm Flailing Detection": 10, "Loitering Detection": 6 },
  { hour: "12AM", "Object Detection": 30, "Motion Detection": 20, "Staff Detection": 15, "Pacing Detection": 10, "Erratic Movements Detection": 5, "Facial Expressions Detection": 3, "Thermal Indicators Detection": 2, "Fall Detection": 1, "Escape Attempts Detection": 2, "Arm Flailing Detection": 4, "Loitering Detection": 2 },
  ]
  const cameraStatus = 
    cameras?.map((c) => ({
      id: c.id,
      name: c.name,
      status: c.status,
      detections: 0,
    })) || [];

  // Dummy values for new detection types
  const objectDetected = 500;
  const staffDetected = 300;
  const motionDetected = 484;
  const pacingDetected = 120;
  const erraticMovementsDetected = 85;
  const armFlailingDetected = 60;
  const facialExpressionsDetected = 45;
  const thermalIndicatorsDetected = 30;
  const fallDetectionDetected = 15;
  const escapeAttemptsDetected = 10;

  const loiteringDetected = 25;

  const recentAlerts = alerts?.slice(0, 5).map((alert) => ({
      id: alert.id,
      timestamp: new Date(alert.created_at).toLocaleString(),
      type: alert.alert_type,
      camera: alert.camera,
      message: alert.message,
    })) || []

  return NextResponse.json({
    features,
    systemHealth,
    cameras: {
      camerasOnline,
      totalCameras,
      cameraStatus,
    },
    alerts: {
      alertsToday,
      recentAlerts,
    },
    detections: {
      totalDetections,
      objectDetected,
      staffDetected,
      motionDetected,
      pacingDetected,
      erraticMovementsDetected,
      armFlailingDetected,
      facialExpressionsDetected,
      thermalIndicatorsDetected,
      fallDetectionDetected,
      escapeAttemptsDetected,
      loiteringDetected,
    },
    hourlyDetections,
});
}
