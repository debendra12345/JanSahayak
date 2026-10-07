"use client";

import { EligibilityReason } from "@/lib/types";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { useState } from "react";

interface EligibilityBreakdownProps {
  reasons: EligibilityReason[];
  status: "Eligible" | "Likely Eligible" | "Not Eligible";
}

export default function EligibilityBreakdown({
  reasons,
  status,
}: EligibilityBreakdownProps) {
  const [expandedCriteria, setExpandedCriteria] = useState<string | null>(null);

  // Categorize reasons
  const passedReasons = reasons.filter((r) => r.passed === true);
  const unknownReasons = reasons.filter((r) => r.passed === "unknown");
  const failedReasons = reasons.filter((r) => r.passed === false);

  const getStatusMessage = () => {
    if (status === "Eligible") {
      return "You appear to meet all criteria for this scheme.";
    } else if (status === "Likely Eligible") {
      return `You likely meet the criteria, but ${unknownReasons.length} piece${unknownReasons.length !== 1 ? "s" : ""} of information is needed to confirm.`;
    } else {
      return `You may not be eligible based on the information provided. Please review the criteria below.`;
    }
  };

  const getStatusBgColor = () => {
    if (status === "Eligible") return "bg-green-50 border-green-200";
    if (status === "Likely Eligible") return "bg-amber-50 border-amber-200";
    return "bg-red-50 border-red-200";
  };

  const getStatusTextColor = () => {
    if (status === "Eligible") return "text-green-900";
    if (status === "Likely Eligible") return "text-amber-900";
    return "text-red-900";
  };

  const getStatusIcon = () => {
    if (status === "Eligible") return <CheckCircle size={20} className="text-green-600" />;
    if (status === "Likely Eligible") return <AlertCircle size={20} className="text-amber-600" />;
    return <XCircle size={20} className="text-red-600" />;
  };

  return (
    <div className="space-y-4">
      {/* Overall Status */}
      <div className={`border rounded-lg p-4 ${getStatusBgColor()}`}>
        <div className="flex items-start gap-3">
          <div className="mt-0.5">{getStatusIcon()}</div>
          <div className="flex-1">
            <h3 className={`font-semibold text-sm ${getStatusTextColor()}`}>
              {status}
            </h3>
            <p className={`text-sm mt-1 ${getStatusTextColor()}`}>
              {getStatusMessage()}
            </p>
          </div>
        </div>
      </div>

      {/* Eligibility Criteria */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900">Eligibility Criteria</h3>

        {/* Passed Criteria */}
        {passedReasons.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-600 uppercase">
              ✓ Matched ({passedReasons.length})
            </p>
            {passedReasons.map((reason) => (
              <button
                key={reason.criterion}
                onClick={() =>
                  setExpandedCriteria(
                    expandedCriteria === reason.criterion ? null : reason.criterion
                  )
                }
                className={`w-full text-left border-l-4 border-green-600 rounded-r-lg p-3 bg-green-50 hover:bg-green-100 transition ${
                  expandedCriteria === reason.criterion ? "ring-2 ring-green-300" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                    <span className="font-medium text-green-900 text-sm">
                      {reason.criterion}
                    </span>
                  </div>
                  <span className="text-xs text-green-700">Click for details</span>
                </div>
                {expandedCriteria === reason.criterion && (
                  <p className="text-sm text-green-800 mt-2 pl-6">{reason.detail}</p>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Unknown Criteria */}
        {unknownReasons.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-600 uppercase">
              ⚠ Information Needed ({unknownReasons.length})
            </p>
            {unknownReasons.map((reason) => (
              <button
                key={reason.criterion}
                onClick={() =>
                  setExpandedCriteria(
                    expandedCriteria === reason.criterion ? null : reason.criterion
                  )
                }
                className={`w-full text-left border-l-4 border-amber-600 rounded-r-lg p-3 bg-amber-50 hover:bg-amber-100 transition ${
                  expandedCriteria === reason.criterion ? "ring-2 ring-amber-300" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
                    <span className="font-medium text-amber-900 text-sm">
                      {reason.criterion}
                    </span>
                  </div>
                  <span className="text-xs text-amber-700">Click for details</span>
                </div>
                {expandedCriteria === reason.criterion && (
                  <p className="text-sm text-amber-800 mt-2 pl-6">{reason.detail}</p>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Failed Criteria */}
        {failedReasons.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-600 uppercase">
              ✕ Not Matched ({failedReasons.length})
            </p>
            {failedReasons.map((reason) => (
              <button
                key={reason.criterion}
                onClick={() =>
                  setExpandedCriteria(
                    expandedCriteria === reason.criterion ? null : reason.criterion
                  )
                }
                className={`w-full text-left border-l-4 border-red-600 rounded-r-lg p-3 bg-red-50 hover:bg-red-100 transition ${
                  expandedCriteria === reason.criterion ? "ring-2 ring-red-300" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle size={16} className="text-red-600 flex-shrink-0" />
                    <span className="font-medium text-red-900 text-sm">
                      {reason.criterion}
                    </span>
                  </div>
                  <span className="text-xs text-red-700">Click for details</span>
                </div>
                {expandedCriteria === reason.criterion && (
                  <p className="text-sm text-red-800 mt-2 pl-6">{reason.detail}</p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-900">
          <strong>Important:</strong> This is an automated assessment based on the information you provided. The final eligibility decision belongs to the government authority. Always verify details on the official website and contact them if you have questions.
        </p>
      </div>
    </div>
  );
}
