import { createClient } from "@/lib/supabase/server";
import ProfileClient, { ProfileHistoryItem, UserInfo } from "./ProfileClient";

export default async function ProfilePage() {
  let userInfo: UserInfo = {
    name: "Vivek Sharma",
    initials: "VI",
    room: "Unit 4B",
    joined: "Jan 2024",
    balance: 120,
    tier: "Contributor",
  };

  let historyData: ProfileHistoryItem[] = [];

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabase = await createClient();
      
      // For demo, we just fetch transactions for the first user we find
      // In a real app, this would use the logged-in user's ID from auth.getUser()
      const { data: users } = await supabase.from("memberships").select("user_id").limit(1);
      const demoUserId = users?.[0]?.user_id;

      if (demoUserId) {
        // Fetch User Info
        const { data: member } = await supabase
          .from("memberships")
          .select("room_number, joined_at, user:user_id(raw_user_meta_data)")
          .eq("user_id", demoUserId)
          .single();

        // Fetch Credit Transactions
        const { data: txns } = await supabase
          .from("credit_txns")
          .select("*")
          .eq("user_id", demoUserId)
          .order("created_at", { ascending: false });

        if (txns && member) {
          const userData = Array.isArray(member.user) ? member.user[0] : member.user;
          const name = (userData as any)?.raw_user_meta_data?.name || "Member";
          let runningBalance = 0;
          
          // Calculate running balance and map history
          // To calculate historical running balance, we process chronologically, but we display reverse-chronologically
          const chronologicalTxns = [...txns].reverse();
          
          const mappedHistory = chronologicalTxns.map((txn) => {
            runningBalance += txn.amount;
            const isEarned = txn.amount > 0;
            let iconType: ProfileHistoryItem["iconType"] = isEarned ? "ArrowUpRight" : "ArrowDownRight";
            if (txn.action_type === "purchase") iconType = "PackageMinus";
            if (txn.action_type === "maintenance_req") iconType = "Wrench";

            return {
              id: txn.id,
              action: txn.reason,
              type: (isEarned ? "earned" : "spent") as "earned" | "spent",
              amount: Math.abs(txn.amount),
              balance: runningBalance,
              date: new Date(txn.created_at).toLocaleDateString(),
              iconType,
            };
          }).reverse(); // Reverse back for UI

          historyData = mappedHistory;

          userInfo = {
            name,
            initials: name.slice(0, 2).toUpperCase(),
            room: member.room_number || "Unassigned",
            joined: new Date(member.joined_at).toLocaleDateString(),
            balance: runningBalance,
            tier: runningBalance > 50 ? "Contributor" : (runningBalance < 0 ? "Overdrawn" : "Active"),
          };
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch profile data from Supabase:", error);
  }

  // Fallback
  if (historyData.length === 0) {
    historyData = [
      { id: "1", action: "Bought Dish Soap", type: "earned", amount: 15, balance: 120, date: "2 days ago", iconType: "PackageMinus" },
      { id: "2", action: "Submitted broken window", type: "spent", amount: 10, balance: 105, date: "1 week ago", iconType: "Wrench" },
      { id: "3", action: "Good citizen bonus", type: "earned", amount: 25, balance: 115, date: "2 weeks ago", iconType: "ArrowUpRight" },
      { id: "4", action: "Checked out Toilet Rolls", type: "spent", amount: 5, balance: 90, date: "3 weeks ago", iconType: "ArrowDownRight" },
    ];
  }

  return <ProfileClient historyData={historyData} userInfo={userInfo} />;
}
