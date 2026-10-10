"use client";

import { useState, useRef } from "react";
import { AlertCircle, Loader, Camera, StopCircle } from "lucide-react";

interface CameraGuidancePanelProps {
  schemeId?: string;
  currentStep?: number;
  onAnalyzed?: (guidance: any) => void;
  onClose?: () => void;
}

export function CameraGuidancePanel({
  schemeId,
  currentStep = 1,
  onAnalyzed,
  onClose,
}: CameraGuidancePanelProps) {
  const [isActive, setIsActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guidance, setGuidance] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      setError(null);

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Back camera on mobile
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsActive(true);

      // Handle when user stops camera
      stream.getTracks().forEach((track) => {
        track.onended = () => {
          setIsActive(false);
          setGuidance(null);
          setError(null);
        };
      });
    } catch (err: any) {
      if (err.name === "NotAllowedError") {
        setError("Camera permission denied. Please allow camera access to continue.");
      } else if (err.name === "NotFoundError") {
        setError("No camera found on this device.");
      } else if (err.name === "NotSupportedError") {
        setError("Camera is not supported in your browser.");
      } else {
        setError("Could not access camera. Please try again.");
      }
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsActive(false);
    setGuidance(null);
    setError(null);
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) {
      setError("Could not capture image. Please try again.");
      return;
    }

    try {
      setIsAnalyzing(true);
      setError(null);

      // Capture frame from video
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) {
        setError("Could not process image. Please refresh and try again.");
        return;
      }

      ctx.drawImage(videoRef.current, 0, 0, 1280, 720);
      const frameData = canvasRef.current.toDataURL("image/jpeg", 0.7);

      // Send to analysis API
      const response = await fetch("/api/guidance/analyze-frame", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          frame: frameData,
          schemeId,
          currentStep,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const result = await response.json();
      setGuidance(result);

      if (onAnalyzed) {
        onAnalyzed(result);
      }
    } catch (err: any) {
      setError(err.message || "Could not analyze image. Please try again.");
      console.error("Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isActive) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="bg-emerald-100 p-3 rounded-lg">
            <Camera className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 mb-2">
              Camera Guidance Mode
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Point your camera at your laptop screen, government website, or printed application
              form. JanSahayak will analyze what you show and provide guidance.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <button
              onClick={startCamera}
              className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium flex items-center justify-center gap-2"
            >
              <Camera size={18} />
              Start Camera
            </button>

            <p className="mt-3 text-xs text-slate-500">
              ✓ Perfect for mobile devices
              ✓ JanSahayak cannot record your video
              ✓ Stop at any time
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Camera Active Indicator */}
      <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
        <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
        <span className="text-sm font-semibold text-green-700">● Camera Active</span>
        <button
          onClick={stopCamera}
          className="ml-auto px-3 py-1 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded transition font-medium flex items-center gap-1"
        >
          <StopCircle size={16} />
          Stop Camera
        </button>
      </div>

      {/* Video Feed */}
      <div className="bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full aspect-video bg-black"
        />
        <canvas ref={canvasRef} width={1280} height={720} className="hidden" />

        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-white flex flex-col items-center gap-2">
              <Loader size={32} className="animate-spin" />
              <p className="text-sm">Analyzing image...</p>
            </div>
          </div>
        )}
      </div>

      {/* Capture Button */}
      <button
        onClick={captureAndAnalyze}
        disabled={isAnalyzing}
        className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium disabled:bg-slate-400 flex items-center justify-center gap-2"
      >
        {isAnalyzing ? (
          <>
            <Loader size={18} className="animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Camera size={18} />
            Capture & Analyze
          </>
        )}
      </button>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Guidance Display */}
      {guidance && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">What I See</h4>
            <p className="text-sm text-slate-700">{guidance.pageTitle}</p>
          </div>

          {guidance.detectedElements && guidance.detectedElements.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Elements Detected</h4>
              <div className="flex flex-wrap gap-2">
                {guidance.detectedElements.map((element: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded"
                  >
                    {element}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">What To Do</h4>
            <p className="text-sm text-slate-700">{guidance.guidance}</p>
          </div>

          {guidance.warnings && guidance.warnings.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                <AlertCircle size={16} />
                Important
              </h4>
              <ul className="text-sm text-amber-800 space-y-1">
                {guidance.warnings.map((warning: string, idx: number) => (
                  <li key={idx}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}

          {guidance.sensitiveFieldsDetected && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-medium">
                ⚠️ Please enter sensitive information (passwords, OTPs, PINs) yourself.
                JanSahayak will not read or process sensitive data.
              </p>
            </div>
          )}

          <div className="pt-2 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              <span className="font-semibold">Next Step:</span> {guidance.nextAction}
            </p>
          </div>
        </div>
      )}

      <p className="text-xs text-slate-500 text-center">
        💡 Tip: Point your camera at the screen or document you need help with and tap
        "Capture & Analyze".
      </p>
    </div>
  );
}
