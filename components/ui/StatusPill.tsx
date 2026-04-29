import { cn } from "@/lib/utils";

type StatusType = "In stock" | "Low" | "Out" | "Pending" | "Done" | "Open" | "In Progress" | "Cancelled";

interface StatusPillProps {
  status: StatusType;
  className?: string;
}

export function StatusPill({ status, className }: StatusPillProps) {
  let colorClass = "";
  switch (status) {
    case "In stock":
    case "Done":
      colorClass = "bg-[var(--color-ok)]/10 text-[var(--color-ok)] border-[var(--color-ok)]/20";
      break;
    case "Low":
    case "Pending":
    case "In Progress":
      colorClass = "bg-[var(--color-warn)]/10 text-[var(--color-warn)] border-[var(--color-warn)]/20";
      break;
    case "Out":
    case "Cancelled":
      colorClass = "bg-[var(--color-crit)]/10 text-[var(--color-crit)] border-[var(--color-crit)]/20";
      break;
    case "Open":
      colorClass = "bg-[var(--color-stone-600)]/10 text-[var(--color-stone-600)] border-[var(--color-stone-300)]";
      break;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-medium border uppercase tracking-wider",
        colorClass,
        className
      )}
    >
      {status}
    </span>
  );
}
