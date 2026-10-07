export function SchemeCardSkeleton() {
  return (
    <div className="animate-fade-in rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="skeleton mb-3 h-4 w-24 rounded-full" />
      <div className="skeleton mb-2 h-5 w-3/4 rounded" />
      <div className="skeleton mb-4 h-4 w-full rounded" />
      <div className="skeleton h-4 w-1/2 rounded" />
    </div>
  );
}

export function TextLineSkeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded ${className}`} />;
}

export default function LoadingGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SchemeCardSkeleton key={i} />
      ))}
    </div>
  );
}
