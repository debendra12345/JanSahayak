export default function ErrorState({
  message,
  onRetry,
  compact = false,
}: {
  message: string;
  onRetry?: () => void;
  compact?: boolean;
}) {
  return (
    <div
      className={`animate-fade-in flex flex-col items-center justify-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 text-center ${
        compact ? "p-5" : "p-10"
      }`}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-xl">
        ⚠️
      </span>
      <p className="max-w-md text-sm font-medium text-rose-800">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-full bg-rose-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-800"
        >
          Try again
        </button>
      )}
    </div>
  );
}
