import { createClient } from "@/lib/supabase/server";
import InventoryClient, { InventoryItem } from "./InventoryClient";

export default async function InventoryPage() {
  let initialData: InventoryItem[] = [];

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("inventory_items")
        .select("*")
        .order("name");

      if (data && !error) {
        initialData = data.map((item) => {
          let status: InventoryItem["status"] = "In stock";
          if (item.quantity === 0) status = "Out";
          else if (item.quantity <= (item.min_threshold || 0)) status = "Low";

          return {
            id: item.id,
            name: item.name,
            category: item.category || "Other",
            unit: item.unit || "items",
            qty: item.quantity || 0,
            maxQty: Math.max(item.quantity || 0, (item.min_threshold || 0) * 2), // Mock maxQty since DB doesn't have it
            status,
            updated: "Recently", // You can format item.updated_at here using date-fns
          };
        });
      }
    }
  } catch (error) {
    console.error("Failed to fetch inventory from Supabase:", error);
  }

  // Fallback to mock data if DB is empty or connection fails
  if (initialData.length === 0) {
    initialData = [
      { id: "1", name: "Dish Soap", category: "Kitchen", unit: "bottles", qty: 2, maxQty: 10, status: "Low", updated: "2 days ago by VI" },
      { id: "2", name: "Coffee Pods", category: "Kitchen", unit: "boxes", qty: 0, maxQty: 5, status: "Out", updated: "4 hours ago by AM" },
      { id: "3", name: "Toilet Rolls", category: "Bathroom", unit: "rolls", qty: 24, maxQty: 30, status: "In stock", updated: "1 week ago by PR" },
      { id: "4", name: "Trash Bags", category: "Cleaning", unit: "boxes", qty: 5, maxQty: 10, status: "In stock", updated: "3 days ago by RA" },
    ];
  }

  return <InventoryClient initialData={initialData} />;
}
