"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Filter,
} from "lucide-react";

interface Application {
  id: string;
  schemeId: string;
  schemeName: string;
  applicationNumber?: string;
  status: "DRAFT" | "DOCUMENTS_PENDING" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "COMPLETED";
  submittedAt?: string;
  expectedProcessingDays?: number;
  expectedCompletionDate?: string;
  lastUpdated: string;
  nextAction?: string;
}

const statusConfig: Record<Application["status"], { label: string; color: string; bgColor: string; icon: any }> = {
  DRAFT: { label: "Draft", color: "text-gray-700", bgColor: "bg-gray-50", icon: FileText },
  DOCUMENTS_PENDING: { label: "Documents Pending", color: "text-amber-700", bgColor: "bg-amber-50", icon: AlertCircle },
  SUBMITTED: { label: "Submitted", color: "text-blue-700", bgColor: "bg-blue-50", icon: CheckCircle },
  UNDER_REVIEW: { label: "Under Review", color: "text-indigo-700", bgColor: "bg-indigo-50", icon: Clock },
  APPROVED: { label: "Approved", color: "text-green-700", bgColor: "bg-green-50", icon: CheckCircle },
  REJECTED: { label: "Rejected", color: "text-red-700", bgColor: "bg-red-50", icon: AlertCircle },
  COMPLETED: { label: "Completed", color: "text-green-700", bgColor: "bg-green-50", icon: CheckCircle },
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | Application["status"]>("all");

  useEffect(() => {
    // Demo data - in production, fetch from API
    const demoApplications: Application[] = [
      {
        id: "app_1",
        schemeId: "pm-yasasvi",
        schemeName: "PM YASASVI Scholarship",
        applicationNumber: "YASASVI-2026-OCT-12345",
        status: "SUBMITTED",
        submittedAt: "2026-10-05",
        expectedProcessingDays: 30,
        expectedCompletionDate: "2026-11-05",
        lastUpdated: "2026-10-05",
        nextAction: "Check application status around 27 October",
      },
      {
        id: "app_2",
        schemeId: "nsp-post-matric",
        schemeName: "Post Matric Scholarship (NSP)",
        status: "DOCUMENTS_PENDING",
        lastUpdated: "2026-10-03",
        nextAction: "Upload category certificate and income certificate",
      },
      {
        id: "app_3",
        schemeId: "pragati-girls",
        schemeName: "AICTE Pragati Scholarship for Girls",
        status: "DRAFT",
        lastUpdated: "2026-10-01",
        nextAction: "Complete application form and submit",
      },
    ];

    setApplications(demoApplications);
    setLoading(false);
  }, []);

  const filteredApplications =
    filter === "all"
      ? applications
      : applications.filter((app) => app.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="h-10 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track your scheme applications and next steps</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={18} className="text-gray-600" />
            <p className="text-sm font-semibold text-gray-700">Filter by Status</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({applications.length})
            </button>
            {[
              "DRAFT",
              "DOCUMENTS_PENDING",
              "SUBMITTED",
              "UNDER_REVIEW",
              "APPROVED",
            ].map((status) => {
              const count = applications.filter(
                (app) => app.status === (status as Application["status"])
              ).length;
              return (
                <button
                  key={status}
                  onClick={() => setFilter(status as Application["status"])}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    filter === status
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {statusConfig[status as Application["status"]].label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600 mb-6">
              {filter === "all"
                ? "You haven't started any applications yet."
                : `You don't have any ${statusConfig[filter as Application["status"]].label.toLowerCase()} applications.`}
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              Find Schemes
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => {
              const config = statusConfig[app.status];
              const IconComponent = config.icon;

              return (
                <Link key={app.id} href={`/applications/${app.id}`}>
                  <div className={`border border-gray-200 rounded-lg p-6 transition hover:shadow-md cursor-pointer ${config.bgColor}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <IconComponent size={20} className={config.color} />
                          <h3 className="text-lg font-bold text-gray-900">
                            {app.schemeName}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{app.nextAction}</p>

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                          {app.applicationNumber && (
                            <div>
                              <p className="font-semibold">Application ID</p>
                              <p className="text-gray-700">{app.applicationNumber}</p>
                            </div>
                          )}
                          {app.submittedAt && (
                            <div>
                              <p className="font-semibold">Submitted</p>
                              <p className="text-gray-700">
                                {new Date(app.submittedAt).toLocaleDateString("en-IN")}
                              </p>
                            </div>
                          )}
                          {app.expectedCompletionDate && (
                            <div>
                              <p className="font-semibold">Expected Completion</p>
                              <p className="text-gray-700">
                                {new Date(app.expectedCompletionDate).toLocaleDateString("en-IN")}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex-shrink-0">
                        <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${config.bgColor} ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Need help with your application?</h3>
          <p className="text-sm text-blue-800 mb-4">
            JanSahayak's assistant can help you understand the next steps and provide guidance through the process.
          </p>
          <Link
            href="/assistant"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
          >
            Ask JanSahayak
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
