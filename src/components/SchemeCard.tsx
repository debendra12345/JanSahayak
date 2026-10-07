import Link from "next/link";
import { MatchedScheme } from "@/lib/types";
import EligibilityBadge from "./EligibilityBadge";

export default function SchemeCard({ match }: { match: MatchedScheme }) {
  const { scheme, eligibility } = match;
  return (
    <Link
      href={`/scheme/${scheme.id}`}
      className="animate-fade-in group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
          {scheme.category}
        </span>
        <EligibilityBadge status={eligibility.status} />
      </div>

      <div>
        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700">
          {scheme.name}
        </h3>
        {scheme.nameHindi && (
          <p className="text-sm text-slate-500">{scheme.nameHindi}</p>
        )}
      </div>

      <p className="line-clamp-2 text-sm text-slate-600">{scheme.description}</p>

      <div className="flex items-center justify-between pt-1">
        <span className="text-sm font-semibold text-emerald-700">
          {scheme.benefit}
        </span>
        <div className="flex items-center gap-1">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600"
              style={{ width: `${eligibility.score}%` }}
            />
          </div>
          <span className="text-xs font-medium text-slate-500">
            {eligibility.score}%
          </span>
        </div>
      </div>
    </Link>
  );
}
