export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-10 sm:px-6">
      <div className="skeleton h-8 w-2/3 rounded" />
      <div className="skeleton h-32 w-full rounded-2xl" />
      <div className="skeleton h-48 w-full rounded-2xl" />
    </div>
  );
}
