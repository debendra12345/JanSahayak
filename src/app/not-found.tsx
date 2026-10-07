import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-2xl">
        🔍
      </span>
      <h1 className="text-xl font-bold text-slate-900">Page not found</h1>
      <p className="text-sm text-slate-600">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="rounded-full bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
      >
        Go Home
      </Link>
    </div>
  );
}
