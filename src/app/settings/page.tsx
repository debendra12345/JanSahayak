"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<Record<string, any>>({
    emailNotifications: true,
    pushNotifications: false,
    language: "en",
    theme: "light",
    dataSharing: false,
  });

  const handleToggle = (key: string) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleChange = (key: string, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-2">Manage your preferences and account settings</p>
      </div>

      <div className="space-y-6">
        {/* Notifications */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-slate-900">Email Notifications</label>
                <p className="text-sm text-slate-600">Receive updates via email</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={() => handleToggle("emailNotifications")}
                className="w-5 h-5 rounded accent-blue-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-slate-900">Push Notifications</label>
                <p className="text-sm text-slate-600">Receive browser notifications</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.pushNotifications}
                onChange={() => handleToggle("pushNotifications")}
                className="w-5 h-5 rounded accent-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
              <select
                value={preferences.language}
                onChange={(e) => handleChange("language", e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="mr">मराठी</option>
                <option value="ta">தமிழ்</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
              <div className="flex gap-4">
                {["light", "dark"].map((theme) => (
                  <label key={theme} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      value={theme}
                      checked={preferences.theme === theme}
                      onChange={(e) => handleChange("theme", e.target.value)}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span className="text-slate-700 capitalize">{theme}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Privacy & Data</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-slate-900">Data Sharing</label>
                <p className="text-sm text-slate-600">Share anonymous data to improve services</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.dataSharing}
                onChange={() => handleToggle("dataSharing")}
                className="w-5 h-5 rounded accent-blue-600"
              />
            </div>

            <div className="pt-4 border-t border-slate-200">
              <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View Privacy Policy
              </a>
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Account</h2>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 transition font-medium text-sm">
              Change Password
            </button>
            <button className="w-full px-4 py-2 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 transition font-medium text-sm">
              Two-Factor Authentication
            </button>
            <button className="w-full px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition font-medium text-sm">
              Delete Account
            </button>
          </div>
        </div>

        {/* Save Button */}
        <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
          Save Preferences
        </button>
      </div>
    </div>
  );
}
