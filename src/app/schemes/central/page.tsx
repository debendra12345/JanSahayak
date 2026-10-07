"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BrowseSchemeCard from "@/components/BrowseSchemeCard";
import { Scheme } from "@/lib/types";

const SCHEMES_DATA: Scheme[] = [
  {
    id: "csss-ug-pg",
    name: "Central Sector Scheme of Scholarship (CSSS)",
    nameHindi: "केंद्रीय क्षेत्र छात्रवृत्ति योजना",
    department: "Ministry of Education",
    category: "Scholarship",
    description: "Scholarship for meritorious students pursuing higher education",
    benefit: "₹12,000/year for UG, ₹20,000/year for PG",
    documents: ["Mark sheet", "Income certificate", "ID proof"],
    officialUrl: "https://scholarships.gov.in",
    verifiedBy: "Ministry of Education",
    lastVerified: "2025-10-01",
    rules: {},
  },
  {
    id: "pm-yasasvi",
    name: "PM YASASVI Scholarship",
    nameHindi: "PM YASASVI छात्रवृत्ति",
    department: "Ministry of Social Justice",
    category: "Scholarship",
    description: "Educational assistance for minority students",
    benefit: "Educational assistance for minority students",
    documents: ["Mark sheet", "Income certificate"],
    officialUrl: "https://yasasvi.nta.ac.in",
    verifiedBy: "Ministry of Social Justice",
    lastVerified: "2025-10-01",
    rules: {},
  },
  {
    id: "pm-vidyalakshmi",
    name: "PM Vidyalakshmi Education Loan Scheme",
    nameHindi: "PM विद्यालक्ष्मी शिक्षा ऋण योजना",
    department: "Ministry of Education",
    category: "Financial Aid",
    description: "Educational loans for pursuing higher education",
    benefit: "Educational loans up to ₹10 lakh",
    documents: ["Mark sheet", "Income certificate", "ID proof"],
    officialUrl: "https://www.vidyalakshmi.org",
    verifiedBy: "Ministry of Education",
    lastVerified: "2025-10-01",
    rules: {},
  },
];

export default function CentralSchemesPage() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setSchemes(SCHEMES_DATA);
  }, []);

  const filtered = schemes.filter(
    (s) =>
      (filter === "all" || s.category === filter) &&
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Central Government Schemes</h1>
        <p className="text-slate-600 mt-2">Browse all available central government benefits and schemes</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Search schemes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-2 flex-wrap">
          {["all", "Scholarships", "Education Loans", "Employment"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === cat
                  ? "bg-blue-700 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((scheme) => (
            <BrowseSchemeCard key={scheme.id} scheme={scheme} />
          ))
        ) : (
          <div className="p-6 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <p className="text-slate-600">No schemes found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
