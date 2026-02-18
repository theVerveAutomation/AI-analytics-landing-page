"use client";
import { CameraConfig } from "@/types";
import { useState } from "react";
import { toast } from "./ui/sonner";
interface CameraModalProps {
  organizationId: string | number;
  setShowModal: (show: boolean) => void;
  camera: CameraConfig | null;
}

export default function CameraModal({
  organizationId,
  setShowModal,
  camera,
}: CameraModalProps) {
  const [formData, setFormData] = useState<CameraConfig>({
    name: camera?.name || "",
    url: camera?.url || "",
    status: camera?.status || "normal",
    detection: camera?.detection || false,
    alert_sound: camera?.alert_sound || false,
  });

  async function handleCreateOrUpdate() {
    const payload = {
      ...formData,
      organization_id: organizationId,
    };

    const endpoint = camera ? "/api/camera/update" : "/api/camera/create";

    if (camera) {
      payload.id = camera.id;
    }

    const res = await fetch(endpoint, {
      method: camera ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Failed to save camera");
      return;
    }

    toast.success(
      camera ? "Camera updated successfully!" : "Camera created successfully!",
    );
    setShowModal(false);
    setFormData({
      name: "",
      url: "",
      status: "normal",
      detection: false,
      alert_sound: false,
    });
    // await fetchCameras();
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-2xl font-bold text-white">
            {camera ? "Edit Camera" : "Add New Camera"}
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Camera Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Front Entrance, Loading Dock"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              RTSP URL *
            </label>
            <input
              type="text"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              placeholder="rtsp://username:password@ip:port/path"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as "normal" | "warning" | "offline",
                })
              }
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            >
              <option value="normal">Normal</option>
              <option value="warning">Warning</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 flex gap-3">
          <button
            onClick={() => {
              setShowModal(false);
            }}
            className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateOrUpdate}
            disabled={!formData.name || !formData.url}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {camera ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
