"use client";

import { useEffect, useState } from "react";
import { UserProfile } from "@/lib/types";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/dashboard");
        const data = await res.json();
        if (data.profile) {
          setProfile(data.profile);
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  if (!profile) {
    return (
      <div className="p-6 md:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-slate-200 rounded"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-600 mt-2">View and update your personal information</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{profile.name}</h2>
            <p className="text-slate-600">{profile.age} years old</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Profile Fields */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
              <p className="text-slate-900">{profile.gender || "Not specified"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
              <p className="text-slate-900">{profile.state || "Not specified"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <p className="text-slate-900">{profile.category || "General"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Education Level</label>
              <p className="text-slate-900">{profile.educationLevel || "Not specified"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Occupation Status</label>
              <p className="text-slate-900">{profile.occupationStatus || "Not specified"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Family Annual Income</label>
              <p className="text-slate-900">₹{profile.familyIncome?.toLocaleString() || "Not specified"}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Disability Status</label>
            <p className="text-slate-900">{profile.disability ? "Yes" : "No"}</p>
          </div>
        </div>

        {isEditing && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              Edit functionality will be available in the next update. For now, reset your profile in settings.
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 space-y-3">
        <button className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 transition font-medium">
          Change Password
        </button>
        <button className="w-full px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition font-medium">
          Reset Profile
        </button>
      </div>
    </div>
  );
}
