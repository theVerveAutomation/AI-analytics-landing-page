import { CameraConfig } from "@/types";
import { Camera, WifiOff } from "lucide-react";

export default function CameraFeed({ camera }: { camera?: CameraConfig }) {
  if (!camera) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 text-xs">
        <Camera className="w-8 h-8 mb-1" />
        <span>No Camera Selected</span>
      </div>
    );
  }
  if (camera.status === "offline") {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 text-xs">
        <WifiOff className="w-8 h-8 mb-1" />
        <span>Offline</span>
      </div>
    );
  }

  // If it's a URL-based camera, show iframe or image
  if (camera.url) {
    // For all URLs (RTSP converted to HLS or HTTP streams, or others)
    return (
      <div className="relative w-full h-full bg-slate-900">
        <iframe
          src={camera.url}
          className="w-full h-full pointer-events-none"
          title={camera.name}
        />
      </div>
    );
  }
}
