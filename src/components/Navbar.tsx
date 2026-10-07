import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative h-10 w-10">
            <Image
              src="/jansahayak-logo.png"
              alt="JanSahayak Logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-extrabold tracking-tight text-slate-900">
              Jan<span className="text-orange-600">सहायक</span>
            </span>
            <span className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
              Civic Assistant
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 sm:flex">
          <Link href="/#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            How It Works
          </Link>
          <Link href="/discover" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Schemes
          </Link>
          <Link href="/#about" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/discover"
            className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-orange-700 sm:px-5"
          >
            Find Benefits
          </Link>
        </div>
      </div>
    </header>
  );
}
