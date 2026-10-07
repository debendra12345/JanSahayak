export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-10 sm:px-6">
      <div className="skeleton h-10 w-48 rounded-full" />
      <div className="skeleton h-20 w-full rounded-2xl" />
      <div className="skeleton h-24 w-full rounded-2xl" />
      <div className="skeleton h-24 w-full rounded-2xl" />
    </div>
  );
}
