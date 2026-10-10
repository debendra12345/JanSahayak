"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ScreenSharingPanel } from "@/components/ScreenSharingPanel";
import { CameraGuidancePanel } from "@/components/CameraGuidancePanel";
import { Monitor, Camera, ArrowRight, ChevronDown } from "lucide-react";

export default function GuidedApplyPage() {
  const params = useParams();
  const router = useRouter();
  const schemeId = params.id as string;
  const [activeTab, setActiveTab] = useState<"help" | "screen" | "camera">("help");
  const [currentStep, setCurrentStep] = useState(1);
  const [showFAQ, setShowFAQ] = useState(false);

  const steps = [
    {
      number: 1,
      title: "Open Official Portal",
      description: "Visit the official government application portal",
      action: "Click New Application button",
    },
    {
      number: 2,
      title: "Login/Register",
      description: "Sign in or create an account",
      action: "Complete your login with your credentials",
    },
    {
      number: 3,
      title: "Personal Information",
      description: "Fill in your personal details",
      action: "Enter your name, email, phone, and address",
    },
    {
      number: 4,
      title: "Eligibility Information",
      description: "Provide eligibility-related details",
      action: "Enter income, education, and other required information",
    },
    {
      number: 5,
      title: "Document Upload",
      description: "Upload all required documents",
      action: "Upload each document one by one",
    },
    {
      number: 6,
      title: "Review & Submit",
      description: "Review your application and submit",
      action: "Check all details and click Submit",
    },
    {
      number: 7,
      title: "Confirmation",
      description: "Save your application ID",
      action: "Write down your application ID for tracking",
    },
  ];

  const faqItems = [
    {
      q: "What should I do if I'm stuck on a page?",
      a: "Use the Screen Sharing feature to get real-time help. JanSahayak will analyze your screen and provide step-by-step guidance.",
    },
    {
      q: "Will JanSahayak see my password or OTP?",
      a: "No. JanSahayak is designed to never read or process passwords, OTPs, or other sensitive information. You enter those yourself.",
    },
    {
      q: "What if I need to save and come back later?",
      a: "Most government portals auto-save. If yours doesn't, take a screenshot of your progress and come back later.",
    },
    {
      q: "How do I track my application after submission?",
      a: "Go to the Applications section in your dashboard and save the application ID you received. You can check status there.",
    },
    {
      q: "What documents should I have ready?",
      a: "Check the scheme details page for the complete document checklist before you start the application.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <Link
          href={`/schemes/${schemeId}`}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4 inline-block"
        >
          ← Back to Scheme Details
        </Link>

        <div className="mb-8 mt-4">
          <h1 className="text-3xl font-bold text-slate-900">Guided Application Assistant</h1>
          <p className="text-slate-600 mt-2">
            Complete your application step-by-step with real-time guidance
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8 bg-white rounded-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Application Progress</h3>
            <span className="text-sm text-slate-600">Step {currentStep} of 7</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 7) * 100}%` }}
            ></div>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {steps.map((step) => (
              <button
                key={step.number}
                onClick={() => setCurrentStep(step.number)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentStep === step.number
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {step.number}
              </button>
            ))}
          </div>
        </div>

        {/* Main Guidance Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Current Step Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Step {currentStep}: {steps[currentStep - 1].title}
              </h3>
              <p className="text-slate-600 text-sm mb-4">
                {steps[currentStep - 1].description}
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-blue-900 mb-2">What to do:</p>
                <p className="text-sm text-blue-800">{steps[currentStep - 1].action}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className="flex-1 px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => setCurrentStep(Math.min(7, currentStep + 1))}
                  disabled={currentStep === 7}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium flex items-center justify-center gap-1"
                >
                  Next <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-4">Quick Actions</h4>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab("screen")}
                  className="w-full px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition font-medium text-sm flex items-center gap-2"
                >
                  <Monitor size={16} />
                  Share Screen for Help
                </button>
                <button
                  onClick={() => setActiveTab("camera")}
                  className="w-full px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-100 transition font-medium text-sm flex items-center gap-2"
                >
                  <Camera size={16} />
                  Use Camera Guidance
                </button>
                <button
                  onClick={() => setShowFAQ(!showFAQ)}
                  className="w-full px-4 py-2 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium text-sm flex items-center gap-2"
                >
                  <ChevronDown size={16} />
                  View FAQ
                </button>
              </div>
            </div>
          </div>

          {/* Right: Guidance Panels */}
          <div className="lg:col-span-2">
            {activeTab === "help" && (
              <div className="bg-white rounded-lg p-6 border border-slate-200 space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">
                    💡 Tips for This Step
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-900">
                        <span className="font-semibold">Step-by-step:</span> Take your time
                        and fill each field carefully. Make sure your information matches
                        your official documents.
                      </p>
                    </div>
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-900">
                        <span className="font-semibold">Required fields:</span> Fields marked
                        with * are mandatory. Don't leave them blank.
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-900">
                        <span className="font-semibold">Save regularly:</span> Most portals
                        auto-save, but it's good to check if there's a Save button.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Getting Help</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    If you're stuck on this step:
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveTab("screen")}
                      className="block w-full text-left px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm"
                    >
                      → Share your screen for real-time guidance
                    </button>
                    <button
                      onClick={() => setActiveTab("camera")}
                      className="block w-full text-left px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-100 transition text-sm"
                    >
                      → Use camera to show what you see
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "screen" && (
              <ScreenSharingPanel
                schemeId={schemeId}
                currentStep={currentStep}
                onAnalyzed={(guidance) => {
                  console.log("Received guidance:", guidance);
                }}
              />
            )}

            {activeTab === "camera" && (
              <CameraGuidancePanel
                schemeId={schemeId}
                currentStep={currentStep}
                onAnalyzed={(guidance) => {
                  console.log("Received guidance:", guidance);
                }}
              />
            )}
          </div>
        </div>

        {/* FAQ Section */}
        {showFAQ && (
          <div className="mt-8 bg-white border border-slate-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqItems.map((item, idx) => (
                <div key={idx} className="border-b border-slate-200 pb-6 last:border-0 last:pb-0">
                  <h3 className="font-semibold text-slate-900 mb-2">❓ {item.q}</h3>
                  <p className="text-slate-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Action */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">
              Need more detailed help?
            </h3>
            <p className="text-sm text-slate-600">
              Ask JanSahayak for assistance with specific questions about your application
            </p>
          </div>
          <button
            onClick={() => router.push("/assistant")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium whitespace-nowrap ml-4"
          >
            Ask JanSahayak
          </button>
        </div>
      </div>
    </div>
  );
}
