import Link from "next/link";
import { Scheme } from "@/lib/types";

interface BrowseSchemeCardProps {
  scheme: Scheme;
  matchScore?: number;
  whyRelevant?: string;
  eligibilityStatus?: string;
}

export default function BrowseSchemeCard({
  scheme,
  matchScore,
  whyRelevant,
  eligibilityStatus,
}: BrowseSchemeCardProps) {
  return (
    <Link
      href={`/schemes/${scheme.id}`}
      className="group flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-slate-300"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-600">
          {scheme.category}
        </span>
        {matchScore !== undefined && (
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {matchScore}% match
          </span>
        )}
      </div>

      <div>
        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700">
          {scheme.name}
        </h3>
        {scheme.nameHindi && (
          <p className="text-sm text-slate-500">{scheme.nameHindi}</p>
        )}
      </div>

      {whyRelevant && (
        <p className="text-xs text-slate-600 italic">{whyRelevant}</p>
      )}

      <p className="line-clamp-2 text-sm text-slate-600">{scheme.description || scheme.benefit}</p>

      <div className="flex items-center justify-between pt-1">
        <span className="text-sm font-semibold text-emerald-700">{scheme.benefit}</span>
        {matchScore !== undefined && (
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{ width: `${matchScore}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
