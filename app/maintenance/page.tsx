import { createClient } from "@/lib/supabase/server";
import MaintenanceClient, { MaintenanceRequest } from "./MaintenanceClient";

export default async function MaintenancePage() {
  let initialData: MaintenanceRequest[] = [];

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("maintenance_reqs")
        .select(`
          *,
          created_by_user:created_by (raw_user_meta_data),
          assigned_to_user:assigned_to (raw_user_meta_data)
        `)
        .order("created_at", { ascending: false });

      if (data && !error) {
        initialData = data.map((req) => {
          // Fallbacks for join data if raw_user_meta_data isn't accessible via standard select
          // We'd typically use a view or edge function for robust joins on auth.users
          const creatorName = req.created_by_user?.raw_user_meta_data?.name || "User";
          const assigneeName = req.assigned_to_user?.raw_user_meta_data?.name;
          
          return {
            id: req.id,
            title: req.title,
            location: req.location || "General",
            priority: req.priority as MaintenanceRequest["priority"],
            status: req.status as MaintenanceRequest["status"],
            submittedBy: creatorName,
            submittedAt: new Date(req.created_at).toLocaleDateString(), // simplified
            assignee: assigneeName,
            creditNote: req.status === "Done" ? "+20 cr on completion" : "−10 cr spent",
          };
        });
      }
    }
  } catch (error) {
    console.error("Failed to fetch maintenance requests from Supabase:", error);
  }

  // Fallback to mock data
  if (initialData.length === 0) {
    initialData = [
      {
        id: "1",
        title: "Leaking faucet in the master bathroom",
        location: "Bathroom 2",
        priority: "Medium",
        status: "Open",
        submittedBy: "Vivek",
        submittedAt: "2 days ago",
        creditNote: "−10 cr spent",
      },
      {
        id: "2",
        title: "AC not cooling properly",
        location: "Living Room",
        priority: "High",
        status: "In Progress",
        submittedBy: "Priya",
        submittedAt: "1 day ago",
        assignee: "AM",
        creditNote: "−10 cr spent",
      },
      {
        id: "3",
        title: "Broken window lock",
        location: "Bedroom 1",
        priority: "Urgent",
        status: "Done",
        submittedBy: "Ravi",
        submittedAt: "1 week ago",
        assignee: "VI",
        creditNote: "+20 cr on completion",
      },
    ];
  }

  return <MaintenanceClient initialData={initialData} />;
}
