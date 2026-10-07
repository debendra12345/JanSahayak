export default function VerifiedBadge({
  verifiedBy,
  lastVerified,
}: {
  verifiedBy: string;
  lastVerified: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs font-medium text-blue-800 ring-1 ring-inset ring-blue-600/20">
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-4 w-4 shrink-0 text-blue-700"
      >
        <path
          fillRule="evenodd"
          d="M10 1.5c.3 0 .59.08.85.24l6 3.6c.5.3.8.85.8 1.44v4.72c0 4.1-2.73 7.1-7.03 8.42a1.5 1.5 0 0 1-.84 0C5.58 18.6 2.85 15.6 2.85 11.5V6.78c0-.59.3-1.14.8-1.44l6-3.6c.26-.16.55-.24.85-.24Zm3.36 6.65a.75.75 0 0 0-1.14-.97l-3.3 3.86-1.37-1.37a.75.75 0 1 0-1.06 1.06l1.95 1.95c.3.3.78.28 1.06-.04l3.86-4.49Z"
          clipRule="evenodd"
        />
      </svg>
      <span>
        Verified source — {verifiedBy} · Checked {lastVerified}
      </span>
    </div>
  );
}
