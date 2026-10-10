"use client";

import { useEffect, useState } from "react";
import { Reminder, ApplicationTracking } from "@/lib/types";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Plus,
  Filter,
  Calendar,
  Bell,
  X,
  Edit,
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
];

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [applications, setApplications] = useState<ApplicationTracking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | Reminder["status"]>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", reminderDate: "", applicationId: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = localStorage.getItem("reminders");
    setReminders(saved ? JSON.parse(saved) : demoReminders);

    const savedApps = localStorage.getItem("applications");
    if (savedApps) setApplications(JSON.parse(savedApps));

    setLoading(false);
  }, []);

  useEffect(() => {
    if (reminders.length > 0) {
      localStorage.setItem("reminders", JSON.stringify(reminders));
    }
  }, [reminders]);

  const filteredReminders = filter === "all" ? reminders : reminders.filter(r => r.status === filter);
  const upcomingCount = reminders.filter(r => r.status === "UPCOMING").length;
  const completedCount = reminders.filter(r => r.status === "COMPLETED").length;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.reminderDate) newErrors.reminderDate = "Date is required";
    else {
      const date = new Date(formData.reminderDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) newErrors.reminderDate = "Date cannot be in the past";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingId) {
      setReminders(reminders.map(r => 
        r.id === editingId 
          ? { ...r, title: formData.title, description: formData.description, reminderDate: formData.reminderDate }
          : r
      ));
    } else {
      const newReminder: Reminder = {
        id: `rem_${Date.now()}`,
        userId: "user_1",
        applicationId: formData.applicationId || "",
        title: formData.title,
        description: formData.description,
        reminderDate: formData.reminderDate,
        status: "UPCOMING",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setReminders([newReminder, ...reminders]);
    }

    setFormData({ title: "", description: "", reminderDate: "", applicationId: "" });
    setErrors({});
    setEditingId(null);
    setShowModal(false);
  };

  const openCreateModal = () => {
    const today = new Date();
    today.setDate(today.getDate() + 7);
    setFormData({ title: "", description: "", reminderDate: today.toISOString().split("T")[0], applicationId: "" });
    setEditingId(null);
    setShowModal(true);
    setErrors({});
  };

  const openEditModal = (reminder: Reminder) => {
    setFormData({
      title: reminder.title,
      description: reminder.description || "",
      reminderDate: reminder.reminderDate,
      applicationId: reminder.applicationId,
    });
    setEditingId(reminder.id);
    setShowModal(true);
    setErrors({});
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ title: "", description: "", reminderDate: "", applicationId: "" });
    setErrors({});
  };

  const markComplete = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, status: "COMPLETED" as const } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const getStatusIcon = (status: Reminder["status"]) => {
    switch (status) {
      case "UPCOMING": return <Clock size={20} className="text-blue-600" />;
      case "COMPLETED": return <CheckCircle2 size={20} className="text-green-600" />;
      case "DISMISSED": return <AlertCircle size={20} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: Reminder["status"]) => {
    switch (status) {
      case "UPCOMING": return "bg-blue-50 border-blue-200";
      case "COMPLETED": return "bg-green-50 border-green-200";
      case "DISMISSED": return "bg-gray-50 border-gray-200";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  const daysUntil = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
              <Bell size={32} className="text-blue-600" />
              My Reminders
            </h1>
            <p className="text-gray-600">{upcomingCount} upcoming, {completedCount} completed</p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            <Plus size={20} />
            Add Reminder
          </button>
        </div>

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

        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={18} className="text-gray-600" />
            <p className="text-sm font-semibold text-gray-700">Filter</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["all", "UPCOMING", "COMPLETED", "DISMISSED"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  filter === s ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {s === "all" ? "All" : s}
              </button>
            ))}
          </div>
        </div>

        {filteredReminders.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Bell size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No reminders</h3>
            <p className="text-gray-600 mb-6">
              {filter === "all" ? "You don't have any reminders yet." : `No ${filter.toLowerCase()} reminders.`}
            </p>
            <button
              onClick={openCreateModal}
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
                  className={`border rounded-lg p-4 ${getStatusColor(reminder.status)} ${isUrgent ? "ring-2 ring-red-300" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">{getStatusIcon(reminder.status)}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">{reminder.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                      <div className="flex items-center gap-4 mt-3 flex-wrap">
                        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700">
                          <Calendar size={14} />
                          {formatDate(reminder.reminderDate)}
                        </div>
                        {reminder.status === "UPCOMING" && daysDiff >= 0 && (
                          <div
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                              daysDiff === 0 ? "bg-red-100 text-red-700" : daysDiff <= 3 ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {daysDiff === 0 ? "Due today" : `In ${daysDiff} day${daysDiff !== 1 ? "s" : ""}`}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex gap-2">
                      {reminder.status === "UPCOMING" && (
                        <button
                          onClick={() => openEditModal(reminder)}
                          className="p-2 hover:bg-blue-100 rounded-lg text-gray-600 hover:text-blue-700 transition"
                          title="Edit"
                        >
                          <Edit size={20} />
                        </button>
                      )}
                      {reminder.status === "UPCOMING" && (
                        <button
                          onClick={() => markComplete(reminder.id)}
                          className="p-2 hover:bg-green-100 rounded-lg text-gray-600 hover:text-green-700 transition"
                          title="Mark complete"
                        >
                          <CheckCircle2 size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteReminder(reminder.id)}
                        className="p-2 hover:bg-red-100 rounded-lg text-gray-600 hover:text-red-700 transition"
                        title="Delete"
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

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingId ? "Edit Reminder" : "Create New Reminder"}
                </h2>
                <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {applications.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link to Application (optional)
                    </label>
                    <select
                      value={formData.applicationId}
                      onChange={(e) => setFormData({ ...formData, applicationId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">None</option>
                      {applications.map((app) => (
                        <option key={app.id} value={app.id}>
                          {app.schemeName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reminder Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Check application status"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Add details..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reminder Date *
                  </label>
                  <input
                    type="date"
                    value={formData.reminderDate}
                    onChange={(e) => setFormData({ ...formData, reminderDate: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.reminderDate ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.reminderDate && <p className="text-red-600 text-sm mt-1">{errors.reminderDate}</p>}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                  >
                    {editingId ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
