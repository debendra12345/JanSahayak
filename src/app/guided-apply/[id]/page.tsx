"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function GuidedApplyPage() {
  const params = useParams();
  const schemeId = params.id;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4 inline-block">
        ← Back to Dashboard
      </Link>

      <div className="mb-8 mt-4">
        <h1 className="text-3xl font-bold text-slate-900">Guided Application Assistant</h1>
        <p className="text-slate-600 mt-2">Complete your application step-by-step with guidance</p>
      </div>

      {/* Coming Soon */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-3">📋 Application Form</h2>
          <p className="text-blue-800 mb-4">Step-by-step guided form with inline help and validation</p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
            Continue Application
          </button>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-green-900 mb-3">🎥 Video Guide</h2>
          <p className="text-green-800 mb-4">Watch video explanations for each section</p>
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
            Watch Guide
          </button>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-purple-900 mb-3">📸 Screen Share</h2>
          <p className="text-purple-800 mb-4">Share your screen for real-time assistance from an expert</p>
          <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium">
            Request Assistance
          </button>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-orange-900 mb-3">📱 Camera Guide</h2>
          <p className="text-orange-800 mb-4">Use your camera to scan and upload documents</p>
          <button className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium">
            Scan Documents
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-8 bg-white border border-slate-200 rounded-lg p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            {
              q: "How long does the application take?",
              a: "Most applications can be completed in 10-15 minutes with our guided assistant.",
            },
            {
              q: "What documents do I need?",
              a: "Required documents depend on the scheme. Check the scheme details page for specifics.",
            },
            {
              q: "Can I save my progress?",
              a: "Yes, your progress is automatically saved as you complete each step.",
            },
            {
              q: "Is there support available?",
              a: "Yes, use the chat assistant or request screen-sharing support from an expert.",
            },
          ].map((item, idx) => (
            <div key={idx}>
              <h3 className="font-semibold text-slate-900 mb-2">{item.q}</h3>
              <p className="text-slate-600">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
