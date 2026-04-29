"use client";

import { useState } from "react";
import { RequestCard } from "@/components/ui/RequestCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { Avatar } from "@/components/ui/Avatar";
import { Plus, Filter } from "lucide-react";

export type MaintenanceRequest = {
  id: string;
  title: string;
  location: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Open" | "In Progress" | "Done" | "Cancelled";
  submittedBy: string;
  submittedAt: string;
  assignee?: string;
  creditNote?: string;
};

export default function MaintenanceClient({ initialData }: { initialData: MaintenanceRequest[] }) {
  const [activeTab, setActiveTab] = useState("Open");

  const tabs = ["All", "Open", "In Progress", "Done"];

  const filteredRequests = activeTab === "All"
    ? initialData
    : initialData.filter((req) => req.status === activeTab);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-[var(--foreground)]">Maintenance</h1>
        <button className="bg-[var(--color-moss-600)] text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-[var(--color-moss-800)] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Request (−10 cr)</span>
          <span className="sm:hidden">New</span>
        </button>
      </header>

      {/* Toolbar */}
      <div className="border-b border-[var(--color-stone-300)] flex items-center justify-between">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide flex-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-[var(--color-moss-600)] text-[var(--foreground)]"
                  : "border-transparent text-[var(--color-stone-600)] hover:text-[var(--foreground)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button className="text-[var(--color-stone-600)] hover:text-[var(--foreground)] p-2">
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Request List */}
      <div className="space-y-4">
        {filteredRequests.map((req) => (
          <RequestCard
            key={req.id}
            title={req.title}
            location={req.location}
            priority={req.priority}
            submittedBy={req.submittedBy}
            submittedAt={req.submittedAt}
            status={<StatusPill status={req.status} />}
            assignee={req.assignee ? <Avatar initials={req.assignee} role="Admin" /> : undefined}
            creditNote={req.creditNote}
          />
        ))}
        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--color-stone-600)]">Everything looks good — no {activeTab.toLowerCase()} requests.</p>
          </div>
        )}
      </div>
    </div>
  );
}
