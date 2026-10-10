"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Scheme, UserProfile, MatchedScheme } from "@/lib/types";
import DocumentChecklist from "@/components/DocumentChecklist";
import EligibilityBreakdown from "@/components/EligibilityBreakdown";
import TrustBadge from "@/components/TrustBadge";
import { ScreenSharingPanel } from "@/components/ScreenSharingPanel";
import { CameraGuidancePanel } from "@/components/CameraGuidancePanel";
import ErrorState from "@/components/ErrorState";
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  Clock,
  FileText,
  Share2,
  Bookmark,
  Monitor,
  AlertCircle,
  Bell,
  CheckSquare,
} from "lucide-react";

interface Application {
  id: string;
  schemeName: string;
  applicationNumber: string;
  status: string;
  schemeId: string;
}

interface Reminder {
  id: string;
  title: string;
  date: string;
  schemeId: string;
  status: string;
}

export default function SchemeDetailPage() {
  const params = useParams();
  const schemeId = params.id as string;

  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [matched, setMatched] = useState<MatchedScheme | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedSchemes, setSavedSchemes] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"overview" | "guided" | "tracker" | "reminders">("overview");
  const [currentStep, setCurrentStep] = useState(1);
  const [showScreenSharing, setShowScreenSharing] = useState(false);
  const [showCameraGuidance, setShowCameraGuidance] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderDate, setReminderDate] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        // Fetch scheme details
        const schemeRes = await fetch(`/api/schemes/${schemeId}`);
        const schemeData = await schemeRes.json();
        if (!schemeRes.ok || !schemeData.scheme) {
          throw new Error(schemeData.error || "Scheme not found");
        }
        setScheme(schemeData.scheme);

        // Load user profile and get matching info
        const dashRes = await fetch("/api/dashboard");
        const dashData = await dashRes.json();
        if (dashData.profile) {
          setProfile(dashData.profile);

          // Get matching information
          const matchRes = await fetch("/api/schemes/match", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ profile: JSON.stringify(dashData.profile) }),
          });
          const matchData = (await matchRes.json()) as { matches?: MatchedScheme[] };
          const thisMatch = matchData.matches?.find(
            (m: MatchedScheme) => m.scheme.id === schemeId
          );
          if (thisMatch) {
            setMatched(thisMatch);
          }
        }

        // Load saved schemes from localStorage
        const saved = localStorage.getItem("savedSchemes");
        if (saved) {
          setSavedSchemes(new Set(JSON.parse(saved)));
        }

        // Load applications and reminders for this scheme
        const appData = localStorage.getItem("applications");
        const remData = localStorage.getItem("reminders");
        if (appData) {
          const allApps = JSON.parse(appData) as Application[];
          setApplications(allApps.filter((app: Application) => app.schemeId === schemeId));
        }
        if (remData) {
          const allReminders = JSON.parse(remData) as Reminder[];
          setReminders(allReminders.filter((rem: Reminder) => rem.schemeId === schemeId));
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load scheme details");
      } finally {
        setLoading(false);
      }
    }

    if (schemeId) {
      load();
    }
  }, [schemeId]);

  const toggleSaveScheme = () => {
    const newSaved = new Set(savedSchemes);
    if (newSaved.has(schemeId)) {
      newSaved.delete(schemeId);
    } else {
      newSaved.add(schemeId);
    }
    setSavedSchemes(newSaved);
    localStorage.setItem("savedSchemes", JSON.stringify(Array.from(newSaved)));
  };

  // Demo source verification (in production, fetch from database)
  const verification = scheme ? {
    schemeId: scheme.id,
    officialDomain: new URL(scheme.officialUrl).hostname,
    sourceUrl: scheme.officialUrl,
    isOfficial: scheme.verifiedBy.includes("Government") || scheme.verifiedBy.includes("Ministry"),
    lastVerifiedAt: scheme.lastVerified,
    sourceStatus: "VERIFIED" as const,
    freshnessStatus: "CURRENT" as const,
  } : undefined;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-64 bg-gray-100 rounded animate-pulse" />
          <div className="h-40 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !scheme) {
    return <ErrorState message={error || "Scheme not found"} />;
  }

  const isSaved = savedSchemes.has(schemeId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Scheme Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    Central Government
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{scheme.name}</h1>
                <p className="text-gray-600">{scheme.description}</p>
              </div>
              <div className="flex-shrink-0 flex gap-2">
                <button
                  onClick={toggleSaveScheme}
                  className={`p-2 rounded-lg border transition ${
                    isSaved
                      ? "bg-blue-50 border-blue-300 text-blue-600"
                      : "bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
                  }`}
                  title={isSaved ? "Remove from saved" : "Save this scheme"}
                >
                  <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
                </button>
                <button className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold">Department</p>
                <p className="text-sm text-gray-900 font-medium mt-1">{scheme.department}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold">Category</p>
                <p className="text-sm text-gray-900 font-medium mt-1">{scheme.category}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold">Verified By</p>
                <p className="text-sm text-gray-900 font-medium mt-1">{scheme.verifiedBy}</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex gap-0 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex-1 px-6 py-4 font-medium transition ${
                  activeTab === "overview"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                📋 Overview
              </button>
              <button
                onClick={() => setActiveTab("guided")}
                className={`flex-1 px-6 py-4 font-medium transition ${
                  activeTab === "guided"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                🚀 Guided Application
              </button>
              <button
                onClick={() => setActiveTab("tracker")}
                className={`flex-1 px-6 py-4 font-medium transition ${
                  activeTab === "tracker"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                📊 Tracker
              </button>
              <button
                onClick={() => setActiveTab("reminders")}
                className={`flex-1 px-6 py-4 font-medium transition ${
                  activeTab === "reminders"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                🔔 Reminders
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="p-6">
              {/* OVERVIEW TAB */}
              {activeTab === "overview" && (
                <div className="space-y-6">

                  {/* Trust Badge */}
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-green-900">Official Source Verified</p>
                      <p className="text-xs text-green-700 mt-1">Last verified {new Date(scheme.lastVerified).toLocaleDateString("en-IN")}</p>
                    </div>
                    <TrustBadge verification={verification} compact />
                  </div>

                  {/* Benefits Section */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle2 size={24} className="text-green-600" />
                      <h2 className="text-xl font-bold text-gray-900">What You May Receive</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg">{scheme.benefit}</p>
                  </div>

                  {/* Eligibility Section */}
                  {matched && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Eligibility Assessment</h2>
                      <EligibilityBreakdown
                        reasons={matched.eligibility.reasons}
                        status={matched.eligibility.status as "Eligible" | "Likely Eligible" | "Not Eligible"}
                      />
                    </div>
                  )}

                  {/* Document Checklist */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <FileText size={24} className="text-blue-600" />
                      <h2 className="text-xl font-bold text-gray-900">Documents You May Need</h2>
                    </div>
                    <DocumentChecklist documents={scheme.documents} schemeId={scheme.id} />
                  </div>

                  {/* Application Process */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <Clock size={24} className="text-amber-600" />
                      <h2 className="text-xl font-bold text-gray-900">Application Process</h2>
                    </div>
                    <ol className="space-y-3">
                      {[
                        "Prepare the required documents listed above",
                        "Visit the official application portal",
                        "Create an account or login with your credentials",
                        "Select this scheme from the list of available schemes",
                        "Fill in your personal and eligibility information",
                        "Upload the required documents",
                        "Review your application carefully",
                        "Submit and save your acknowledgement number",
                      ].map((step, idx) => (
                        <li key={idx} className="flex gap-3">
                          <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                            {idx + 1}
                          </span>
                          <span className="text-gray-700 pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Official Portal */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Official Application Portal</h2>
                    <p className="text-gray-600 text-sm mb-4">
                      The official application link below is verified and maintained by the government. JanSahayak will guide you through the process, but all actual applications must be submitted through the official portal.
                    </p>
                    <a
                      href={scheme.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                    >
                      <ExternalLink size={18} />
                      Open Official Portal
                    </a>
                  </div>

                  {/* Call-to-Action Buttons */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Next Steps</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <button
                        onClick={() => setActiveTab("guided")}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition text-center"
                      >
                        🚀 Start Guided Application
                      </button>
                      <button
                        onClick={() => {
                          // Open eligibility modal
                        }}
                        className="px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition"
                      >
                        Check Full Eligibility
                      </button>
                      <button
                        onClick={() => {
                          // Open chat
                        }}
                        className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-semibold transition"
                      >
                        Ask Jansahayak
                      </button>
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-xs text-amber-900">
                      <strong>Important Disclaimer:</strong> JanSahayak provides information assistance only. All final eligibility decisions are made by the government authority. Verify all information on the official website before applying. If you have questions about your eligibility, please contact the scheme's official support channel.
                    </p>
                  </div>
                </div>
              )}

              {/* GUIDED APPLICATION TAB */}
              {activeTab === "guided" && (
                <div className="space-y-6">
                  {/* Step Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900">Application Progress</h3>
                      <span className="text-sm font-medium text-gray-600">Step {currentStep} of 7</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${(currentStep / 7) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-3 gap-1">
                      {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                        <button
                          key={step}
                          onClick={() => setCurrentStep(step)}
                          className={`flex-1 py-2 rounded font-semibold text-sm transition ${
                            currentStep === step
                              ? "bg-blue-600 text-white"
                              : step < currentStep
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {step}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Current Step */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {currentStep === 1 && "Step 1: Open Official Portal"}
                      {currentStep === 2 && "Step 2: Login/Register"}
                      {currentStep === 3 && "Step 3: Personal Information"}
                      {currentStep === 4 && "Step 4: Eligibility Details"}
                      {currentStep === 5 && "Step 5: Document Upload"}
                      {currentStep === 6 && "Step 6: Review Application"}
                      {currentStep === 7 && "Step 7: Submit & Confirmation"}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {currentStep === 1 && "Visit the official government application portal"}
                      {currentStep === 2 && "Create a new account or login with your credentials"}
                      {currentStep === 3 && "Enter your name, email, phone, and address"}
                      {currentStep === 4 && "Fill in your eligibility information"}
                      {currentStep === 5 && "Upload all required documents one by one"}
                      {currentStep === 6 && "Review all your information carefully"}
                      {currentStep === 7 && "Submit and save your application confirmation number"}
                    </p>

                    {/* Quick Actions */}
                    <div className="mt-6 space-y-3">
                      <button
                        onClick={() => setShowScreenSharing(!showScreenSharing)}
                        className="w-full px-4 py-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition flex items-center gap-2"
                      >
                        <Monitor size={18} />
                        📺 Share Screen for Help
                      </button>
                      <button
                        onClick={() => setShowCameraGuidance(!showCameraGuidance)}
                        className="w-full px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg font-medium hover:bg-green-100 transition flex items-center gap-2"
                      >
                        📱 Use Camera Guidance
                      </button>
                      <button
                        onClick={() => setShowFAQ(!showFAQ)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition"
                      >
                        ❓ View FAQ
                      </button>
                    </div>
                  </div>

                  {/* Screen Sharing Panel */}
                  {showScreenSharing && (
                    <ScreenSharingPanel currentStep={currentStep} schemeId={schemeId} />
                  )}

                  {/* Camera Panel */}
                  {showCameraGuidance && (
                    <CameraGuidancePanel currentStep={currentStep} schemeId={schemeId} />
                  )}

                  {/* Navigation */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                      disabled={currentStep === 1}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => setActiveTab("tracker")}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                      Save & Track Application →
                    </button>
                    <button
                      onClick={() => setCurrentStep(Math.min(7, currentStep + 1))}
                      disabled={currentStep === 7}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Next →
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <a
                      href={scheme.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition text-center flex items-center justify-center gap-2"
                    >
                      <ExternalLink size={18} />
                      Apply on Official Portal
                    </a>
                    <button
                      onClick={toggleSaveScheme}
                      className={`px-4 py-3 rounded-lg font-semibold transition ${
                        isSaved
                          ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                          : "bg-gray-100 text-gray-700 border-2 border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      <Bookmark size={18} className="inline mr-2" fill={isSaved ? "currentColor" : "none"} />
                      {isSaved ? "Saved to Dashboard" : "Save to Dashboard"}
                    </button>
                    <button
                      onClick={() => setActiveTab("guided")}
                      className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition text-center flex items-center justify-center gap-2"
                    >
                      🤖 JanSahayak AI Help
                    </button>
                  </div>
                </div>
              )}

              {/* APPLICATION TRACKER TAB */}
              {activeTab === "tracker" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Your Applications</h3>
                    {applications.length > 0 ? (
                      <div className="space-y-4">
                        {applications.map((app, idx) => (
                          <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900">{app.schemeName || scheme.name}</h4>
                                <p className="text-sm text-gray-600 mt-1">Application ID: {app.applicationNumber}</p>
                                <p className="text-sm text-gray-600">Status: <span className="font-medium text-blue-600">{app.status}</span></p>
                              </div>
                              <CheckSquare className="text-blue-600" size={24} />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                        <AlertCircle className="inline text-blue-600 mb-2" size={32} />
                        <p className="text-gray-700 font-medium">No applications started yet</p>
                        <p className="text-gray-600 text-sm mt-1">Complete the guided application above to start tracking</p>
                        <button
                          onClick={() => setActiveTab("guided")}
                          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                        >
                          Start Application
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* REMINDERS TAB */}
              {activeTab === "reminders" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Application Reminders</h3>
                    <button
                      onClick={() => setShowReminderForm(!showReminderForm)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
                    >
                      <Bell size={18} />
                      Add Reminder
                    </button>
                  </div>

                  {/* Reminder Form */}
                  {showReminderForm && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="font-bold text-gray-900 mb-4">Create New Reminder</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Title</label>
                          <input
                            type="text"
                            value={reminderTitle}
                            onChange={(e) => setReminderTitle(e.target.value)}
                            placeholder="e.g., Submit application"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Date</label>
                          <input
                            type="date"
                            value={reminderDate}
                            onChange={(e) => setReminderDate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              if (reminderTitle && reminderDate) {
                                const newReminder = {
                                  id: Date.now().toString(),
                                  title: reminderTitle,
                                  date: reminderDate,
                                  schemeId,
                                  status: "UPCOMING",
                                };
                                const existing = reminders.filter((r) => r.schemeId === schemeId);
                                const all = JSON.parse(localStorage.getItem("reminders") || "[]") as Reminder[];
                                localStorage.setItem("reminders", JSON.stringify([...all.filter((r: Reminder) => r.schemeId !== schemeId), newReminder]));
                                setReminders([...existing, newReminder]);
                                setReminderTitle("");
                                setReminderDate("");
                                setShowReminderForm(false);
                              }
                            }}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                          >
                            Create
                          </button>
                          <button
                            onClick={() => setShowReminderForm(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reminders List */}
                  {reminders.length > 0 ? (
                    <div className="space-y-3">
                      {reminders.map((rem) => (
                        <div key={rem.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{rem.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">📅 {new Date(rem.date).toLocaleDateString("en-IN")}</p>
                          </div>
                          <Bell className="text-blue-600" size={20} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                      <Bell className="inline text-blue-600 mb-2" size={32} />
                      <p className="text-gray-700 font-medium">No reminders set</p>
                      <p className="text-gray-600 text-sm mt-1">Create a reminder to stay on track with your application deadlines</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
