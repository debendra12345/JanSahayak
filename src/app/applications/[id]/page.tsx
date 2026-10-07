"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface ApplicationDetail {
  id: string;
  schemeName: string;
  schemeId: string;
  status: "draft" | "submitted" | "under-review" | "approved" | "rejected";
  createdAt: string;
  submittedAt?: string;
  lastUpdated: string;
  progress: number;
  steps: {
    name: string;
    status: "completed" | "current" | "pending";
    completedAt?: string;
  }[];
  documents: {
    name: string;
    status: "pending" | "uploaded" | "verified";
  }[];
}

const DEMO_APP: ApplicationDetail = {
  id: "app-1",
  schemeName: "PM YASASVI Scholarship",
  schemeId: "pm-yasasvi",
  status: "submitted",
  createdAt: "2025-10-01",
  submittedAt: "2025-10-01",
  lastUpdated: "2025-10-02",
  progress: 100,
  steps: [
    { name: "Profile Information", status: "completed", completedAt: "2025-10-01" },
    { name: "Educational Details", status: "completed", completedAt: "2025-10-01" },
    { name: "Income Verification", status: "completed", completedAt: "2025-10-01" },
    { name: "Document Upload", status: "completed", completedAt: "2025-10-01" },
    { name: "Application Review", status: "current" },
  ],
  documents: [
    { name: "Mark Sheet", status: "verified" },
    { name: "Income Certificate", status: "verified" },
    { name: "Disability Certificate", status: "uploaded" },
    { name: "ID Proof", status: "verified" },
  ],
};

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: "bg-gray-100", text: "text-gray-800", label: "Draft" },
  submitted: { bg: "bg-blue-100", text: "text-blue-800", label: "Submitted" },
  "under-review": { bg: "bg-yellow-100", text: "text-yellow-800", label: "Under Review" },
  approved: { bg: "bg-green-100", text: "text-green-800", label: "Approved" },
  rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
};

export default function ApplicationDetailPage() {
  const params = useParams();
  const [app, setApp] = useState<ApplicationDetail | null>(null);

  useEffect(() => {
    setApp(DEMO_APP);
  }, []);

  if (!app) {
    return (
      <div className="p-6 md:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-slate-200 rounded"></div>
          <div className="h-96 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  const config = STATUS_CONFIG[app.status];

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/applications" className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-2 inline-block">
          ← Back to Applications
        </Link>
        <div className="flex justify-between items-start mt-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{app.schemeName}</h1>
            <p className="text-slate-600 mt-1">Application ID: {app.id}</p>
          </div>
          <span className={`px-4 py-2 rounded-lg font-semibold ${config.bg} ${config.text}`}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Timeline/Progress */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Application Progress</h2>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-700 font-medium">Overall Progress</span>
            <span className="text-slate-900 font-semibold">{app.progress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${app.progress}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4 mt-8">
          {app.steps.map((step, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                    step.status === "completed"
                      ? "bg-green-600 text-white"
                      : step.status === "current"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-300 text-slate-600"
                  }`}
                >
                  {step.status === "completed" ? "✓" : idx + 1}
                </div>
                {idx < app.steps.length - 1 && (
                  <div
                    className={`w-1 h-12 my-2 ${
                      step.status === "completed" ? "bg-green-600" : "bg-slate-300"
                    }`}
                  />
                )}
              </div>
              <div className="pt-1">
                <p className={`font-semibold ${step.status === "current" ? "text-blue-600" : "text-slate-900"}`}>
                  {step.name}
                </p>
                {step.completedAt && (
                  <p className="text-xs text-slate-600">Completed: {new Date(step.completedAt).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Documents</h2>
        <div className="space-y-3">
          {app.documents.map((doc, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📄</span>
                <span className="font-medium text-slate-900">{doc.name}</span>
              </div>
              <span
                className={`px-3 py-1 rounded text-xs font-medium ${
                  doc.status === "verified"
                    ? "bg-green-100 text-green-700"
                    : doc.status === "uploaded"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {doc.status === "verified" ? "✓ Verified" : doc.status === "uploaded" ? "Uploaded" : "Pending"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Timeline</h2>
        <div className="space-y-4 text-sm">
          <div className="flex gap-4">
            <div className="text-slate-600 font-medium w-32">Created:</div>
            <div className="text-slate-900">{new Date(app.createdAt).toLocaleDateString()}</div>
          </div>
          {app.submittedAt && (
            <div className="flex gap-4">
              <div className="text-slate-600 font-medium w-32">Submitted:</div>
              <div className="text-slate-900">{new Date(app.submittedAt).toLocaleDateString()}</div>
            </div>
          )}
          <div className="flex gap-4">
            <div className="text-slate-600 font-medium w-32">Last Updated:</div>
            <div className="text-slate-900">{new Date(app.lastUpdated).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      {app.status === "draft" && (
        <div className="mt-6 flex gap-3">
          <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
            Continue Application
          </button>
          <button className="flex-1 px-4 py-3 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 transition font-semibold">
            Save & Exit
          </button>
        </div>
      )}
    </div>
  );
}
