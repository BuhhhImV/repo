"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Settings, LogOut, PackageMinus, Wrench, ArrowUpRight, ArrowDownRight, CircleDollarSign } from "lucide-react";

export type ProfileHistoryItem = {
  id: string;
  action: string;
  type: "earned" | "spent";
  amount: number;
  balance: number;
  date: string;
  iconType: "PackageMinus" | "Wrench" | "ArrowUpRight" | "ArrowDownRight" | "CircleDollarSign";
};

export type UserInfo = {
  name: string;
  initials: string;
  room: string;
  joined: string;
  balance: number;
  tier: string;
};

export default function ProfileClient({ historyData, userInfo }: { historyData: ProfileHistoryItem[], userInfo: UserInfo }) {
  const [filter, setFilter] = useState("All");

  const history = historyData;

  const filteredHistory = filter === "All"
    ? history
    : history.filter(h => h.type === filter.toLowerCase());

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-8">
      {/* Profile Header */}
      <section className="bg-[var(--background)] border border-[var(--color-stone-300)] rounded-[var(--radius-lg)] p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-sm relative overflow-hidden">
        <Avatar initials={userInfo.initials} role="Member" className="w-24 h-24 text-3xl shrink-0" />
        <div className="flex-1 text-center sm:text-left">
          <h1 className="font-serif text-3xl text-[var(--foreground)]">{userInfo.name}</h1>
          <p className="text-[var(--color-stone-600)] mt-1">{userInfo.room} · Member since {userInfo.joined}</p>
          
          <div className="mt-4 inline-flex items-center gap-3 bg-[var(--color-moss-100)] px-4 py-2 rounded-[var(--radius-full)] border border-[var(--color-moss-600)]/20">
            <span className="font-mono text-xl text-[var(--color-moss-800)] font-bold">{userInfo.balance} cr</span>
            <span className="w-px h-4 bg-[var(--color-moss-800)]/20" />
            <span className="text-sm text-[var(--color-moss-800)] font-medium">{userInfo.tier}</span>
          </div>
        </div>
      </section>

      {/* Credit History */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl text-[var(--foreground)]">Credit History</h2>
          <div className="flex bg-[var(--color-stone-50)] p-1 rounded-[var(--radius-md)] border border-[var(--color-stone-300)]">
            {["All", "Earned", "Spent"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors ${
                  filter === f
                    ? "bg-[var(--background)] shadow-sm text-[var(--foreground)]"
                    : "text-[var(--color-stone-600)] hover:text-[var(--foreground)]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[var(--background)] border border-[var(--color-stone-300)] rounded-[var(--radius-lg)] shadow-sm divide-y divide-[var(--color-stone-300)]">
          {filteredHistory.map((item) => {
            const Icon = {
              PackageMinus,
              Wrench,
              ArrowUpRight,
              ArrowDownRight,
              CircleDollarSign
            }[item.iconType] || CircleDollarSign;

            return (
              <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-[var(--color-stone-50)] transition-colors">
                <div className={`p-2 rounded-full ${item.type === 'earned' ? 'bg-[var(--color-moss-100)] text-[var(--color-moss-800)]' : 'bg-[var(--color-stone-100)] text-[var(--color-stone-600)]'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--foreground)]">{item.action}</p>
                  <p className="text-xs text-[var(--color-stone-600)]">{item.date} · Balance: {item.balance}</p>
                </div>
                <span className={`font-mono text-sm font-medium ${item.type === 'earned' ? 'text-[var(--color-ok)]' : 'text-[var(--color-stone-600)]'}`}>
                  {item.type === 'earned' ? '+' : '−'}{item.amount}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Settings */}
      <section>
        <h2 className="font-serif text-xl text-[var(--foreground)] mb-4">Settings</h2>
        <div className="bg-[var(--background)] border border-[var(--color-stone-300)] rounded-[var(--radius-lg)] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[var(--color-stone-300)] flex items-center justify-between hover:bg-[var(--color-stone-50)] cursor-pointer">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-[var(--color-stone-600)]" />
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">Notification Preferences</p>
                <p className="text-xs text-[var(--color-stone-600)]">Manage alerts for low stock and maintenance</p>
              </div>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between hover:bg-[var(--color-crit)]/5 cursor-pointer text-[var(--color-crit)] group transition-colors">
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5" />
              <div>
                <p className="text-sm font-medium">Leave Property</p>
                <p className="text-xs opacity-80">Requires admin approval</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
