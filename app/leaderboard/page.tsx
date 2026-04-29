import { createClient } from "@/lib/supabase/server";
import LeaderboardClient, { RankingItem } from "./LeaderboardClient";

export default async function LeaderboardPage() {
  let initialData: RankingItem[] = [];

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabase = await createClient();
      
      // Fetch all credit transactions with users
      const { data: txns, error } = await supabase
        .from("credit_txns")
        .select(`*, user:user_id(id, raw_user_meta_data)`);

      if (txns && !error) {
        // Aggregate credits by user
        const userTotals = new Map<string, { name: string, earned: number, spent: number }>();
        
        txns.forEach((txn) => {
          const userData = Array.isArray(txn.user) ? txn.user[0] : txn.user;
          const userId = userData?.id;
          if (!userId) return;
          
          if (!userTotals.has(userId)) {
            userTotals.set(userId, {
              name: (userData as any)?.raw_user_meta_data?.name || "User",
              earned: 0,
              spent: 0,
            });
          }
          
          const totals = userTotals.get(userId)!;
          if (txn.amount > 0) {
            totals.earned += txn.amount;
          } else {
            totals.spent += Math.abs(txn.amount);
          }
        });

        // Convert Map to Array, calculate net, and sort
        const calculatedRankings = Array.from(userTotals.values()).map(user => {
          const net = user.earned - user.spent;
          let tier = "Active";
          if (net < 0) tier = "Overdrawn";
          else if (net > 50) tier = "Contributor";
          
          return {
            name: user.name,
            initials: user.name.slice(0, 2).toUpperCase(),
            earned: user.earned,
            spent: user.spent,
            net,
            tier,
          };
        });

        calculatedRankings.sort((a, b) => b.net - a.net);

        // Assign ranks
        initialData = calculatedRankings.map((user, index) => ({
          rank: index + 1,
          ...user
        }));
      }
    }
  } catch (error) {
    console.error("Failed to fetch leaderboard data from Supabase:", error);
  }

  // Fallback to mock data
  if (initialData.length === 0) {
    initialData = [
      { rank: 1, name: "Priya", initials: "PR", earned: 120, spent: 20, net: 100, tier: "Contributor" },
      { rank: 2, name: "Ravi", initials: "RA", earned: 95, spent: 10, net: 85, tier: "Active" },
      { rank: 3, name: "Vivek", initials: "VI", earned: 80, spent: 30, net: 50, tier: "Active" },
      { rank: 4, name: "Amit", initials: "AM", earned: 30, spent: 40, net: -10, tier: "Overdrawn" },
    ];
  }

  return <LeaderboardClient initialData={initialData} />;
}
