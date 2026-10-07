import { EligibilityReason } from "@/lib/types";

const ICONS: Record<string, { icon: string; className: string }> = {
  true: { icon: "✓", className: "bg-emerald-100 text-emerald-700" },
  false: { icon: "✕", className: "bg-rose-100 text-rose-700" },
  unknown: { icon: "?", className: "bg-amber-100 text-amber-700" },
};

export default function EligibilityBreakdown({
  reasons,
}: {
  reasons: EligibilityReason[];
}) {
  return (
    <ul className="space-y-2">
      {reasons.map((r) => {
        const style = ICONS[String(r.passed)];
        return (
          <li
            key={r.criterion}
            className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
          >
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${style.className}`}
            >
              {style.icon}
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800">{r.criterion}</p>
              <p className="text-sm text-slate-600">{r.detail}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
