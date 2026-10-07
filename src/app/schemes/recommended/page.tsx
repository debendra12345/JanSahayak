"use client";

import { useEffect, useState } from "react";
import BrowseSchemeCard from "@/components/BrowseSchemeCard";
import { Scheme, UserProfile } from "@/lib/types";

interface RecommendedScheme extends Scheme {
  matchScore?: number;
  whyRelevant?: string;
  eligibilityStatus?: string;
}

export default function RecommendedPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendedScheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const dashRes = await fetch("/api/dashboard");
        const dashData = await dashRes.json();
        if (dashData.profile) {
          setProfile(dashData.profile);

          const profileJson = JSON.stringify(dashData.profile);
          const matchRes = await fetch("/api/schemes/match", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ profile: profileJson }),
          });
          const matchData = await matchRes.json();
          if (matchData.matches) {
            const recommended = matchData.matches.map((m: any) => ({
              ...m.scheme,
              matchScore: m.eligibility?.score || 0,
              whyRelevant: m.eligibility?.reasons?.[0]?.detail,
              eligibilityStatus: m.eligibility?.status,
            }));
            setRecommendations(recommended);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Recommended for You</h1>
        <p className="text-slate-600 mt-2">Schemes personalized based on your profile</p>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-slate-200 rounded"></div>
          ))}
        </div>
      ) : recommendations.length > 0 ? (
        <div className="space-y-4">
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
      ) : (
        <div className="p-6 rounded-lg bg-slate-50 border border-slate-200 text-center">
          <p className="text-slate-600">No recommendations yet. Complete your profile to get personalized suggestions.</p>
        </div>
      )}
    </div>
  );
}
