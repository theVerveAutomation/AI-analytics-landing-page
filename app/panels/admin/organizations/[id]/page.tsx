"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  Camera,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  ArrowLeft,
  Video,
  WifiOff,
  Wifi,
} from "lucide-react";
import toast from "react-hot-toast";

import { CameraConfig, Organization } from "@/types";
import CameraModal from "@/components/CameraModal";
import FeatureAssignModal from "@/components/FeatureAssignModal";

export default function CameraSetupPage() {
  const router = useRouter();
  const params = useParams();
  const organizationId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [cameras, setCameras] = useState<CameraConfig[]>([]);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showfeatureModal, setshowfeatureModal] = useState<boolean>(false);
  const [selectedCamera, setSelectedCamera] = useState<CameraConfig | null>(
    null,
  );

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        toast.error("You must be logged in to access this page");
        return router.replace("/Login");
      }
    };

    getUser();
    fetchCameras();
  }, [organizationId]);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const res = await fetch(
          `/api/organizations/fetch?id=${organizationId}`,
        );
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Failed to fetch organization");
          return;
        }

        setOrganization(data.organization);
      } catch (err) {
        toast.error("Failed to fetch organization");
      }
    };
    fetchOrganization();
  }, [organizationId]);

  async function fetchCameras() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/camera/fetch?organization_id=${organizationId}`,
      );
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to fetch cameras");
        return;
      }

      setCameras(data.cameras || []);
    } catch {
      toast.error("Failed to fetch cameras");
    } finally {
      setLoading(false);
    }
  }

  async function refreshCameras() {
    setRefreshing(true);
    await fetchCameras();
    setRefreshing(false);
    toast.success("Cameras refreshed!");
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this camera?")) return;

    const res = await fetch("/api/camera/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Failed to delete camera");
      return;
    }

    toast.success("Camera deleted successfully!");
    setCameras((prev) => prev.filter((c) => c.id !== id));
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-slate-300 font-medium">
            Loading cameras...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-800 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="p-4 bg-gradient-to-br from-primary to-blue-600 rounded-2xl shadow-lg shadow-primary/20">
                <Camera className="text-white w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-400 to-blue-400 bg-clip-text text-transparent">
                  Camera Setup
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  {organization?.name || "Loading..."} -{" "}
                  {organization?.displayid}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCameraModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/50"
              >
                <Plus className="w-4 h-4" />
                Add Camera
              </button>
              <button
                onClick={refreshCameras}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-primary/50 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg border border-primary/40">
                  <Camera className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-medium">
                    Total Cameras
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {cameras.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-600/10 to-green-600/5 border border-green-600/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-600/20 rounded-lg border border-green-600/40">
                  <Wifi className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-medium">Online</p>
                  <p className="text-2xl font-bold text-white">
                    {cameras.filter((c) => c.status === "normal").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-600/10 to-red-600/5 border border-red-600/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-600/20 rounded-lg border border-red-600/40">
                  <WifiOff className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-medium">Offline</p>
                  <p className="text-2xl font-bold text-white">
                    {cameras.filter((c) => c.status === "offline").length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cameras Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {cameras.length === 0 ? (
            <div className="col-span-full bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-800 p-12 text-center">
              <Video className="w-16 h-16 mx-auto text-slate-700 mb-3" />
              <p className="text-slate-500 font-medium">
                No cameras configured yet
              </p>
              <p className="text-slate-600 text-sm mt-2">
                Click &quot;Add Camera&quot; to set up your first camera
              </p>
            </div>
          ) : (
            cameras.map((camera) => (
              <div
                key={camera.id}
                className="bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-800 p-6 hover:border-primary/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/20 rounded-xl">
                      <Camera className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {camera.name}
                      </h3>
                      {camera.url && (
                        <p className="text-sm text-slate-400">
                          {camera.url.length > 30
                            ? camera.url.slice(0, 30) + "..."
                            : camera.url}
                        </p>
                      )}
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      camera.status === "normal"
                        ? "bg-green-600/20 text-green-400 border border-green-600/30"
                        : "bg-red-600/20 text-red-400 border border-red-600/30"
                    }`}
                  >
                    {camera.status}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="text-sm">
                    <span className="text-slate-500">URL:</span>
                    <p className="text-slate-300 font-mono text-xs truncate mt-1">
                      {camera.url}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowCameraModal(true);
                      setSelectedCamera(camera);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-xl font-semibold transition-all"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCamera(camera);
                      setshowfeatureModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-xl font-semibold transition-all"
                  >
                    <Camera className="w-4 h-4" />
                    Features
                  </button>
                  <button
                    onClick={() => camera.id && handleDelete(camera.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl font-semibold transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Feature Assignment Modal */}
      {showfeatureModal && selectedCamera && (
        <FeatureAssignModal
          camera={selectedCamera}
          closeFeatureModal={() => {
            setshowfeatureModal(false);
            setSelectedCamera(null);
          }}
        />
      )}

      {/* Modal */}
      {showCameraModal && (
        <CameraModal
          organizationId={organization?.id ?? ""}
          camera={selectedCamera}
          setShowModal={setShowCameraModal}
        />
      )}
    </div>
  );
}
