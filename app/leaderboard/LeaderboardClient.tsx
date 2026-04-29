"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { CreditCoin } from "@/components/ui/CreditCoin";
import { Trophy } from "lucide-react";

export type RankingItem = {
  rank: number;
  name: string;
  initials: string;
  earned: number;
  spent: number;
  net: number;
  tier: string;
};

export default function LeaderboardClient({ initialData }: { initialData: RankingItem[] }) {
  const [period, setPeriod] = useState("This month");
  const [anonymise, setAnonymise] = useState(false);

  const rankings = initialData;

  const top3 = rankings.slice(0, 3);
  const others = rankings.slice(3);

  const getDisplayName = (name: string, rank: number) => {
    return anonymise ? `Resident #${rank}` : name;
  };

  const getInitials = (initials: string, rank: number) => {
    return anonymise ? `R${rank}` : initials;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-[var(--foreground)]">Leaderboard</h1>
        <div className="flex items-center gap-2">
          <label className="text-sm text-[var(--color-stone-600)] flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={anonymise}
              onChange={(e) => setAnonymise(e.target.checked)}
              className="accent-[var(--color-moss-600)]"
            />
            Anonymise
          </label>
        </div>
      </header>

      {/* Period Selector */}
      <div className="flex bg-[var(--color-stone-50)] p-1 rounded-[var(--radius-lg)] border border-[var(--color-stone-300)]">
        {["This month", "Last month", "All time"].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`flex-1 py-1.5 text-sm font-medium rounded-[var(--radius-md)] transition-colors ${
              period === p
                ? "bg-[var(--background)] shadow-sm text-[var(--foreground)]"
                : "text-[var(--color-stone-600)] hover:text-[var(--foreground)]"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div className="flex items-end justify-center gap-4 py-8">
        {/* 2nd Place */}
        {top3[1] && (
          <div className="flex flex-col items-center gap-2 order-1 opacity-90">
            <Avatar initials={getInitials(top3[1].initials, 2)} role="Member" className="w-12 h-12" />
            <div className="bg-[var(--background)] border border-[var(--color-stone-300)] w-20 h-24 rounded-t-lg flex flex-col items-center justify-start pt-4 shadow-sm">
              <span className="font-mono text-xl text-[var(--color-stone-600)]">2</span>
              <span className="text-xs font-medium mt-2">{getDisplayName(top3[1].name, 2)}</span>
            </div>
          </div>
        )}

        {/* 1st Place */}
        {top3[0] && (
          <div className="flex flex-col items-center gap-2 order-2 z-10">
            <Trophy className="w-6 h-6 text-[var(--color-coin-500)] mb-1" />
            <Avatar initials={getInitials(top3[0].initials, 1)} role="Admin" className="w-16 h-16 border-4 border-[var(--color-moss-100)]" />
            <div className="bg-[var(--color-moss-100)] border border-[var(--color-moss-600)]/20 w-24 h-32 rounded-t-lg flex flex-col items-center justify-start pt-4 shadow-md">
              <span className="font-mono text-3xl text-[var(--color-moss-800)] font-bold">1</span>
              <span className="text-sm font-bold text-[var(--color-moss-800)] mt-2">{getDisplayName(top3[0].name, 1)}</span>
              <span className="text-xs text-[var(--color-moss-800)]/80">{top3[0].net} cr</span>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {top3[2] && (
          <div className="flex flex-col items-center gap-2 order-3 opacity-80">
            <Avatar initials={getInitials(top3[2].initials, 3)} role="Member" className="w-10 h-10" />
            <div className="bg-[var(--background)] border border-[var(--color-stone-300)] w-20 h-20 rounded-t-lg flex flex-col items-center justify-start pt-4 shadow-sm">
              <span className="font-mono text-lg text-[var(--color-stone-600)]">3</span>
              <span className="text-xs font-medium mt-2">{getDisplayName(top3[2].name, 3)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Full Rankings Table */}
      <div className="bg-[var(--background)] rounded-[var(--radius-lg)] border border-[var(--color-stone-300)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--color-stone-50)] text-[var(--color-stone-600)] border-b border-[var(--color-stone-300)]">
              <tr>
                <th className="px-4 py-3 font-medium">Rank</th>
                <th className="px-4 py-3 font-medium">Resident</th>
                <th className="px-4 py-3 font-medium text-right">Earned</th>
                <th className="px-4 py-3 font-medium text-right">Spent</th>
                <th className="px-4 py-3 font-medium text-right">Net</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-stone-300)]">
              {rankings.map((user) => (
                <tr key={user.rank} className="hover:bg-[var(--color-stone-50)] transition-colors">
                  <td className="px-4 py-3 font-mono text-[var(--color-stone-600)]">{user.rank}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar initials={getInitials(user.initials, user.rank)} role={user.rank === 1 ? "Admin" : "Member"} className="w-8 h-8 text-[10px]" />
                      <span className="font-medium text-[var(--foreground)]">{getDisplayName(user.name, user.rank)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-[var(--color-ok)]">+{user.earned}</td>
                  <td className="px-4 py-3 text-right font-mono text-[var(--color-stone-600)]">−{user.spent}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-mono font-medium ${user.net < 0 ? "text-[var(--color-crit)]" : "text-[var(--foreground)]"}`}>
                      {user.net}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
