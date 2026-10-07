"use client";

import { useEffect, useState, use as usePromise } from "react";
import Link from "next/link";
import {
  EligibilityResult,
  Scheme,
  UserProfile,
} from "@/lib/types";
import EligibilityBadge from "@/components/EligibilityBadge";
import VerifiedBadge from "@/components/VerifiedBadge";
import EligibilityBreakdown from "@/components/EligibilityBreakdown";
import ErrorState from "@/components/ErrorState";
import { TextLineSkeleton } from "@/components/Skeletons";

interface ExplainResponse {
  eligibility: EligibilityResult;
  explanation: { text: string; source: "ai" | "template" };
}

function readStoredProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem("jansahayak_profile");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function SchemeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = usePromise(params);

  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [explainData, setExplainData] = useState<ExplainResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const schemeRes = await fetch(`/api/schemes/${id}`);
      const schemeData = await schemeRes.json();
      if (!schemeRes.ok) throw new Error(schemeData?.error ?? "Scheme not found.");
      setScheme(schemeData.scheme);

      let profile = readStoredProfile();
      if (!profile) {
        try {
          const dashRes = await fetch("/api/dashboard");
          const dashData = await dashRes.json();
          profile = dashData?.profile ?? null;
        } catch {
          profile = null;
        }
      }
      const safeProfile: UserProfile = profile ?? { rawText: "" };

      const explainRes = await fetch(`/api/schemes/${id}/explain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: safeProfile }),
      });
      const explain = await explainRes.json();
      if (!explainRes.ok) throw new Error(explain?.error ?? "Could not evaluate eligibility.");
      setExplainData(explain);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // One-shot data load on mount — intentional, not a reactive sync.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSave() {
    setSaveState("saving");
    try {
      const res = await fetch("/api/dashboard/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schemeId: id }),
      });
      if (!res.ok) throw new Error();
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-10 sm:px-6">
        <TextLineSkeleton className="h-8 w-2/3" />
        <TextLineSkeleton className="h-4 w-full" />
        <TextLineSkeleton className="h-4 w-5/6" />
        <TextLineSkeleton className="h-32 w-full rounded-2xl" />
        <TextLineSkeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <ErrorState
          message={error ?? "This scheme could not be loaded."}
          onRetry={load}
        />
        <div className="mt-4 text-center">
          <Link href="/discover" className="text-sm font-medium text-blue-700 hover:underline">
            ← Back to Find My Benefits
          </Link>
        </div>
      </div>
    );
  }

  const eligibility = explainData?.eligibility;
  const explanation = explainData?.explanation;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/discover" className="text-sm font-medium text-blue-700 hover:underline">
        ← Back to matches
      </Link>

      <div className="mt-4 animate-fade-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
              {scheme.category}
            </span>
            <h1 className="mt-2 text-2xl font-extrabold text-slate-900">{scheme.name}</h1>
            {scheme.nameHindi && <p className="text-slate-500">{scheme.nameHindi}</p>}
          </div>
          {eligibility && <EligibilityBadge status={eligibility.status} />}
        </div>

        <p className="mt-4 text-sm text-slate-600">{scheme.description}</p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            {scheme.benefit}
          </span>
          <VerifiedBadge verifiedBy={scheme.verifiedBy} lastVerified={scheme.lastVerified} />
        </div>
      </div>

      {/* Eligibility reasoning */}
      <div className="mt-6 animate-fade-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-bold text-slate-900">Why you qualify</h2>
        {explanation && (
          <div className="mb-4 rounded-xl bg-blue-50 p-4 text-sm text-slate-700">
            <div className="mb-1 flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  explanation.source === "ai"
                    ? "bg-violet-100 text-violet-700"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {explanation.source === "ai" ? "✨ AI Explanation" : "⚡ Instant Explanation"}
              </span>
            </div>
            <p>{explanation.text}</p>
          </div>
        )}
        {eligibility && (
          <EligibilityBreakdown 
            reasons={eligibility.reasons} 
            status={eligibility.status as "Eligible" | "Likely Eligible" | "Not Eligible"}
          />
        )}
      </div>

      {/* Documents */}
      <div className="mt-6 animate-fade-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-bold text-slate-900">Documents you&apos;ll need</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {scheme.documents.map((doc) => (
            <li key={doc} className="flex items-center gap-2 text-sm text-slate-700">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs">
                📄
              </span>
              {doc}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          href={scheme.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-full bg-blue-700 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
        >
          Apply on Official Portal ↗
        </a>
        <button
          onClick={handleSave}
          disabled={saveState === "saving" || saveState === "saved"}
          className="flex-1 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed"
        >
          {saveState === "saved"
            ? "✓ Saved to Dashboard"
            : saveState === "saving"
            ? "Saving…"
            : saveState === "error"
            ? "Retry Save"
            : "Save to Dashboard"}
        </button>
      </div>
      {saveState === "saved" && (
        <p className="mt-3 text-center text-sm text-emerald-700">
          Saved! Track its status from your{" "}
          <Link href="/dashboard" className="font-semibold underline">
            dashboard
          </Link>
          .
        </p>
      )}
    </div>
  );
}
