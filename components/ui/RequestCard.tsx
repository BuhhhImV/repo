import { cn } from "@/lib/utils";

interface RequestCardProps {
  title: string;
  location: string;
  submittedBy: string;
  submittedAt: string; // "X days ago"
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: React.ReactNode; // e.g., <StatusPill />
  assignee?: React.ReactNode; // e.g., <Avatar />
  creditNote?: string;
  className?: string;
}

export function RequestCard({
  title,
  location,
  submittedBy,
  submittedAt,
  priority,
  status,
  assignee,
  creditNote,
  className,
}: RequestCardProps) {
  let borderClass = "";
  switch (priority) {
    case "Low":
      borderClass = "border-l-[var(--color-stone-600)]";
      break;
    case "Medium":
      borderClass = "border-l-[var(--color-info)]";
      break;
    case "High":
      borderClass = "border-l-[var(--color-warn)]";
      break;
    case "Urgent":
      borderClass = "border-l-[var(--color-crit)]";
      break;
  }

  return (
    <div
      className={cn(
        "bg-[var(--background)] rounded-[var(--radius-lg)] border border-[var(--color-stone-300)] shadow-sm p-4 border-l-4",
        borderClass,
        className
      )}
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="font-medium text-sm text-[var(--foreground)] leading-tight">{title}</h3>
          <p className="text-xs text-[var(--color-stone-600)] mt-1">
            {location} · by {submittedBy} · {submittedAt}
          </p>
        </div>
        {assignee && <div className="flex-shrink-0">{assignee}</div>}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>{status}</div>
        {creditNote && (
          <p className="text-[10px] text-[var(--color-stone-600)] font-medium uppercase tracking-wider">
            {creditNote}
          </p>
        )}
      </div>
    </div>
  );
}
