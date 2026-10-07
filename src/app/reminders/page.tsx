"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Reminder } from "@/lib/types";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ChevronRight,
  Plus,
  Filter,
  Calendar,
  Bell,
} from "lucide-react";

const demoReminders: Reminder[] = [
  {
    id: "rem_1",
    userId: "user_1",
    applicationId: "app_1",
    title: "Check PM YASASVI Application Status",
    description: "It's been 20 days since you submitted. Check the official portal for updates.",
    reminderDate: "2026-10-27",
    status: "UPCOMING",
    createdAt: "2026-10-05",
  },
  {
    id: "rem_2",
    userId: "user_1",
    applicationId: "app_2",
    title: "Upload Category Certificate for NSP",
    description: "Your application is waiting for this document. Upload to proceed.",
    reminderDate: "2026-10-15",
    status: "UPCOMING",
    createdAt: "2026-10-03",
  },
  {
    id: "rem_3",
    userId: "user_1",
    applicationId: "app_3",
    title: "Complete AICTE Pragati Application",
    description: "You've saved the application but haven't submitted yet.",
    reminderDate: "2026-10-20",
    status: "UPCOMING",
    createdAt: "2026-10-01",
  },
  {
    id: "rem_4",
    userId: "user_1",
    applicationId: "app_1",
    title: "PM YASASVI Application Approved!",
    description: "Your application has been approved. Check official portal for next steps.",
    reminderDate: "2026-09-28",
    status: "COMPLETED",
    createdAt: "2026-09-28",
  },
];

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Reminder["status"] | "all">("all");
  const [newReminderModal, setNewReminderModal] = useState(false);

  useEffect(() => {
    // Load reminders from localStorage
    const saved = localStorage.getItem("reminders");
    if (saved) {
      try {
        setReminders(JSON.parse(saved));
      } catch {
        setReminders(demoReminders);
      }
    } else {
      setReminders(demoReminders);
    }
    setLoading(false);
  }, []);

  // Save reminders to localStorage whenever they change
  useEffect(() => {
    if (reminders.length > 0) {
      localStorage.setItem("reminders", JSON.stringify(reminders));
    }
  }, [reminders]);

  const filteredReminders = 
    filter === "all" 
      ? reminders 
      : reminders.filter(r => r.status === filter);

  const upcomingCount = reminders.filter(r => r.status === "UPCOMING").length;
  const completedCount = reminders.filter(r => r.status === "COMPLETED").length;

  const markComplete = (id: string) => {
    setReminders(prev =>
      prev.map(r => r.id === id ? { ...r, status: "COMPLETED" as const } : r)
    );
  };

  const dismiss = (id: string) => {
    setReminders(prev =>
      prev.map(r => r.id === id ? { ...r, status: "DISMISSED" as const } : r)
    );
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const getStatusIcon = (status: Reminder["status"]) => {
    switch (status) {
      case "UPCOMING":
        return <Clock size={20} className="text-blue-600" />;
      case "COMPLETED":
        return <CheckCircle2 size={20} className="text-green-600" />;
      case "DISMISSED":
        return <AlertCircle size={20} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: Reminder["status"]) => {
    switch (status) {
      case "UPCOMING":
        return "bg-blue-50 border-blue-200";
      case "COMPLETED":
        return "bg-green-50 border-green-200";
      case "DISMISSED":
        return "bg-gray-50 border-gray-200";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const daysUntil = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    const diff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="h-10 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Bell size={32} className="text-blue-600" />
                My Reminders
              </h1>
              <p className="text-gray-600 mt-1">
                {upcomingCount} upcoming, {completedCount} completed
              </p>
            </div>
            <button
              onClick={() => setNewReminderModal(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              <Plus size={20} />
              Add Reminder
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-blue-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 font-medium">Upcoming</div>
            <div className="text-3xl font-bold text-blue-600 mt-1">{upcomingCount}</div>
          </div>
          <div className="bg-white border border-green-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 font-medium">Completed</div>
            <div className="text-3xl font-bold text-green-600 mt-1">{completedCount}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 font-medium">Total</div>
            <div className="text-3xl font-bold text-gray-700 mt-1">{reminders.length}</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={18} className="text-gray-600" />
            <p className="text-sm font-semibold text-gray-700">Filter</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["all", "UPCOMING", "COMPLETED", "DISMISSED"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  filter === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status === "all" ? "All" : status}
              </button>
            ))}
          </div>
        </div>

        {/* Reminders List */}
        {filteredReminders.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Bell size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No reminders</h3>
            <p className="text-gray-600 mb-6">
              {filter === "all"
                ? "You don't have any reminders yet."
                : `You don't have any ${filter.toLowerCase()} reminders.`}
            </p>
            <button
              onClick={() => setNewReminderModal(true)}
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              <Plus size={18} />
              Create First Reminder
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReminders.map((reminder) => {
              const daysDiff = daysUntil(reminder.reminderDate);
              const isUrgent = daysDiff <= 3 && reminder.status === "UPCOMING";

              return (
                <div
                  key={reminder.id}
                  className={`border rounded-lg p-4 transition ${getStatusColor(reminder.status)} ${
                    isUrgent ? "ring-2 ring-red-300" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Status Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(reminder.status)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 break-words">
                        {reminder.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {reminder.description}
                      </p>

                      {/* Date & Urgency */}
                      <div className="flex items-center gap-4 mt-3 flex-wrap">
                        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700">
                          <Calendar size={14} />
                          {formatDate(reminder.reminderDate)}
                        </div>
                        {reminder.status === "UPCOMING" && daysDiff >= 0 && (
                          <div
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                              daysDiff === 0
                                ? "bg-red-100 text-red-700"
                                : daysDiff <= 3
                                ? "bg-orange-100 text-orange-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {daysDiff === 0 ? "Due today" : `In ${daysDiff} day${daysDiff !== 1 ? "s" : ""}`}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex gap-2">
                      {reminder.status === "UPCOMING" && (
                        <button
                          onClick={() => markComplete(reminder.id)}
                          className="p-2 hover:bg-green-100 rounded-lg text-gray-600 hover:text-green-700 transition"
                          title="Mark as complete"
                        >
                          <CheckCircle2 size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteReminder(reminder.id)}
                        className="p-2 hover:bg-red-100 rounded-lg text-gray-600 hover:text-red-700 transition"
                        title="Delete reminder"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Pro Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Set reminders for application deadlines to never miss a submission</li>
            <li>• Check your application status regularly using these reminders</li>
            <li>• Mark reminders as complete once you've taken action</li>
            <li>• Use the Add Reminder button to create custom reminders for your schemes</li>
          </ul>
        </div>
      </div>

      {/* New Reminder Modal - Placeholder */}
      {newReminderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-lg">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Create Reminder</h2>
              <p className="text-gray-600 text-sm mb-6">
                Feature coming soon! For now, reminders are created automatically when you submit applications.
              </p>
              <button
                onClick={() => setNewReminderModal(false)}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
