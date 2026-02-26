import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { createServerSupabaseAlertClient } from "@/lib/supabaseAlertServer";

function getRangeDays(range: string): number {
  const daysMap: Record<string, number> = {
    "7d": 7,
    "30d": 30,
    "90d": 90,
    "1y": 365,
  };
  return daysMap[range] || 7;
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export async function GET(req: NextRequest) {
  try {
    const supabaseMain = await createServerSupabaseClient();
    const supabaseAlert = await createServerSupabaseAlertClient();

    const { searchParams } = new URL(req.url);
    const organization_id = searchParams.get("organization_id");
    const range = searchParams.get("range") || "7d";

    if (!organization_id) {
      return NextResponse.json({ error: "Missing organization_id" }, { status: 400 });
    }

    const days = getRangeDays(range);
    const now = new Date();
    const currentStart = new Date(now);
    currentStart.setDate(currentStart.getDate() - days);
    const previousStart = new Date(currentStart);
    previousStart.setDate(previousStart.getDate() - days);

    // fetch Cameras
    const { data: cameras, error: cameraError } = await supabaseMain
      .from("cameras")
      .select("id, name, status")
      .eq("organization_id", organization_id);

    if (cameraError) {
      console.error("Error fetching cameras:", cameraError);
      return NextResponse.json({ error: cameraError.message }, { status: 500 });
    }

    const totalCameras = cameras?.length || 0;
    const activeCameras = cameras?.filter((c) => c.status === "normal").length || 0;

    // ── All alerts (current period) ──
    const { data: currentAlerts, error: currentAlertError } = await supabaseAlert
      .from("alerts")
      .select("id, alert_type, camera, created_at")
      .gte("created_at", currentStart.toISOString())
      .lte("created_at", now.toISOString())
      .order("created_at", { ascending: true });

    if (currentAlertError) {
      console.error("Error fetching current alerts:", currentAlertError);
      return NextResponse.json({ error: currentAlertError.message }, { status: 500 });
    }

    // ── Previous period alerts (for % change) ──
    const { data: previousAlerts, error: previousAlertError } = await supabaseAlert
      .from("alerts")
      .select("id")
      .gte("created_at", previousStart.toISOString())
      .lt("created_at", currentStart.toISOString());

    if (previousAlertError) {
      console.error("Error fetching previous alerts:", previousAlertError);
      return NextResponse.json({ error: previousAlertError.message }, { status: 500 });
    }

    const currentAlertCount = currentAlerts?.length || 0;
    const previousAlertCount = previousAlerts?.length || 0;

    const pctChange = (curr: number, prev: number) => {
      if (prev === 0) return "0.0";
      return (((curr - prev) / prev) * 100).toFixed(1);
    };

    const alertChange = pctChange(currentAlertCount, previousAlertCount);
    const detectionChange = pctChange(currentAlertCount, previousAlertCount);

    // Avg response time (placeholder until a dedicated detections table exists)
    const avgResponseTime = 2.3;
    const prevAvgResponseTime = 2.7;
    const responseTimeChange = pctChange(avgResponseTime, prevAvgResponseTime);

    // ── 1. KPIs ──
    const kpis = {
      totalDetections: {
        value: currentAlertCount,
        change: `${Number(detectionChange) >= 0 ? "+" : ""}${detectionChange}%`,
        trend: Number(detectionChange) >= 0 ? "up" : "down",
      },
      activeCameras: {
        value: `${activeCameras}/${totalCameras}`,
        change: "",
        trend: "stable",
      },
      totalAlerts: {
        value: currentAlertCount,
        change: `${Number(alertChange) >= 0 ? "+" : ""}${alertChange}%`,
        trend: Number(alertChange) >= 0 ? "up" : "down",
      },
      avgResponseTime: {
        value: `${avgResponseTime}s`,
        change: `${Number(responseTimeChange) >= 0 ? "+" : ""}${responseTimeChange}%`,
        trend: Number(responseTimeChange) >= 0 ? "up" : "down",
      },
    };

    // ── 2. Daily Trends (Line Chart) ──
    const dailyMap: Record<string, Record<string, number>> = {};
    const allTypes = new Set<string>();

    for (const alert of currentAlerts || []) {
      const date = new Date(alert.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const type = alert.alert_type || "Unknown";
      allTypes.add(type);
      if (!dailyMap[date]) dailyMap[date] = {};
      dailyMap[date][type] = (dailyMap[date][type] || 0) + 1;
    }

    const trendTypes = Array.from(allTypes);
    const dailyTrends = Object.entries(dailyMap).map(([date, types]) => {
      const entry: Record<string, string | number> = { date };
      for (const t of trendTypes) entry[t] = types[t] || 0;
      return entry;
    });

    // ── 3. Hourly Activity (Area Chart) ──
    const hourlyBuckets: Record<string, number> = {
      "00:00": 0, "03:00": 0, "06:00": 0, "09:00": 0,
      "12:00": 0, "15:00": 0, "18:00": 0, "21:00": 0,
    };

    for (const alert of currentAlerts || []) {
      const hour = new Date(alert.created_at).getHours();
      const bucket = Math.floor(hour / 3) * 3;
      const key = `${bucket.toString().padStart(2, "0")}:00`;
      if (key in hourlyBuckets) hourlyBuckets[key] += 1;
    }

    const hourlyActivity = Object.entries(hourlyBuckets).map(([hour, activity]) => ({
      hour,
      activity,
    }));

    // ── 4. Alert Distribution (Pie Chart) ──
    const distMap: Record<string, number> = {};
    for (const alert of currentAlerts || []) {
      const type = alert.alert_type || "Unknown";
      distMap[type] = (distMap[type] || 0) + 1;
    }

    const severityColors: Record<string, string> = {
      Critical: "#dc2626", critical: "#dc2626",
      High: "#f59e0b", high: "#f59e0b",
      Medium: "#3b82f6", medium: "#3b82f6",
      Low: "#10b981", low: "#10b981",
    };

    const alertDistribution = Object.entries(distMap)
      .map(([name, value]) => ({
        name,
        value,
        color: severityColors[name] || "#6b7280",
      }))
      .sort((a, b) => b.value - a.value);

    // ── 5. Year-over-Year Comparison (Bar Chart) ──
    const currentYear = now.getFullYear();
    const previousYear = currentYear - 1;
    const previousYearStart = new Date(previousYear, 0, 1);
    const previousYearEnd = new Date(previousYear, 11, 31, 23, 59, 59);

    const { data: prevYearAlerts, error: prevYearError } = await supabaseAlert
      .from("alerts")
      .select("created_at")
      .gte("created_at", previousYearStart.toISOString())
      .lte("created_at", previousYearEnd.toISOString());

    if (prevYearError) {
      console.error("Error fetching previous year alerts:", prevYearError);
      return NextResponse.json({ error: prevYearError.message }, { status: 500 });
    }

    // All current-year alerts (full year, not just the range window)
    const currentYearStart = new Date(currentYear, 0, 1);
    const { data: currYearAlerts, error: currYearError } = await supabaseAlert
      .from("alerts")
      .select("created_at")
      .gte("created_at", currentYearStart.toISOString())
      .lte("created_at", now.toISOString());

    if (currYearError) {
      console.error("Error fetching current year alerts:", currYearError);
      return NextResponse.json({ error: currYearError.message }, { status: 500 });
    }

    const currentWeekly: Record<number, number> = {};
    const previousWeekly: Record<number, number> = {};

    for (const a of currYearAlerts || []) {
      const w = getWeekNumber(new Date(a.created_at));
      currentWeekly[w] = (currentWeekly[w] || 0) + 1;
    }
    for (const a of prevYearAlerts || []) {
      const w = getWeekNumber(new Date(a.created_at));
      previousWeekly[w] = (previousWeekly[w] || 0) + 1;
    }

    const allWeeks = new Set<number>([
      ...Object.keys(currentWeekly).map(Number),
      ...Object.keys(previousWeekly).map(Number),
    ]);

    const yoyComparison = Array.from(allWeeks)
      .sort((a, b) => a - b)
      .map((week) => ({
        week: `Week ${week}`,
        thisYear: currentWeekly[week] || 0,
        lastYear: previousWeekly[week] || 0,
      }));

    // ── 6. Camera Performance (Table) ──
    const cameraAlertCounts: Record<string, { detections: number; alerts: number }> = {};

    for (const alert of currentAlerts || []) {
      const cameraName = alert.camera || "Unknown";
      if (!cameraAlertCounts[cameraName]) {
        cameraAlertCounts[cameraName] = { detections: 0, alerts: 0 };
      }
      cameraAlertCounts[cameraName].detections += 1;
      cameraAlertCounts[cameraName].alerts += 1;
    }

    const cameraPerformance = (cameras || []).map((camera) => {
      const counts = cameraAlertCounts[camera.name] || { detections: 0, alerts: 0 };
      return {
        id: camera.id,
        name: camera.name,
        status: camera.status,
        detections: counts.detections,
        alerts: counts.alerts,
      };
    });

    // ── Response ──
    return NextResponse.json({
      kpis,
      dailyTrends,
      trendTypes,
      hourlyActivity,
      alertDistribution,
      yoyComparison,
      yoyYears: { currentYear, previousYear },
      cameraPerformance,
    });
  } catch (err) {
    console.error("Error in GET /api/analytics:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
