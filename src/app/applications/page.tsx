"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Application {
  id: string;
  schemeName: string;
  schemeId: string;
  status: "draft" | "submitted" | "under-review" | "approved" | "rejected";
  submittedAt?: string;
  lastUpdated: string;
  progress: number;
}

const DEMO_APPLICATIONS: Application[] = [
  {
    id: "app-1",
    schemeName: "PM YASASVI Scholarship",
    schemeId: "pm-yasasvi",
    status: "submitted",
    submittedAt: "2025-10-01",
    lastUpdated: "2025-10-02",
    progress: 100,
  },
  {
    id: "app-2",
    schemeName: "Central Sector Scholarship (CSSS)",
    schemeId: "csss-ug-pg",
    status: "under-review",
    submittedAt: "2025-09-15",
    lastUpdated: "2025-10-05",
    progress: 60,
  },
  {
    id: "app-3",
    schemeName: "PM Vidyalakshmi Education Loan",
    schemeId: "pm-vidyalakshmi",
    status: "draft",
    lastUpdated: "2025-10-03",
    progress: 35,
  },
];

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: "bg-gray-100", text: "text-gray-800", label: "Draft" },
  submitted: { bg: "bg-blue-100", text: "text-blue-800", label: "Submitted" },
  "under-review": { bg: "bg-yellow-100", text: "text-yellow-800", label: "Under Review" },
  approved: { bg: "bg-green-100", text: "text-green-800", label: "Approved" },
  rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    setApplications(DEMO_APPLICATIONS);
  }, []);

  const filtered =
    filterStatus === "all"
      ? applications
      : applications.filter((a) => a.status === filterStatus);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Applications</h1>
        <p className="text-slate-600 mt-2">Track and manage all your scheme applications</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {["all", "draft", "submitted", "under-review", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
              filterStatus === status
                ? "bg-blue-700 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {status === "all" ? "All" : STATUS_CONFIG[status]?.label}
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((app) => {
            const config = STATUS_CONFIG[app.status];
            return (
              <Link key={app.id} href={`/applications/${app.id}`}>
                <div className="p-5 border border-slate-200 rounded-lg hover:shadow-md hover:border-slate-300 transition cursor-pointer bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-slate-900">{app.schemeName}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
                      {config.label}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-slate-600">Progress</span>
                      <span className="text-slate-900 font-medium">{app.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${app.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-slate-600">
                    {app.submittedAt && (
                      <span>Submitted: {new Date(app.submittedAt).toLocaleDateString()}</span>
                    )}
                    <span>Updated: {new Date(app.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="p-6 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <p className="text-slate-600">No applications found</p>
          </div>
        )}
      </div>

      {applications.length === 0 && (
        <div className="mt-8 p-6 rounded-lg bg-blue-50 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Ready to apply?</h3>
          <p className="text-blue-800 text-sm">Browse available schemes and start your first application</p>
        </div>
      )}
    </div>
  );
}
