import Link from "next/link";
import { SCHEMES } from "@/lib/schemes-data";

const STEPS = [
  {
    title: "Tell us about yourself",
    body: "Describe your age, education, income and category in plain language — no forms.",
  },
  {
    title: "Instant profile extraction",
    body: "Janसहायक structures your details automatically, powered by AI with an offline fallback.",
  },
  {
    title: "See matched schemes",
    body: "We check real eligibility rules against official schemes and rank your best matches.",
  },
  {
    title: "Apply with confidence",
    body: "Every scheme links to its verified government portal plus the exact documents you'll need.",
  },
];

const WHY_ITEMS = [
  {
    icon: "🔍",
    title: "Discover",
    body: "Find government schemes relevant to your situation.",
  },
  {
    icon: "📖",
    title: "Understand",
    body: "Get complicated eligibility information in simple language.",
  },
  {
    icon: "🛡️",
    title: "Verify",
    body: "See official sources and verification status.",
  },
  {
    icon: "✓",
    title: "Act",
    body: "Know what documents you need and what to do next.",
  },
];

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-slate-50 via-white to-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-1.5 text-xs font-semibold text-orange-700 ring-1 ring-inset ring-orange-600/20">
            🇮🇳 Your Personal Civic Assistant
          </span>
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Government benefits shouldn't be{" "}
            <span className="bg-gradient-to-r from-orange-600 to-blue-900 bg-clip-text text-transparent">
              difficult to find
            </span>
          </h1>
          <p className="max-w-xl text-base text-slate-600 sm:text-lg">
            Tell Jan<span className="font-semibold text-orange-600">सहायक</span> about your situation. We'll help you
            discover relevant government schemes, understand eligibility,
            verify official sources, and know what to do next.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/discover"
              className="rounded-lg bg-orange-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-orange-600/20 transition hover:-translate-y-0.5 hover:bg-orange-700"
            >
              Find My Benefits →
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-lg border border-slate-300 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              How It Works
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-slate-500">
            <span>✓ {SCHEMES.length} verified schemes</span>
            <span>✓ No sign-up required</span>
            <span>✓ Works fully offline</span>
          </div>
        </div>
      </section>

      {/* Why JanSahayak Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Why Janसहायक?
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
            We built Janसहायक because government information shouldn't
            require a lawyer to understand.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_ITEMS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            How Janसहायक works
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-slate-600">
            Four simple steps from a sentence about yourself to a verified,
            ready-to-apply benefit.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <p className="text-3xl font-extrabold text-orange-600">{SCHEMES.length}</p>
            <p className="mt-1 text-sm text-slate-600">Government schemes tracked</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <p className="text-3xl font-extrabold text-blue-900">100%</p>
            <p className="mt-1 text-sm text-slate-600">Rule-based, explainable eligibility</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <p className="text-3xl font-extrabold text-green-700">0₹</p>
            <p className="mt-1 text-sm text-slate-600">Free, no account required</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Ready to find what you qualify for?
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            It takes less than a minute. Try now.
          </p>
          <Link
            href="/discover"
            className="mt-6 inline-block rounded-lg bg-orange-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-orange-600/20 transition hover:-translate-y-0.5 hover:bg-orange-700"
          >
            Find My Benefits →
          </Link>
        </div>
      </section>
    </div>
  );
}
