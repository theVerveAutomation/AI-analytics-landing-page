export interface Feature {
  title: string;
  useCase: string;
}

export interface FeatureCategory {
  id: string;
  name: string;
  features: Feature[];
}

export const featureCategories: FeatureCategory[] = [
  {
    id: "security",
    name: "Core Security & Detection",
    features: [
      {
        title: "Motion Detection",
        useCase: "Start recording when someone enters after hours.",
      },
      {
        title: "Object Detection",
        useCase: "Detect an unattended bag in a store aisle.",
      },
      {
        title: "Object Tracking",
        useCase: "Track a suspect from one aisle to another.",
      },
      {
        title: "Intrusion Detection",
        useCase: "Alert when customers access staff-only areas.",
      },
      {
        title: "Line Crossing Detection",
        useCase: "Monitor emergency exits or back-door breaches.",
      },
      {
        title: "Abandoned Object Detection",
        useCase: "Identify potential security threats in valet or foyer areas.",
      },
      {
        title: "Removed Object Detection",
        useCase: "Immediate alert when merchandise is removed without purchase.",
      },
      {
        title: "Perimeter Breach Detection",
        useCase: "Protect warehouse boundaries and loading docks.",
      },
      {
        title: "Behavior Analysis / Anomaly Detection",
        useCase: "Detect tense confrontations or irregular store behavior.",
      },
    ],
  },
  {
    id: "retail",
    name: "Retail & Business Analytics",
    features: [
      {
        title: "Loitering Detection",
        useCase: "Identify potential shoplifters lingering near high-value goods.",
      },
      {
        title: "Crowd Detection & Density Analysis",
        useCase: "Manage peak shopping hours and staff allocation.",
      },
      {
        title: "People Counting",
        useCase: "Footfall analytics and maximum occupancy enforcement.",
      },
      {
        title: "Heat Mapping",
        useCase: "Optimize product placement and store layout.",
      },
      {
        title: "Dwell Time Analysis",
        useCase: "See which displays hold customer attention.",
      },
      {
        title: "Queue Management",
        useCase: "Open more registers when queues exceed threshold.",
      },
      {
        title: "Object Counting",
        useCase: "Inventory flow monitoring in stockrooms.",
      },
      {
        title: "Smart Search & Forensic Analysis",
        useCase: "Quickly find the clip where a specific SKU was removed.",
      },
    ],
  },
  {
    id: "theft",
    name: "Advanced Theft Prevention",
    features: [
      {
        title: "Shoplifting / Theft Detection",
        useCase: "Real-time alert when an object is concealed in clothing or bag.",
      },
      {
        title: "Hand-to-Body Interaction / Concealment Detection",
        useCase: "Flag when a hand moves behind clothing or into a bag after picking an item.",
      },
      {
        title: "Shelf Change / Stock Removal Detection",
        useCase: "Instant alert when an item is removed from a shelf without passing POS.",
      },
      {
        title: "POS / Transaction Correlation",
        useCase: "Detect when an item leaves the store but no sale was recorded.",
      },
    ],
  },
  {
    id: "safety",
    name: "Safety & Identity",
    features: [
      {
        title: "Facial Recognition",
        useCase: "Block known shoplifters or identify VIP customers (subject to privacy laws).",
      },
      {
        title: "Banned Customer / Threat List Alerts",
        useCase: "Prevent banned individuals from entering.",
      },
      {
        title: "Fall Detection",
        useCase: "Rapid response to accidents in-store.",
      },
      {
        title: "Slip / Trip Detection",
        useCase: "Reduce liability by fast response to customer falls.",
      },
      {
        title: "PPE & Safety Compliance Detection",
        useCase: "Ensure staff wear safety vests in loading areas.",
      },
      {
        title: "Fire & Smoke Detection",
        useCase: "Early alerts in back rooms or stockrooms.",
      },
      {
        title: "Gesture & Pose Recognition",
        useCase: "Detect aggressive gestures or distress signals.",
      },
      {
        title: "Behavioral Prediction",
        useCase: "Preemptively dispatch staff if a theft pattern emerges.",
      },
    ],
  },
];
