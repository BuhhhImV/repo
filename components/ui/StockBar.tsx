import { cn } from "@/lib/utils";

interface StockBarProps {
  quantity: number;
  maxQuantity: number;
  className?: string;
}

export function StockBar({ quantity, maxQuantity, className }: StockBarProps) {
  const percentage = Math.max(0, Math.min(100, (quantity / maxQuantity) * 100));

  let colorClass = "bg-[var(--color-moss-600)]";
  if (percentage <= 20) {
    colorClass = "bg-[var(--color-crit)]";
  } else if (percentage <= 50) {
    colorClass = "bg-[var(--color-coin-500)]";
  }

  return (
    <div className={cn("w-full h-2 bg-[var(--color-stone-300)] rounded-full overflow-hidden", className)}>
      <div
        className={cn("h-full transition-all duration-300", colorClass)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
