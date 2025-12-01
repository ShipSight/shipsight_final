import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Camera, RefreshCw, Download, FlipHorizontal, Contrast } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface CameraPreviewProps {
  enabled?: boolean;
  isRecording?: boolean;
  elapsedTime?: number;
  directoryHandle?: any | null;
  recordMode?: "forward" | "reverse";
  overlayText?: string;
  qualityScale?: number;
  onQualityChange?: (scale: number) => void;
  clarityPreset?: "original" | "crisp" | "soft" | "medium" | "strong";
  onClarityChange?: (preset: "original" | "crisp" | "soft" | "medium" | "strong") => void;
}
export type CameraPreviewRef = {
  captureSnapshot: () => string | null;
};

export const CameraPreview = forwardRef<CameraPreviewRef, CameraPreviewProps>(({ enabled = true, isRecording = false, elapsedTime = 0, directoryHandle = null, recordMode = "forward", overlayText, qualityScale = 1, onQualityChange, clarityPreset = "original", onClarityChange }: CameraPreviewProps, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const selectedDirHandle = (directoryHandle ?? (typeof window !== 'undefined' ? (window as any).__selectedDirectoryHandle : null)) ?? null;
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  const [isFlipped, setIsFlipped] = useState(false);
  const filterForClarity = (preset: "original" | "crisp" | "soft" | "medium" | "strong"): string => {
    if (preset === "soft") return "blur(1px)";
    if (preset === "medium") return "blur(2px)";
    if (preset === "strong") return "blur(4px)";
    if (preset === "crisp") return "contrast(1.15) saturate(1.1) brightness(1.05)";
    return "none";
  };

  // Format elapsed time as MM:SS
  const formatElapsedTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (enabled) {
      refreshCamera();
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setStream(null);
      setHasCamera(false);
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  const initCamera = async (deviceId?: string) => {
    try {
      const targetW = Math.max(320, Math.round(1920 * qualityScale));
      const targetH = Math.max(240, Math.round(1080 * qualityScale));
      const constraints: MediaStreamConstraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId }, width: { ideal: targetW }, height: { ideal: targetH }, frameRate: { ideal: 30 } }
          : { facingMode: "environment", width: { ideal: targetW }, height: { ideal: targetH }, frameRate: { ideal: 30 } },
        audio: false,
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setHasCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        try { (window as any).__shipsightCameraVideo = videoRef.current; } catch {}
        try { await videoRef.current.play(); } catch {}
        try {
          const r = (videoRef.current as any).requestVideoFrameCallback;
          if (typeof r === "function") {
            await new Promise<void>((res) => r.call(videoRef.current, () => res()));
          }
        } catch {}
      }
      toast.success("Camera connected");

      // enumerate devices after access granted
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = allDevices.filter((d) => d.kind === "videoinput");
      setDevices(videoInputs);
      if (!deviceId && videoInputs.length > 0) {
        setSelectedDeviceId(videoInputs[0].deviceId);
      }
    } catch (error) {
      console.error("Camera error:", error);
      setHasCamera(false);
      toast.error("No camera found");
    }
  };

  const refreshCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    initCamera(selectedDeviceId);
  };

  const switchCamera = async (deviceId: string) => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setSelectedDeviceId(deviceId);
    await initCamera(deviceId);
    toast.success("Switched camera");
  };


  useImperativeHandle(ref, () => ({
    captureSnapshot: () => {
      const video = videoRef.current;
      if (!video) return null;
      const w = video.videoWidth || 1280;
      const h = video.videoHeight || 720;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.drawImage(video, 0, 0, w, h);
      try {
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        return dataUrl;
      } catch {
        return null;
      }
    },
  }), []);

  useEffect(() => {
    refreshCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (enabled) {
      refreshCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qualityScale]);

  useEffect(() => {
    return () => {
      try { (window as any).__shipsightCameraVideo = null; } catch {}
    };
  }, []);

  

  return (
    <div className="space-y-5 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-[var(--glass-medium)] border border-[var(--glass-border)]">
            <Camera className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold">Camera Feed</span>
        </div>
        <div className="flex gap-2 items-center">
          <Button
            variant="glass-white"
            size="icon"
            onClick={refreshCamera}
            title="Refresh Camera"
            disabled={!enabled}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          {/* Camera selector */}
          {devices.length > 0 && (
            <select
              className="h-11 rounded-2xl bg-white/10 text-white border border-white/20 backdrop-blur-2xl px-3 text-sm shadow-lg disabled:opacity-50"
              value={selectedDeviceId}
              onChange={(e) => switchCamera(e.target.value)}
              disabled={!enabled}
            >
              {devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label || `Camera ${d.deviceId.slice(0, 6)}`}
                </option>
              ))}
            </select>
          )}
          <div className="w-40">
            <Select
              value={String(qualityScale)}
              onValueChange={(val) => { const v = Number(val); if (onQualityChange) onQualityChange(v); }}
            >
              <SelectTrigger className="h-11 rounded-2xl bg-white/10 text-white border border-white/20 backdrop-blur-2xl px-3 text-sm shadow-lg">
                <SelectValue placeholder="Quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"1"}>Original</SelectItem>
                <SelectItem value={"0.5"}>1/2</SelectItem>
                <SelectItem value={"0.25"}>1/4</SelectItem>
                <SelectItem value={"0.125"}>1/8</SelectItem>
              </SelectContent>
          </Select>
        </div>
        <Button
          variant="glass-white"
          size="icon"
          onClick={() => { if (onClarityChange) onClarityChange(clarityPreset === "crisp" ? "original" : "crisp"); }}
          title="Crisp Mode"
          disabled={!enabled || !hasCamera}
        >
          <Contrast className="w-4 h-4" />
        </Button>
        <Button
          variant="glass-white"
          size="icon"
          onClick={() => setIsFlipped((v) => !v)}
          title="Flip Video"
          disabled={!enabled || !hasCamera}
        >
          <FlipHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </div>

      <div className="relative overflow-hidden rounded-3xl border border-[var(--glass-border)] bg-black/60 backdrop-blur-sm shadow-[var(--shadow-lg)] flex-1">
        {hasCamera ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={"w-full h-full object-cover " + (isFlipped ? "scale-x-[-1]" : "")}
              style={{ filter: filterForClarity(clarityPreset) }}
            />
            {isRecording && (
              <div className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-black/40 to-black/60 backdrop-blur-md border border-white/10 shadow-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full" style={{ animation: 'blink-recording 1s infinite' }}></div>
                <span className="text-white font-semibold text-sm tracking-wide">
                  REC {formatElapsedTime(elapsedTime)}
                </span>
              </div>
            )}
            {isRecording && overlayText && (
              <div className="absolute top-4 right-4 px-4 py-2 rounded-xl bg-gradient-to-r from-black/40 to-black/60 backdrop-blur-md border border-white/10 shadow-lg text-right">
                <div className="text-white text-xs font-medium leading-tight">{new Date().toLocaleString()}</div>
                <div className="text-white text-sm font-semibold tracking-wide">{overlayText}</div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="text-center space-y-3">
              <div className="p-4 rounded-2xl bg-[var(--glass-medium)] border border-[var(--glass-border)] inline-block">
                <Camera className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <p className="text-sm text-muted-foreground">No camera detected</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
