"use client";

import { SourceVerification } from "@/lib/types";
import { CheckCircle, AlertCircle, HelpCircle, ExternalLink } from "lucide-react";
import { useState } from "react";

interface TrustBadgeProps {
  verification?: SourceVerification;
  compact?: boolean;
}

export default function TrustBadge({ verification, compact = false }: TrustBadgeProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (!verification) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
        <HelpCircle size={14} />
        Source verification unavailable
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (verification.sourceStatus) {
      case "VERIFIED":
        return <CheckCircle size={16} className="text-green-600" />;
      case "NEEDS_REVIEW":
        return <AlertCircle size={16} className="text-amber-600" />;
      case "UNVERIFIED":
        return <HelpCircle size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (verification.sourceStatus) {
      case "VERIFIED":
        return "bg-green-50 border-green-200 text-green-900";
      case "NEEDS_REVIEW":
        return "bg-amber-50 border-amber-200 text-amber-900";
      case "UNVERIFIED":
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const getStatusLabel = () => {
    switch (verification.sourceStatus) {
      case "VERIFIED":
        return "Verified Source";
      case "NEEDS_REVIEW":
        return "Needs Review";
      case "UNVERIFIED":
        return "Not Verified";
    }
  };

  const getFreshnessLabel = () => {
    switch (verification.freshnessStatus) {
      case "CURRENT":
        return "Current";
      case "AGING":
        return "Aging (may need update)";
      case "OUTDATED":
        return "Possibly outdated";
    }
  };

  if (compact) {
    return (
      <button
        onClick={() => setShowDetails(true)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 hover:bg-green-100 border border-green-200 rounded-full text-xs font-medium text-green-700 transition"
      >
        <CheckCircle size={13} />
        Verified
      </button>
    );
  }

  return (
    <>
      {/* Badge Button */}
      <button
        onClick={() => setShowDetails(true)}
        className={`inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-xs font-medium transition cursor-pointer ${getStatusColor()}`}
      >
        {getStatusIcon()}
        {getStatusLabel()}
      </button>

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-lg animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                {getStatusIcon()}
                <h3 className="text-lg font-semibold text-gray-900">
                  {getStatusLabel()}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {verification.isOfficial && (
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-green-900">Official Source</p>
                    <p className="text-xs text-green-700 mt-0.5">
                      This information comes from an official government channel.
                    </p>
                  </div>
                </div>
              )}

              {/* Official Domain */}
              {verification.officialDomain && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Official Domain
                  </label>
                  <p className="text-sm text-gray-900 mt-1 font-mono break-all">
                    {verification.officialDomain}
                  </p>
                </div>
              )}

              {/* Last Verified */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Last Verified
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(verification.lastVerifiedAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              {/* Freshness Status */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Data Freshness
                </label>
                <p className={`text-sm mt-1 font-medium ${
                  verification.freshnessStatus === "CURRENT"
                    ? "text-green-700"
                    : verification.freshnessStatus === "AGING"
                    ? "text-amber-700"
                    : "text-red-700"
                }`}>
                  {getFreshnessLabel()}
                </p>
              </div>

              {/* Source URL */}
              {verification.sourceUrl && (
                <div>
                  <a
                    href={verification.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg text-sm font-medium transition"
                  >
                    <ExternalLink size={14} />
                    View Official Source
                  </a>
                </div>
              )}

              {/* Conflict Notice */}
              {verification.conflictStatus && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-800 font-medium">⚠ Note</p>
                  <p className="text-xs text-amber-700 mt-1">
                    {verification.conflictStatus}
                  </p>
                </div>
              )}

              {/* Disclaimer */}
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600">
                  <strong>Disclaimer:</strong> JanSahayak displays information based on official government sources. Always verify details on the scheme's official website before applying.
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-sm font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
