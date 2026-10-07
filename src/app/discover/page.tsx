"use client";

import { useState } from "react";
import { MatchedScheme, ProfileExtractionResult } from "@/lib/types";
import { DEMO_PROMPTS } from "@/lib/demoPrompts";
import ProfileCard from "@/components/ProfileCard";
import SchemeCard from "@/components/SchemeCard";
import LoadingGrid, { TextLineSkeleton } from "@/components/Skeletons";
import ErrorState from "@/components/ErrorState";

type Stage = "input" | "extracting" | "matching" | "done";

export default function DiscoverPage() {
  const [text, setText] = useState("");
  const [stage, setStage] = useState<Stage>("input");
  const [extraction, setExtraction] = useState<ProfileExtractionResult | null>(null);
  const [matches, setMatches] = useState<MatchedScheme[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runFlow(inputText: string) {
    setError(null);
    setExtraction(null);
    setMatches(null);
    setStage("extracting");

    try {
      const extractRes = await fetch("/api/profile/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });
      const extractData = await extractRes.json();
      if (!extractRes.ok) {
        throw new Error(extractData?.error ?? "Could not read your profile.");
      }
      setExtraction(extractData);
      try {
        localStorage.setItem(
          "jansahayak_profile",
          JSON.stringify(extractData.profile)
        );
      } catch {
        // localStorage can fail in private browsing — not critical to the flow.
      }
      setStage("matching");

      const matchRes = await fetch("/api/schemes/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: extractData.profile }),
      });
      const matchData = await matchRes.json();
      if (!matchRes.ok) {
        throw new Error(matchData?.error ?? "Could not match schemes.");
      }
      setMatches(matchData.matches);
      setStage("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStage("input");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (text.trim().length < 5) {
      setError("Please write at least a short sentence about yourself.");
      return;
    }
    runFlow(text);
  }

  const eligibleCount =
    matches?.filter((m) => m.eligibility.status !== "Not Eligible").length ?? 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Find My Benefits
        </h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Describe yourself in your own words — age, education, income,
          category — and we&apos;ll match you to real schemes instantly.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <label htmlFor="profile-text" className="sr-only">
          Describe yourself
        </label>
        <textarea
          id="profile-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="e.g. I am a 19 year old female student from Odisha, SC category, family income around 1.5 lakh per year, studying B.Tech."
          className="w-full resize-none rounded-xl border border-slate-300 p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {DEMO_PROMPTS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setText(p.text)}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            >
              💡 {p.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Your details stay on this device and are never shared publicly.
          </span>
          <button
            type="submit"
            disabled={stage === "extracting" || stage === "matching"}
            className="rounded-full bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {stage === "extracting" || stage === "matching"
              ? "Analyzing…"
              : "Find My Benefits →"}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6">
          <ErrorState message={error} onRetry={() => runFlow(text)} compact />
        </div>
      )}

      {stage === "extracting" && (
        <div className="mt-8 space-y-3">
          <TextLineSkeleton className="h-4 w-40" />
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <TextLineSkeleton className="mb-3 h-4 w-32" />
            <div className="grid grid-cols-3 gap-4">
              <TextLineSkeleton className="h-8" />
              <TextLineSkeleton className="h-8" />
              <TextLineSkeleton className="h-8" />
            </div>
          </div>
          <p className="text-center text-sm text-slate-500">
            Reading your profile…
          </p>
        </div>
      )}

      {extraction && (stage === "matching" || stage === "done") && (
        <div className="mt-8">
          <ProfileCard profile={extraction.profile} source={extraction.source} />
        </div>
      )}

      {stage === "matching" && (
        <div className="mt-6 space-y-3">
          <p className="text-center text-sm text-slate-500">
            Matching against verified government schemes…
          </p>
          <LoadingGrid count={3} />
        </div>
      )}

      {stage === "done" && matches && (
        <div className="mt-8 animate-fade-in">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              {eligibleCount > 0
                ? `${eligibleCount} scheme${eligibleCount > 1 ? "s" : ""} worth exploring`
                : "Here's what we found"}
            </h2>
          </div>
          {matches.length === 0 ? (
            <ErrorState message="No schemes matched. Try adding more details to your profile." compact />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {matches.map((m) => (
                <SchemeCard key={m.scheme.id} match={m} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
