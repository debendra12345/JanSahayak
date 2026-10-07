import LoadingGrid from "@/components/Skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="skeleton mb-8 h-10 w-64 rounded-full" />
      <div className="skeleton h-40 rounded-2xl" />
      <div className="mt-8">
        <LoadingGrid count={3} />
      </div>
    </div>
  );
}
