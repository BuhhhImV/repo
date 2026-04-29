"use client";

import { useState } from "react";
import { StockBar } from "@/components/ui/StockBar";
import { StatusPill } from "@/components/ui/StatusPill";
import { Search, Plus, Filter, MoreVertical } from "lucide-react";

export type InventoryItem = {
  id?: string;
  name: string;
  category: string;
  unit: string;
  qty: number;
  maxQty: number;
  status: "In stock" | "Low" | "Out" | "Pending" | "Done";
  updated: string;
};

export default function InventoryClient({ initialData }: { initialData: InventoryItem[] }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Kitchen", "Bathroom", "Cleaning", "Electronics"];

  const filteredInventory = activeCategory === "All" 
    ? initialData 
    : initialData.filter(item => item.category === activeCategory);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-[var(--foreground)]">Inventory</h1>
        <button className="bg-[var(--color-moss-600)] text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-[var(--color-moss-800)] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Item</span>
        </button>
      </header>

      {/* Toolbar */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-stone-600)]" />
          <input
            type="text"
            placeholder="Search supplies..."
            className="w-full bg-[var(--background)] border border-[var(--color-stone-300)] rounded-[var(--radius-md)] pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-moss-600)]/50"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex-shrink-0 p-2 text-[var(--color-stone-600)]">
            <Filter className="w-4 h-4" />
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activeCategory === cat
                  ? "bg-[var(--color-stone-900)] border-[var(--color-stone-900)] text-white dark:bg-white dark:border-white dark:text-black"
                  : "bg-transparent border-[var(--color-stone-300)] text-[var(--color-stone-600)] hover:bg-[var(--color-stone-50)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory List */}
      <div className="space-y-4">
        {filteredInventory.map((item, i) => (
          <div key={i} className="bg-[var(--background)] border border-[var(--color-stone-300)] rounded-[var(--radius-lg)] p-4 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="font-medium text-[var(--foreground)]">{item.name}</h3>
                <p className="text-xs text-[var(--color-stone-600)] mt-0.5">{item.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusPill status={item.status} />
                <button className="text-[var(--color-stone-600)] hover:text-[var(--foreground)] p-1">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[var(--color-stone-600)]">Stock</span>
                  <span className="font-mono text-[var(--foreground)]">{item.qty} / {item.maxQty} {item.unit}</span>
                </div>
                <StockBar quantity={item.qty} maxQuantity={item.maxQty} />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--color-stone-300)]/50">
              <span className="text-[10px] text-[var(--color-stone-600)]">Updated {item.updated}</span>
              <button 
                disabled={item.qty === 0}
                className="bg-[var(--color-stone-100)] text-[var(--foreground)] px-4 py-1.5 rounded-[var(--radius-sm)] text-sm font-medium hover:bg-[var(--color-stone-300)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-[var(--color-stone-300)]"
              >
                Check out
              </button>
            </div>
          </div>
        ))}
        {filteredInventory.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--color-stone-600)]">No items found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
