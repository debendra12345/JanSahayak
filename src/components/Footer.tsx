export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-slate-500 sm:px-6">
        <p>
          Jan<span className="text-blue-700 font-semibold">सहायक</span> helps
          citizens discover and track government welfare schemes they are
          eligible for. Scheme data is sourced from official government
          portals and refreshed periodically.
        </p>
        <p className="mt-1">
          Built for demonstration purposes — always confirm final eligibility
          on the official scheme portal before applying.
        </p>
      </div>
    </footer>
  );
}
