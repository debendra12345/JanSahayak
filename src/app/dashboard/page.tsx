"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Scheme, UserProfile } from "@/lib/types";
import ErrorState from "@/components/ErrorState";
import BrowseSchemeCard from "@/components/BrowseSchemeCard";

interface RecommendedScheme extends Scheme {
  matchScore?: number;
  whyRelevant?: string;
  eligibilityStatus?: string;
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendedScheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      // Load profile
      const dashRes = await fetch("/api/dashboard");
      const dashData = await dashRes.json();
      if (!dashRes.ok) throw new Error(dashData?.error ?? "Could not load profile");

      if (dashData.profile) {
        setProfile(dashData.profile);

        // Get recommendations based on profile
        const profileJson = JSON.stringify(dashData.profile);
        const matchRes = await fetch("/api/schemes/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile: profileJson }),
        });
        const matchData = await matchRes.json();
        if (matchRes.ok && matchData.matches) {
          const recommended = matchData.matches
            .map((m: any) => ({
              ...m.scheme,
              matchScore: m.eligibility?.score || 0,
              whyRelevant: m.eligibility?.reasons?.[0]?.detail || "Your profile matches this scheme",
              eligibilityStatus: m.eligibility?.status || "Check eligibility",
            }))
            .slice(0, 5);
          setRecommendations(recommended);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          <div className="mt-8 grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      {profile ? (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Good morning, {profile.name || "Friend"}!
          </h1>
          <p className="text-slate-600 mt-2">
            Find government benefits and services that may be relevant to you.
          </p>
        </div>
      ) : (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Welcome to Janसहायक</h1>
          <p className="text-slate-600 mt-2">
            Let&apos;s find the government benefits you deserve.
          </p>
        </div>
      )}

      {/* Search bar + Profile completion */}
      <div className="mb-8 grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <input
            type="text"
            placeholder="Search schemes or describe what you need..."
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {profile && (
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-xs font-semibold text-blue-900 mb-2">Profile completion</p>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "80%" }}></div>
            </div>
            <p className="text-xs text-blue-700 mt-2">80%</p>
          </div>
        )}
      </div>

      {/* No profile - onboarding prompt */}
      {!profile && !error && (
        <div className="mb-8 p-6 rounded-lg bg-amber-50 border border-amber-200">
          <h2 className="font-semibold text-amber-900 mb-2">Complete your profile to unlock personalized recommendations</h2>
          <Link
            href="/onboarding"
            className="inline-block mt-3 px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition"
          >
            Complete Profile →
          </Link>
        </div>
      )}

      {error && <ErrorState message={error} onRetry={load} />}

      {/* Recommended for You */}
      {profile && recommendations.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">⭐ Recommended for You</h2>
            <Link href="/schemes/recommended" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View all →
            </Link>
          </div>
          <div className="grid gap-4">
            {recommendations.map((scheme) => (
              <BrowseSchemeCard
                key={scheme.id}
                scheme={scheme}
                matchScore={scheme.matchScore}
                whyRelevant={scheme.whyRelevant}
                eligibilityStatus={scheme.eligibilityStatus}
              />
            ))}
          </div>
        </section>
      )}

      {profile && recommendations.length === 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-4">⭐ Recommended for You</h2>
          <div className="p-6 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <p className="text-slate-600 mb-3">We&apos;re analyzing your profile to find matching schemes...</p>
            <Link
              href="/schemes/central"
              className="inline-block px-4 py-2 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition"
            >
              Explore Popular Schemes →
            </Link>
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section className="mb-12">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Link
            href="/schemes/central"
            className="p-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition text-center font-medium text-slate-700"
          >
            🏛️ Central Schemes
          </Link>
          <Link
            href="/schemes/state"
            className="p-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition text-center font-medium text-slate-700"
          >
            🏢 State Schemes
          </Link>
          <Link
            href="/applications"
            className="p-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition text-center font-medium text-slate-700"
          >
            📋 Applications
          </Link>
          <Link
            href="/reminders"
            className="p-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition text-center font-medium text-slate-700"
          >
            🔔 Reminders
          </Link>
          <Link
            href="/assistant"
            className="p-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition text-center font-medium text-slate-700"
          >
            💬 Ask Help
          </Link>
        </div>
      </section>

      {/* Trust message */}
      <section className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-600">
        <strong>🛡️ Janसहायक Trust Layer</strong>
        <p className="mt-2">
          ✓ Government sources verified • ✓ Eligibility based on published criteria • ✓ Official application routes clearly identified
        </p>
        <p className="mt-2 text-slate-500">
          JanSahayak assists you. Final eligibility and approval are determined by the concerned government authority.
        </p>
      </section>
    </div>
  );
}

