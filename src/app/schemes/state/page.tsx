"use client";

import { useEffect, useState } from "react";
import BrowseSchemeCard from "@/components/BrowseSchemeCard";
import { Scheme, UserProfile } from "@/lib/types";

const STATE_SCHEMES: { [key: string]: Scheme[] } = {
  "Maharashtra": [
    {
      id: "mh-shikshan-yatra",
      name: "Shikshan Yatra Scholarship",
      nameHindi: "शिक्षण यात्रा छात्रवृत्ति",
      department: "Maharashtra Education Department",
      category: "Scholarship",
      description: "Scholarship for meritorious students",
      benefit: "₹5,000 - ₹15,000 for meritorious students",
      documents: ["Mark sheet"],
      officialUrl: "https://scholarships.maharashtra.gov.in",
      verifiedBy: "Maharashtra Education Department",
      lastVerified: "2025-10-01",
      rules: {},
    },
  ],
  "Karnataka": [
    {
      id: "kar-vidyarthi-scheme",
      name: "Vidyarthi Scholarship Scheme",
      nameHindi: "विद्यार्थी छात्रवृत्ति योजना",
      department: "Karnataka Education Department",
      category: "Scholarship",
      description: "Educational assistance for merit students",
      benefit: "Educational assistance for merit students",
      documents: ["Mark sheet", "Income certificate"],
      officialUrl: "https://scholarships.karnataka.gov.in",
      verifiedBy: "Karnataka Education Department",
      lastVerified: "2025-10-01",
      rules: {},
    },
  ],
  "Tamil Nadu": [
    {
      id: "tn-adi-dravidar",
      name: "Adi-Dravidar Scholarship",
      nameHindi: "आदि-द्रविड़ छात्रवृत्ति",
      department: "Tamil Nadu Social Welfare",
      category: "Scholarship",
      description: "Educational support for SC/ST students",
      benefit: "Educational support for SC/ST students",
      documents: ["Mark sheet", "Caste certificate"],
      officialUrl: "https://tnscholarship.tn.gov.in",
      verifiedBy: "Tamil Nadu Social Welfare",
      lastVerified: "2025-10-01",
      rules: {},
    },
  ],
};

const STATES = Object.keys(STATE_SCHEMES);

export default function StateSchemesPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedState, setSelectedState] = useState<string>("");
  const [schemes, setSchemes] = useState<Scheme[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const dashRes = await fetch("/api/dashboard");
        const dashData = await dashRes.json();
        if (dashData.profile) {
          setProfile(dashData.profile);
          setSelectedState(dashData.profile.state || STATES[0] || "");
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (selectedState) {
      setSchemes(STATE_SCHEMES[selectedState] || []);
    }
  }, [selectedState]);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">State Government Schemes</h1>
        <p className="text-slate-600 mt-2">Browse schemes specific to your state</p>
      </div>

      {/* State Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">Select State</label>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="w-full md:w-96 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      {/* Schemes */}
      <div className="space-y-4">
        {schemes.length > 0 ? (
          schemes.map((scheme) => (
            <BrowseSchemeCard key={scheme.id} scheme={scheme} />
          ))
        ) : (
          <div className="p-6 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <p className="text-slate-600">No schemes available for this state yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
