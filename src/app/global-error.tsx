"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-2xl">
          ⚠️
        </span>
        <h1 className="text-xl font-bold text-slate-900">
          Janसहायक hit an unexpected error
        </h1>
        <p className="max-w-sm text-sm text-slate-600">
          Don&apos;t worry — your saved schemes are safe. Please try again.
        </p>
        <button
          onClick={reset}
          className="rounded-full bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Reload
        </button>
      </body>
    </html>
  );
}
