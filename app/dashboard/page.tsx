import { Avatar } from "@/components/ui/Avatar";
import { CreditCoin } from "@/components/ui/CreditCoin";
import { Bell, PackageMinus, Wrench, ShoppingBag, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  let stats = {
    totalItems: 42,
    lowOrOut: 5,
    openRequests: 3,
    resolvedMonth: 12,
  };

  let recentActivity = [
    { user: "PR", action: "Priya bought toilet rolls", credits: "+15", color: "text-[var(--color-ok)]" },
    { user: "RA", action: "Ravi logged AC filter replacement", credits: "+20", color: "text-[var(--color-ok)]" },
    { user: "VI", action: "You checked out Dish Soap", credits: "-5", color: "text-[var(--color-stone-600)]" },
    { user: "AM", action: "Amit submitted a maintenance request", credits: "-10", color: "text-[var(--color-stone-600)]" },
  ];

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabase = await createClient();

      // Fetch Inventory Stats
      const { data: invData } = await supabase.from("inventory_items").select("quantity, min_threshold");
      if (invData) {
        stats.totalItems = invData.length;
        stats.lowOrOut = invData.filter((i) => i.quantity <= (i.min_threshold || 0)).length;
      }

      // Fetch Maintenance Stats
      const { data: reqData } = await supabase.from("maintenance_reqs").select("status");
      if (reqData) {
        stats.openRequests = reqData.filter((r) => r.status === "Open" || r.status === "In Progress").length;
        stats.resolvedMonth = reqData.filter((r) => r.status === "Done").length; // simplified for demo
      }

      // Fetch Recent Activity (Credit Txns)
      const { data: txns } = await supabase
        .from("credit_txns")
        .select(`*, user:user_id(raw_user_meta_data)`)
        .order("created_at", { ascending: false })
        .limit(5);

      if (txns && txns.length > 0) {
        recentActivity = txns.map((txn) => {
          const userData = Array.isArray(txn.user) ? txn.user[0] : txn.user;
          const userName = (userData as any)?.raw_user_meta_data?.name || "User";
          const isPositive = txn.amount > 0;
          return {
            user: userName.slice(0, 2).toUpperCase(),
            action: `${userName} ${txn.reason}`,
            credits: `${isPositive ? "+" : "−"}${Math.abs(txn.amount)}`,
            color: isPositive ? "text-[var(--color-ok)]" : "text-[var(--color-stone-600)]",
          };
        });
      }
    }
  } catch (error) {
    console.error("Failed to fetch dashboard data from Supabase:", error);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl text-[var(--foreground)]">Sunshine Hostel</h1>
            <span className="bg-[var(--color-stone-300)] text-[var(--color-stone-900)] text-[10px] px-2 py-0.5 rounded-[var(--radius-sm)] font-medium">
              Unit 4B
            </span>
          </div>
          <p className="text-sm text-[var(--color-stone-600)] mt-1">Good morning, Vivek</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-[var(--color-stone-600)] hover:text-[var(--foreground)] transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[var(--color-crit)] rounded-full border-2 border-[var(--background)]" />
          </button>
          <Avatar initials="VI" role="Member" />
        </div>
      </header>

      {/* Alerts Strip */}
      <div className="space-y-2">
        <div className="bg-[var(--color-warn)]/10 border border-[var(--color-warn)]/20 text-[var(--color-warn)] text-sm px-4 py-3 rounded-[var(--radius-md)] flex justify-between items-center">
          <span>🟡 Dish soap is running low (12% remaining)</span>
          <button className="text-xs font-medium hover:underline">Dismiss</button>
        </div>
        <div className="bg-[var(--color-crit)]/10 border border-[var(--color-crit)]/20 text-[var(--color-crit)] text-sm px-4 py-3 rounded-[var(--radius-md)] flex justify-between items-center">
          <span>🔴 Coffee pods are out of stock</span>
          <button className="text-xs font-medium hover:underline">Dismiss</button>
        </div>
      </div>

      {/* Credit Snapshot Card */}
      <section className="bg-[var(--color-moss-100)] rounded-[var(--radius-lg)] p-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-[var(--color-moss-800)] text-sm font-medium mb-1">Your Balance</p>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-5xl text-[var(--color-moss-800)] tracking-tight">120</span>
              <span className="bg-[var(--color-moss-600)] text-white text-xs px-2 py-0.5 rounded-[var(--radius-sm)] font-medium">
                Contributor
              </span>
            </div>
          </div>
          <button className="bg-white text-[var(--color-moss-800)] px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-[var(--color-stone-50)] transition-colors">
            Earn more +
          </button>
        </div>
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-[var(--color-moss-600)] rounded-full opacity-10 blur-2xl pointer-events-none" />
      </section>

      {/* Stats Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Items in Stock", value: stats.totalItems },
          { label: "Low or Out", value: stats.lowOrOut, color: "text-[var(--color-crit)]" },
          { label: "Open Requests", value: stats.openRequests },
          { label: "Resolved (Month)", value: stats.resolvedMonth, color: "text-[var(--color-ok)]" },
        ].map((stat, i) => (
          <div key={i} className="bg-[var(--background)] border border-[var(--color-stone-300)] rounded-[var(--radius-md)] p-4 shadow-sm">
            <p className="text-xs text-[var(--color-stone-600)] mb-1">{stat.label}</p>
            <p className={`font-mono text-2xl ${stat.color || "text-[var(--foreground)]"}`}>{stat.value}</p>
          </div>
        ))}
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="font-serif text-xl text-[var(--foreground)] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: "Log Supply", icon: PackageMinus, href: "/inventory" },
            { name: "Request Fix", icon: Wrench, href: "/maintenance" },
            { name: "Buy Supplies", icon: ShoppingBag, href: "/inventory" },
            { name: "Leaderboard", icon: Trophy, href: "/leaderboard" },
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <Link
                key={i}
                href={action.href}
                className="flex flex-col items-center justify-center p-4 bg-[var(--color-stone-50)] rounded-[var(--radius-md)] border border-[var(--color-stone-300)] hover:bg-[var(--color-moss-100)] hover:border-[var(--color-moss-600)] hover:text-[var(--color-moss-800)] transition-colors group text-center gap-2"
              >
                <Icon className="w-6 h-6 text-[var(--color-stone-600)] group-hover:text-[var(--color-moss-600)]" />
                <span className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--color-moss-800)]">
                  {action.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Activity Feed */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-serif text-xl text-[var(--foreground)]">Recent Activity</h2>
          <Link href="/profile" className="text-sm text-[var(--color-moss-600)] font-medium flex items-center gap-1 hover:underline">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="bg-[var(--background)] border border-[var(--color-stone-300)] rounded-[var(--radius-lg)] shadow-sm divide-y divide-[var(--color-stone-300)]">
          {recentActivity.map((event, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <Avatar initials={event.user} role="Member" />
              <p className="flex-1 text-sm text-[var(--foreground)]">{event.action}</p>
              <span className={`font-mono text-sm font-medium ${event.color}`}>{event.credits}</span>
            </div>
          ))}
          {recentActivity.length === 0 && (
            <div className="p-4 text-center text-sm text-[var(--color-stone-600)]">No recent activity.</div>
          )}
        </div>
      </section>
    </div>
  );
}
