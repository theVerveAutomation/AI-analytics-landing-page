import { Feature } from "@/types";
import { create } from "zustand";

type AssignFeaturesStore = {
    assignedFeatures: Feature[];
    isFetched: boolean;
    isLoading: boolean;
    fetchFeatures: (org_id: string) => Promise<void>;
    assignFeature: (feature: Feature) => void;
    unassignFeature: (featureId: string) => void;
    clearAssignedFeatures: () => void;
}

export const useAssignFeaturesStore = create<AssignFeaturesStore>((set, get) => ({
    assignedFeatures: [],
    isFetched: false,
    isLoading: false,

    fetchFeatures: async (org_id: string) => {
        if (get().isFetched) return;
        set({ isLoading: true });
        try {
            const response = await fetch(`/api/features/assigned?organization_id=${org_id}`);
            const features = await response.json();
            set({ assignedFeatures: features.features || [], isFetched: true, isLoading: false });
        } catch (error) {
            console.error("Error fetching features:", error);
            set({ isLoading: false });
        }
    },
    assignFeature: (feature: Feature) => {
        const existing = get().assignedFeatures.find(f => f.id === feature.id);
        if (!existing) {
            set({ assignedFeatures: [...get().assignedFeatures, feature] });
        }
    },
    unassignFeature: (featureId: string) => {
        set({ assignedFeatures: get().assignedFeatures.filter(f => f.id !== featureId) });
    },
    clearAssignedFeatures: () => {
        set({ assignedFeatures: [] });
    },
}));