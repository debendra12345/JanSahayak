"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-2xl">
        ⚠️
      </span>
      <h1 className="text-xl font-bold text-slate-900">Something went wrong</h1>
      <p className="text-sm text-slate-600">
        This page ran into an error. Your saved schemes and dashboard data are
        unaffected.
      </p>
      <button
        onClick={reset}
        className="rounded-full bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
      >
        Try again
      </button>
    </div>
  );
}
