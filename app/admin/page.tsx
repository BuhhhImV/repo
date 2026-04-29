"use client";

import { Users, Settings, BellRing, FileText, Plus, Search } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-[var(--foreground)]">Admin Panel</h1>
        <p className="text-[var(--color-stone-600)] mt-1">Manage property settings, members, and alerts.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Navigation/Overview */}
        <div className="space-y-4">
          <div className="bg-[var(--background)] border border-[var(--color-stone-300)] rounded-[var(--radius-lg)] p-4 shadow-sm flex flex-col gap-2">
            <button className="flex items-center gap-3 w-full p-2 text-left text-sm font-medium bg-[var(--color-moss-100)] text-[var(--color-moss-800)] rounded-[var(--radius-md)]">
              <Settings className="w-4 h-4" /> Property Settings
            </button>
            <button className="flex items-center gap-3 w-full p-2 text-left text-sm font-medium text-[var(--color-stone-600)] hover:bg-[var(--color-stone-50)] rounded-[var(--radius-md)] transition-colors">
              <Users className="w-4 h-4" /> Member Management
            </button>
            <button className="flex items-center gap-3 w-full p-2 text-left text-sm font-medium text-[var(--color-stone-600)] hover:bg-[var(--color-stone-50)] rounded-[var(--radius-md)] transition-colors">
              <BellRing className="w-4 h-4" /> Alerts Config
            </button>
            <button className="flex items-center gap-3 w-full p-2 text-left text-sm font-medium text-[var(--color-stone-600)] hover:bg-[var(--color-stone-50)] rounded-[var(--radius-md)] transition-colors">
              <FileText className="w-4 h-4" /> Audit Log
            </button>
          </div>
        </div>

        {/* Right Column: Content Area (Showing Property Settings as active) */}
        <div className="md:col-span-2 space-y-6">
          <section className="bg-[var(--background)] border border-[var(--color-stone-300)] rounded-[var(--radius-lg)] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--color-stone-300)] bg-[var(--color-stone-50)]">
              <h2 className="font-medium text-[var(--foreground)]">Property Settings</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-[var(--color-stone-600)]">Basic Info</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-[var(--color-stone-600)]">Property Name</label>
                    <input type="text" defaultValue="Sunshine Hostel" className="w-full bg-[var(--background)] border border-[var(--color-stone-300)] rounded-[var(--radius-md)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-moss-600)]/50" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-[var(--color-stone-600)]">Max Occupancy</label>
                    <input type="number" defaultValue={20} className="w-full bg-[var(--background)] border border-[var(--color-stone-300)] rounded-[var(--radius-md)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-moss-600)]/50 font-mono" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[var(--color-stone-300)]">
                <h3 className="text-sm font-medium text-[var(--color-stone-600)]">Credit Rules</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-[var(--color-stone-600)]">Default Earn (Purchase)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-stone-600)] font-mono text-sm">+</span>
                      <input type="number" defaultValue={15} className="w-full bg-[var(--background)] border border-[var(--color-stone-300)] rounded-[var(--radius-md)] pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-moss-600)]/50 font-mono" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-[var(--color-stone-600)]">Default Spend (Checkout)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-stone-600)] font-mono text-sm">−</span>
                      <input type="number" defaultValue={5} className="w-full bg-[var(--background)] border border-[var(--color-stone-300)] rounded-[var(--radius-md)] pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-moss-600)]/50 font-mono" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-[var(--color-stone-600)]">Carry-Forward %</label>
                    <input type="number" defaultValue={80} className="w-full bg-[var(--background)] border border-[var(--color-stone-300)] rounded-[var(--radius-md)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-moss-600)]/50 font-mono" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-[var(--color-stone-600)]">Overdraft Limit</label>
                    <input type="number" defaultValue={-30} className="w-full bg-[var(--background)] border border-[var(--color-stone-300)] rounded-[var(--radius-md)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-moss-600)]/50 font-mono text-[var(--color-crit)]" />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button className="bg-[var(--color-moss-600)] text-white px-6 py-2 rounded-[var(--radius-md)] text-sm font-medium shadow-sm hover:bg-[var(--color-moss-800)] transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
