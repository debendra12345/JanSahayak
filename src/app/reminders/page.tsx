"use client";

import { useEffect, useState } from "react";

interface Reminder {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  type: "deadline" | "update" | "action" | "notification";
  priority: "high" | "medium" | "low";
  completed: boolean;
  relatedSchemeId?: string;
  relatedApplicationId?: string;
}

const DEMO_REMINDERS: Reminder[] = [
  {
    id: "rem-1",
    title: "Submit PM YASASVI Documents",
    description: "Upload your mark sheet and income certificate",
    dueDate: "2025-10-15",
    type: "deadline",
    priority: "high",
    completed: false,
    relatedApplicationId: "app-1",
  },
  {
    id: "rem-2",
    title: "Application Status Update",
    description: "Your CSSS application has moved to stage 2 review",
    dueDate: "2025-10-05",
    type: "update",
    priority: "medium",
    completed: false,
    relatedApplicationId: "app-2",
  },
  {
    id: "rem-3",
    title: "Review New Scholarship",
    description: "A new scholarship matching your profile is now available",
    dueDate: "2025-10-03",
    type: "notification",
    priority: "low",
    completed: true,
  },
];

const TYPE_CONFIG: Record<string, { icon: string; color: string }> = {
  deadline: { icon: "📅", color: "text-red-600" },
  update: { icon: "📢", color: "text-blue-600" },
  action: { icon: "✅", color: "text-green-600" },
  notification: { icon: "🔔", color: "text-yellow-600" },
};

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [filterCompleted, setFilterCompleted] = useState<"all" | boolean>("all");

  useEffect(() => {
    setReminders(DEMO_REMINDERS);
  }, []);

  const filtered =
    filterCompleted === "all"
      ? reminders
      : reminders.filter((r) => r.completed === filterCompleted);

  const handleToggle = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const upcomingCount = reminders.filter(
    (r) => !r.completed && new Date(r.dueDate) > new Date()
  ).length;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Reminders</h1>
        <p className="text-slate-600 mt-2">Stay on top of your scheme applications and deadlines</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{reminders.length}</div>
          <div className="text-xs text-blue-700">Total Reminders</div>
        </div>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{upcomingCount}</div>
          <div className="text-xs text-yellow-700">Upcoming</div>
        </div>
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {reminders.filter((r) => r.completed).length}
          </div>
          <div className="text-xs text-green-700">Completed</div>
        </div>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {reminders.filter((r) => !r.completed && new Date(r.dueDate) < new Date()).length}
          </div>
          <div className="text-xs text-red-700">Overdue</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2">
        {(["all", true, false] as const).map((status) => (
          <button
            key={String(status)}
            onClick={() => setFilterCompleted(status === "all" ? "all" : (status as boolean))}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterCompleted === status
                ? "bg-blue-700 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {status === "all" ? "All" : status ? "Completed" : "Pending"}
          </button>
        ))}
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((reminder) => {
            const config = TYPE_CONFIG[reminder.type];
            const isOverdue = !reminder.completed && new Date(reminder.dueDate) < new Date();

            return (
              <div
                key={reminder.id}
                className={`p-4 border rounded-lg transition ${
                  reminder.completed
                    ? "bg-slate-50 border-slate-200"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={reminder.completed}
                    onChange={() => handleToggle(reminder.id)}
                    className="mt-1 w-5 h-5 rounded accent-blue-600 cursor-pointer"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3
                        className={`font-semibold text-lg ${
                          reminder.completed ? "line-through text-slate-400" : "text-slate-900"
                        }`}
                      >
                        {config.icon} {reminder.title}
                      </h3>
                      {isOverdue && (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">
                          Overdue
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${reminder.completed ? "text-slate-400" : "text-slate-600"}`}>
                      {reminder.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span>Due: {new Date(reminder.dueDate).toLocaleDateString()}</span>
                      <span
                        className={`px-2 py-1 rounded ${
                          reminder.priority === "high"
                            ? "bg-red-100 text-red-700"
                            : reminder.priority === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {reminder.priority.charAt(0).toUpperCase() + reminder.priority.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-6 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <p className="text-slate-600">
              {filterCompleted === "all" ? "No reminders yet" : "No pending reminders"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
