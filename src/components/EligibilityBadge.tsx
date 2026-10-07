import { EligibilityStatus } from "@/lib/types";

const STYLES: Record<EligibilityStatus, string> = {
  Eligible: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "Likely Eligible": "bg-amber-50 text-amber-700 ring-amber-600/20",
  "Not Eligible": "bg-rose-50 text-rose-700 ring-rose-600/20",
};

const ICONS: Record<EligibilityStatus, string> = {
  Eligible: "✓",
  "Likely Eligible": "~",
  "Not Eligible": "✕",
};

export default function EligibilityBadge({ status }: { status: EligibilityStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${STYLES[status]}`}
    >
      <span>{ICONS[status]}</span>
      {status}
    </span>
  );
}
