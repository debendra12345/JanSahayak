import { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Dashboard - Janसहायक",
  description: "Your personalized civic benefits dashboard",
};

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      {/* Main content area - offset for sidebar on desktop */}
      <main className="flex-1 overflow-auto pt-16 md:pt-0 md:ml-64 bg-slate-50">
        {children}
      </main>
    </div>
  );
}
