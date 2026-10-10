"use client";

import { useState, useRef } from "react";
import { AlertCircle, Loader, Monitor, StopCircle, Maximize2 } from "lucide-react";

interface ScreenSharingPanelProps {
  schemeId?: string;
  currentStep?: number;
  onAnalyzed?: (guidance: any) => void;
  onClose?: () => void;
}

export function ScreenSharingPanel({
  schemeId,
  currentStep = 1,
  onAnalyzed,
  onClose,
}: ScreenSharingPanelProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guidance, setGuidance] = useState<any>(null);
  const [lastAnalysisTime, setLastAnalysisTime] = useState<Date | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startScreenSharing = async () => {
    try {
      setError(null);
      
      // Request screen share
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" } as any,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsSharing(true);

      // Handle when user stops sharing
      stream.getTracks().forEach((track) => {
        track.onended = () => {
          setIsSharing(false);
          setGuidance(null);
          setError(null);
        };
      });
    } catch (err: any) {
      if (err.name === "NotAllowedError") {
        setError("Screen sharing permission denied. Please allow access to continue.");
      } else if (err.name === "NotSupportedError") {
        setError(
          "Screen sharing is not supported in your browser. Use Chrome, Edge, or Firefox."
        );
      } else {
        setError("Could not start screen sharing. Please try again.");
      }
      console.error("Screen sharing error:", err);
    }
  };

  const stopScreenSharing = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsSharing(false);
    setGuidance(null);
    setError(null);
  };

  const analyzeCurrentScreen = async () => {
    if (!videoRef.current || !canvasRef.current) {
      setError("Could not capture screen. Please try again.");
      return;
    }

    try {
      setIsAnalyzing(true);
      setError(null);

      // Capture frame from video
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) {
        setError("Could not access canvas. Please refresh and try again.");
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
        throw new Error("Failed to analyze screen");
      }

      const result = await response.json();
      setGuidance(result);
      setLastAnalysisTime(new Date());

      if (onAnalyzed) {
        onAnalyzed(result);
      }
    } catch (err: any) {
      setError(err.message || "Could not analyze screen. Please try again.");
      console.error("Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isSharing) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Monitor className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 mb-2">
              Screen-Sharing Guidance
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Let JanSahayak see your current application screen and provide step-by-step
              guidance. You control what is shared and can stop at any time.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <button
              onClick={startScreenSharing}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
            >
              <Monitor size={18} />
              Share My Screen
            </button>

            <p className="mt-3 text-xs text-slate-500">
              ✓ Your privacy is protected. JanSahayak cannot record your screen.
              ✓ You can stop sharing at any time.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sharing Active Indicator */}
      <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
        <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
        <span className="text-sm font-semibold text-green-700">● Screen Sharing Active</span>
        <button
          onClick={stopScreenSharing}
          className="ml-auto px-3 py-1 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded transition font-medium flex items-center gap-1"
        >
          <StopCircle size={16} />
          Stop Sharing
        </button>
      </div>

      {/* Video Preview */}
      <div className="bg-black rounded-lg overflow-hidden relative">
        <video
          ref={videoRef}
          autoPlay
          className="w-full aspect-video bg-black"
        />
        <canvas ref={canvasRef} width={1280} height={720} className="hidden" />

        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-white flex flex-col items-center gap-2">
              <Loader size={32} className="animate-spin" />
              <p className="text-sm">Analyzing screen...</p>
            </div>
          </div>
        )}
      </div>

      {/* Analysis Button and Info */}
      <div className="flex gap-3">
        <button
          onClick={analyzeCurrentScreen}
          disabled={isAnalyzing}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-slate-400 flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <Loader size={18} className="animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Maximize2 size={18} />
              Analyze Current Screen
            </>
          )}
        </button>

        <button
          onClick={stopScreenSharing}
          className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-medium"
        >
          Stop
        </button>
      </div>

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
              <h4 className="font-semibold text-slate-900 mb-2">Detected Elements</h4>
              <div className="flex flex-wrap gap-2">
                {guidance.detectedElements.map((element: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
                  >
                    {element}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">What You Should Do</h4>
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
                ⚠️ Sensitive information detected. Please enter passwords, OTPs, and PINs
                yourself. JanSahayak will not read or process sensitive data.
              </p>
            </div>
          )}

          <div className="pt-2 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              <span className="font-semibold">Next Step:</span> {guidance.nextAction}
            </p>
          </div>

          {lastAnalysisTime && (
            <p className="text-xs text-slate-500">
              Last analyzed: {lastAnalysisTime.toLocaleTimeString()}
            </p>
          )}
        </div>
      )}

      <p className="text-xs text-slate-500 text-center">
        💡 Tip: Capture a screenshot when you see the screen you need help with, then
        click "Analyze Current Screen" for guidance.
      </p>
    </div>
  );
}
