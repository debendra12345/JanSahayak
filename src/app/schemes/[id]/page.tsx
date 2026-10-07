"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Scheme, UserProfile, MatchedScheme } from "@/lib/types";
import DocumentChecklist from "@/components/DocumentChecklist";
import EligibilityBreakdown from "@/components/EligibilityBreakdown";
import TrustBadge from "@/components/TrustBadge";
import BrowseSchemeCard from "@/components/BrowseSchemeCard";
import ErrorState from "@/components/ErrorState";
import {
  ArrowLeft,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  Share2,
  Bookmark,
} from "lucide-react";

export default function SchemeDetailPage() {
  const params = useParams();
  const schemeId = params.id as string;

  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [matched, setMatched] = useState<MatchedScheme | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedSchemes, setSavedSchemes] = useState<Set<string>>(new Set());

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
          const matchData = await matchRes.json();
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

          {/* Matched Status */}
          {matched && (
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Why This May Be Relevant to You</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Based on your profile (
                    {profile && [
                      profile.educationLevel,
                      profile.state,
                      profile.age && `age ${profile.age}`,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                    ), this scheme appears to match your circumstances. {matched.eligibility.reasons[0]?.detail}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-20 h-20 rounded-lg bg-white border-2 border-blue-300">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">{matched.eligibility.score}</p>
                      <p className="text-xs text-gray-600 font-medium">% Match</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
              <Link
                href={`/guided-apply/${scheme.id}`}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition text-center"
              >
                Start Guided Application
              </Link>
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
      </div>
    </div>
  );
}
