import { CameraConfig, Feature } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "./ui/sonner";

interface FeatureAssignModalProps {
  camera: CameraConfig | null;
  closeFeatureModal: () => void;
}

export default function FeatureAssignModal({
  camera,
  closeFeatureModal,
}: FeatureAssignModalProps) {
  const [featureLoading, setFeatureLoading] = useState(false);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [assignedFeatureIds, setAssignedFeatureIds] = useState<string[]>([]);

  // Fetch all features
  useEffect(() => {
    const fetchFeatures = async () => {
      const res = await fetch("/api/features/list");
      if (res.ok) {
        const data = await res.json();
        setFeatures(data.features);
      }
    };
    fetchFeatures();
  }, []);

  //   Fetch assigned features for this camera
  useEffect(() => {
    if (!camera) return;
    const fetchAssigned = async () => {
      const res = await fetch(
        `/api/camera_features/fetch?camera_id=${camera.id}`,
      );
      if (res.ok) {
        const data = await res.json();
        setAssignedFeatureIds(data.feature_ids || []);
      }
    };
    fetchAssigned();
  }, [camera]);

  async function handleFeatureSave(selectedIds: string[]) {
    setFeatureLoading(true);
    const res = await fetch("/api/camera_features/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        camera_id: camera?.id,
        feature_ids: selectedIds,
      }),
    });
    if (res.ok) {
      setAssignedFeatureIds((prev) => [...prev, ...selectedIds]);
      toast.success("Features updated!");
      closeFeatureModal();
    } else {
      toast.error("Failed to update features");
    }
    setFeatureLoading(false);
  }

  if (!camera) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Assign Features</h2>
          <button
            onClick={closeFeatureModal}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form
          className="p-6 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const selected = formData.getAll("features") as string[];
            await handleFeatureSave(selected);
          }}
        >
          {features.map((f: Feature) => (
            <label
              key={f.id}
              className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2"
            >
              <input
                type="checkbox"
                name="features"
                value={f.id}
                checked={assignedFeatureIds.includes(f.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setAssignedFeatureIds((prev) => [...prev, f.id]);
                  } else {
                    setAssignedFeatureIds((prev) =>
                      prev.filter((id) => id !== f.id),
                    );
                  }
                }}
                className="accent-primary"
              />

              <span className="text-white">{f.name}</span>
              <span className="text-xs text-slate-400">{f.description}</span>
            </label>
          ))}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={closeFeatureModal}
              className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={featureLoading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
