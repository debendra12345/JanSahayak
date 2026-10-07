import { UserProfile } from "@/lib/types";

const FIELD_LABELS: { key: keyof UserProfile; label: string; format?: (v: unknown) => string }[] = [
  { key: "name", label: "Name" },
  { key: "age", label: "Age" },
  { key: "gender", label: "Gender" },
  { key: "state", label: "State" },
  { key: "category", label: "Category" },
  {
    key: "familyIncome",
    label: "Family Income",
    format: (v) => `₹${Number(v).toLocaleString("en-IN")}/yr`,
  },
  { key: "educationLevel", label: "Education" },
  { key: "occupation", label: "Occupation" },
  { key: "disability", label: "Disability", format: (v) => (v ? "Yes" : "No") },
];

export default function ProfileCard({
  profile,
  source,
}: {
  profile: UserProfile;
  source: "ai" | "fallback";
}) {
  const present = FIELD_LABELS.filter(
    (f) => profile[f.key] !== undefined && profile[f.key] !== null
  );

  return (
    <div className="animate-fade-in rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Extracted Profile</h3>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            source === "ai"
              ? "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-600/20"
              : "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-400/20"
          }`}
        >
          {source === "ai" ? "✨ AI-Powered" : "⚡ Instant Mode"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
        {present.map((f) => (
          <div key={f.key}>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {f.label}
            </p>
            <p className="font-medium text-slate-800">
              {f.format ? f.format(profile[f.key]) : String(profile[f.key])}
            </p>
          </div>
        ))}
      </div>
      {present.length === 0 && (
        <p className="text-sm text-slate-500">
          We couldn&apos;t detect specific details — try adding your age,
          education level, category and income.
        </p>
      )}
    </div>
  );
}
