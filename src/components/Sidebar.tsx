"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname() || "";
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  type NavItem = 
    | { path: string; label: string; icon: string }
    | { section: string; items: { path: string; label: string; icon: string }[] };

  const navItems: NavItem[] = [
    { path: "/dashboard", label: "Dashboard", icon: "🏠" },
    { section: "RECOMMEND", items: [
      { path: "/schemes/recommended", label: "Recommended for You", icon: "⭐" },
    ]},
    { section: "SCHEMES", items: [
      { path: "/schemes/central", label: "Central Government", icon: "🏛️" },
      { path: "/schemes/state", label: "State Government", icon: "🏢" },
    ]},
    { section: "YOUR ACTIVITY", items: [
      { path: "/applications", label: "Applications", icon: "📋" },
      { path: "/reminders", label: "Reminders", icon: "🔔" },
    ]},
    { section: "ASSISTANCE", items: [
      { path: "/assistant", label: "Ask Janसहायक", icon: "💬" },
    ]},
  ];

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white border border-slate-200 rounded-lg p-2"
      >
        ☰
      </button>

      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 p-6 overflow-y-auto transition-all z-40 md:z-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="relative w-10 h-10">
            <Image
              src="/jansahayak-logo.png"
              alt="Janसहायक"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-bold text-slate-900 text-sm">Janसहायक</span>
        </Link>

        {/* Nav Items */}
        <div className="space-y-6">
          {navItems.map((item, idx) => {
            if ("path" in item) {
              const active = isActive(item.path);
              return (
                <Link
                  key={idx}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    active
                      ? "bg-blue-50 text-blue-700 border-l-2 border-blue-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              );
            } else {
              return (
                <div key={idx}>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-3 mb-2">
                    {item.section}
                  </h3>
                  <div className="space-y-1">
                    {item.items.map((subitem, subidx) => {
                      const active = isActive(subitem.path);
                      return (
                        <Link
                          key={subidx}
                          href={subitem.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                            active
                              ? "bg-blue-50 text-blue-700 border-l-2 border-blue-700"
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <span className="text-lg">{subitem.icon}</span>
                          {subitem.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }
          })}
        </div>

        {/* Footer nav */}
        <div className="absolute bottom-6 left-6 right-6 space-y-2 border-t border-slate-200 pt-6">
          <Link
            href="/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            👤 Profile
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            ⚙️ Settings
          </Link>
        </div>
      </nav>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
