"use client";

import { useState, useEffect } from "react";
import { Document, DocumentStatus } from "@/lib/types";
import { ChevronDown, ChevronUp, Info } from "lucide-react";

interface DocumentChecklistProps {
  documents: string[];
  schemeId: string;
  onProgressChange?: (completed: number, total: number) => void;
}

const documentDescriptions: Record<string, string> = {
  "Aadhaar Card": "Your unique 12-digit identity number issued by UIDAI. Link it to your bank account for faster verification.",
  "Aadhaar / identity proof": "Your unique 12-digit identity number issued by UIDAI.",
  "Bank Account": "An active bank account linked to your Aadhaar for receiving disbursements.",
  "Bank Passbook (linked to Aadhaar)": "Current bank passbook or statement showing your account details linked to Aadhaar.",
  "Bank Passbook": "Current bank passbook or statement showing your account details.",
  "Income Certificate": "An official document from your district administrative office verifying your family's annual income.",
  "Category certificate (OBC/EBC/DNT)": "Official certificate confirming your social category, issued by competent authority.",
  "Caste Certificate": "Official certificate confirming your social category (SC/ST/OBC), issued by the district administration.",
  "Caste Certificate (OBC/EBC/DNT)": "Official certificate confirming your category status, issued by competent authority.",
  "Education Certificate": "Your recent education mark sheet or certificate from school/college.",
  "Previous year mark sheet": "Your mark sheet from the last academic year or completed level.",
  "Bonafide Student Certificate": "Current student certificate issued by your educational institution.",
  "PAN Card": "Your 10-digit Permanent Account Number for tax purposes.",
  "Disability Certificate": "Official disability certificate (40%+) issued by a medical board.",
  "Disability Certificate (40%+)": "Official certificate confirming disability status issued by medical authority.",
  "Admission Letter from recognized institution": "Official admission letter from your educational institution.",
  "Admission / Fee Receipt (Technical Course)": "Proof of admission and fee payment for your technical course.",
  "Class 12 Mark Sheet (above 80 percentile)": "Mark sheet showing your Class 12 scores (80 percentile or above).",
  "Class 7/8 Mark Sheet": "Mark sheet from Class 7 or 8 for eligibility verification.",
};

const statusLabels: Record<DocumentStatus, { label: string; color: string; icon: string }> = {
  NOT_AVAILABLE: { label: "Not Available", color: "text-gray-500", icon: "○" },
  NEEDED: { label: "Need to Obtain", color: "text-amber-600", icon: "⚠" },
  AVAILABLE: { label: "Available", color: "text-green-600", icon: "✓" },
  UPLOADED: { label: "Uploaded", color: "text-green-600", icon: "✓" },
  VERIFIED: { label: "Verified", color: "text-green-600", icon: "✓" },
};

export default function DocumentChecklist({
  documents,
  schemeId,
  onProgressChange,
}: DocumentChecklistProps) {
  const [checklist, setChecklist] = useState<Document[]>([]);
  const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChecklist = () => {
      const storageKey = `docs_${schemeId}`;
      const saved = localStorage.getItem(storageKey);

      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Document[];
          setChecklist(parsed);
        } catch {
          initializeChecklist();
        }
      } else {
        initializeChecklist();
      }
      setLoading(false);
    };

    const initializeChecklist = () => {
      const initialized: Document[] = documents.map((doc, idx) => ({
        id: `doc_${idx}`,
        name: doc,
        description: documentDescriptions[doc] || "Required document for application.",
        required: true,
        status: "NOT_AVAILABLE",
      }));
      setChecklist(initialized);
    };

    loadChecklist();
  }, [schemeId, documents]);

  useEffect(() => {
    if (checklist.length > 0) {
      const storageKey = `docs_${schemeId}`;
      localStorage.setItem(storageKey, JSON.stringify(checklist));

      // Calculate progress
      const completed = checklist.filter(
        (d) => d.status === "AVAILABLE" || d.status === "UPLOADED" || d.status === "VERIFIED"
      ).length;
      onProgressChange?.(completed, checklist.length);
    }
  }, [checklist, schemeId, onProgressChange]);

  const updateDocStatus = (id: string, status: DocumentStatus) => {
    setChecklist((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status } : d))
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedDocs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (loading) {
    return <div className="animate-pulse h-40 bg-gray-100 rounded" />;
  }

  const completed = checklist.filter(
    (d) => d.status === "AVAILABLE" || d.status === "UPLOADED" || d.status === "VERIFIED"
  ).length;
  const total = checklist.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Progress Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">Document Preparation</h3>
          <span className="text-sm font-medium text-blue-600">{completed} of {total}</span>
        </div>
        <div className="w-full bg-blue-100 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {progress === 100
            ? "✓ All documents marked as available. Ready to proceed!"
            : `${completed} document${completed !== 1 ? "s" : ""} ready. ${total - completed} to go.`}
        </p>
      </div>

      {/* Document List */}
      <div className="space-y-2">
        {checklist.map((doc) => {
          const isExpanded = expandedDocs.has(doc.id);
          const statusConfig = statusLabels[doc.status];

          return (
            <div
              key={doc.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition"
            >
              <div className="bg-white p-3">
                <div className="flex items-start gap-3">
                  {/* Status Indicator */}
                  <div className="flex-shrink-0 mt-1">
                    <span className={`text-lg ${statusConfig.color}`}>
                      {statusConfig.icon}
                    </span>
                  </div>

                  {/* Document Info */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-medium text-gray-900 text-sm leading-tight">
                        {doc.name}
                      </h4>
                      <button
                        onClick={() => toggleExpand(doc.id)}
                        className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                        aria-label="Toggle details"
                      >
                        {isExpanded ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                    </div>
                    <p className={`text-xs mt-1 ${statusConfig.color}`}>
                      {statusConfig.label}
                    </p>
                  </div>
                </div>

                {/* Status Selection & Details */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                    {/* Description */}
                    <div className="bg-gray-50 rounded p-2.5 text-xs text-gray-700">
                      <div className="flex gap-2">
                        <Info size={14} className="flex-shrink-0 text-blue-500 mt-0.5" />
                        <p>{doc.description}</p>
                      </div>
                    </div>

                    {/* Status Buttons */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700 block">
                        Mark your status:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {(
                          [
                            "AVAILABLE",
                            "NEEDED",
                            "UPLOADED",
                          ] as DocumentStatus[]
                        ).map((status) => (
                          <button
                            key={status}
                            onClick={() => updateDocStatus(doc.id, status)}
                            className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                              doc.status === status
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {statusLabels[status].label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {doc.status === "NEEDED" && (
                      <div className="bg-amber-50 border border-amber-100 rounded p-2.5 text-xs text-amber-800">
                        <strong>Tip:</strong> Check the scheme's official website or contact the issuing authority for instructions on obtaining this document.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to Action */}
      {progress === 100 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm font-medium text-green-900 mb-2">✓ Ready to Apply</p>
          <p className="text-xs text-green-700 mb-3">
            All required documents are marked as available. You can now proceed to fill the official application.
          </p>
        </div>
      )}

      {progress < 100 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-900 mb-2">Next Steps</p>
          <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
            <li>Mark documents you already have as "Available"</li>
            <li>Mark others as "Need to Obtain" if you need to get them</li>
            <li>Once ready, proceed to the guided application</li>
          </ol>
        </div>
      )}
    </div>
  );
}
