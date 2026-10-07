"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"];
const EDUCATION_LEVELS = ["School", "Diploma", "Undergraduate", "Postgraduate"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    name: "",
    age: "",
    gender: "",
    state: "",
    category: "",
    educationLevel: "",
    occupationStatus: "",
    familyIncome: "",
    disability: false,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      // Simulate saving profile to localStorage (can be extended to API)
      localStorage.setItem("userProfile", JSON.stringify(profile));

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = (step / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-8 justify-center">
          <span className="font-bold text-xl text-blue-700">Janसहायक</span>
        </Link>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Step {step} of 4</span>
            <span className="text-sm font-medium text-blue-600">{progressPercent.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Step content */}
        <div className="mb-8">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Let's get started</h2>
              <p className="text-slate-600">Tell us a bit about yourself so we can find the best schemes for you.</p>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Your Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => handleChange("age", e.target.value)}
                  placeholder="Enter your age"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                <select
                  value={profile.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Your Location & Profile</h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                <select
                  value={profile.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select your state</option>
                  {STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category (if applicable)</label>
                <select
                  value={profile.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="disability"
                  checked={profile.disability}
                  onChange={(e) => handleChange("disability", e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="disability" className="text-sm font-medium text-slate-700">
                  I have a disability
                </label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Education & Occupation</h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Education Level</label>
                <select
                  value={profile.educationLevel}
                  onChange={(e) => handleChange("educationLevel", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select education level</option>
                  {EDUCATION_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Current Status</label>
                <select
                  value={profile.occupationStatus}
                  onChange={(e) => handleChange("occupationStatus", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select status</option>
                  <option value="Student">Student</option>
                  <option value="Employed">Employed</option>
                  <option value="Self-employed">Self-employed</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Retired">Retired</option>
                  <option value="Homemaker">Homemaker</option>
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Income & Summary</h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Annual Family Income (Optional)
                </label>
                <select
                  value={profile.familyIncome}
                  onChange={(e) => handleChange("familyIncome", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select income range</option>
                  <option value="Below 1 Lakh">Below ₹1 Lakh</option>
                  <option value="1-3 Lakh">₹1-3 Lakh</option>
                  <option value="3-5 Lakh">₹3-5 Lakh</option>
                  <option value="5-10 Lakh">₹5-10 Lakh</option>
                  <option value="Above 10 Lakh">Above ₹10 Lakh</option>
                  <option value="Prefer not to share">Prefer not to share</option>
                </select>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-slate-900 mb-2">Your Profile Summary</h3>
                <div className="text-sm text-slate-600 space-y-1">
                  <p>Name: {profile.name || "—"}</p>
                  <p>Age: {profile.age || "—"}</p>
                  <p>State: {profile.state || "—"}</p>
                  <p>Status: {profile.occupationStatus || "—"}</p>
                  <p>Income: {profile.familyIncome || "—"}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            disabled={step === 1}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition"
          >
            ← Back
          </button>
          {step < 4 ? (
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Get Started →"}
            </button>
          )}
        </div>

        <p className="text-xs text-center text-slate-500 mt-4">
          Your data is encrypted and will only be used to find relevant schemes.
        </p>
      </div>
    </div>
  );
}
