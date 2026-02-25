// Profile type matching the profiles table schema
export interface Profile {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user";
  full_name: string;
  organization_logo?: string | null;
  organization_name?: string | null;
  organization_id: string ;
  created_at?: string;
  updated_at?: string;
  display_orgId?: string;
  organizations?: Organization
}

// Feature type matching the features table schema
export interface Feature {
  id: string;
  name: string;
  description: string;
  icon?: string;
  enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Recording {
  id: string;
  camera_id: string;
  camera_name: string;
  start_time: string;
  end_time: string;
  duration: number; // in seconds
  file_size: number; // in MB
  file_url: string;
  thumbnail_url?: string;
  has_detections: boolean;
  detection_count: number;
}


export interface Product {
  id: string;
  name: string;
  brand?: string;
  description: string;
  image_url: string;
  org_id: string;
  category_id?: string;
  price?: number;
  showPrice?: boolean;
  created_at?: string;
  available?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_at?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  brand?: string;
  showPrice?: boolean;
  quantity: number;
  image_url: string;
}

export interface Organization {
  id: string;
  name?: string;
  displayid?: string;
  address?: string;
  email?: string;
  contact_phone?: string;
  logo_url?: string;
  created_at: string;
  user_count?: number;
  alerts?: AlertType[];
}

// Alert types for organization notifications
export type AlertType = "SMS" | "WHATSAPP" | "WECHAT" | "TELEGRAM";

export interface CameraConfig {
  id?: string;
  name?: string;
  status?: "normal" | "warning" | "offline";
  detection?: boolean;
  alert_sound?: boolean;
  frame_rate?: number;
  resolution?: string;
  updated_at?: string;
  url?: string; // Optional URL for RTSP/HTTP streams
  created_at?: string;
  organization_id?: string | number;
  stream_url?: string;
  camera_features?: CameraFeatures[]; // Optional array of features assigned to the camera
}

export interface CameraFeatures {
  id: string;
  camera_id: string;
  feature_id: string;
  features: Feature; // Include the full feature details
  assigned_at: string;
}

export interface Snapshot {
  id: string;
  camera_id: string;
  camera_name: string;
  url: string;
  organization_id: string;
  created_at: string;
  capture_method?: "time" | "door_crossing";
}

export interface CameraFolder {
  camera: CameraConfig;
  snapshotCount: number;
  latestSnapshot?: Snapshot;
}

export interface AlertDetail {
  id: string;
  timestamp: string;
  camera: string;
  alert_type: string;
  message: string;
  imageUrl: string;
}

export interface FeatureAlert {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  alertCount: number;
  color: string;
  lastAlert: string;
  recentAlerts: AlertDetail[];
}

export interface DashboardState {
  features: string[];
  systemHealth: number;
  cameras: {
    camerasOnline: number;
    totalCameras: number;
    cameraStatus: {
      id: string;
      name: string;
      status: "normal" | "warning" | "offline";
      detections: number;
    }[];
  }
  alerts: {  
    alertsToday: number;
    recentAlerts: AlertDetail[];
  };
  detections: {
    totalDetections: number;
    objectDetected: number;
    staffDetected: number;
    motionDetected: number;
    pacingDetected: number;
    erraticMovementsDetected: number;
    armFlailingDetected: number;
    facialExpressionsDetected: number;
    thermalIndicatorsDetected: number;
    fallDetectionDetected: number;
    escapeAttemptsDetected: number;
    loiteringDetected: number;
  };
  hourlyDetections: { 
    hour: string; 
    "Object Detection": number; 
    "Motion Detection": number; 
    "Staff Detection": number; 
    "Pacing Detection": number; 
    "Erratic Movements Detection": number; 
    "Facial Expressions Detection": number; 
    "Thermal Indicators Detection": number; 
    "Fall Detection": number; 
    "Escape Attempts Detection": number; 
    "Arm Flailing Detection": number; 
    "Loitering Detection": number;
  }[];
}