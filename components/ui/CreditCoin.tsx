import { cn } from "@/lib/utils";

interface CreditCoinProps {
  amount: number;
  className?: string;
}

export function CreditCoin({ amount, className }: CreditCoinProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center w-7 h-7 rounded-full bg-[var(--color-coin-500)] text-white font-mono text-sm shadow-sm",
        className
      )}
    >
      {amount}
    </div>
  );
}
