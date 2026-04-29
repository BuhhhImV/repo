import { cn } from "@/lib/utils";

interface AvatarProps {
  initials: string;
  role?: "Admin" | "Member" | "Guest";
  className?: string;
}

export function Avatar({ initials, role = "Member", className }: AvatarProps) {
  const roleColors = {
    Admin: "bg-[var(--color-moss-600)] text-white",
    Member: "bg-[var(--color-info)] text-white",
    Guest: "bg-[var(--color-stone-300)] text-[var(--color-stone-900)]",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium uppercase",
        roleColors[role],
        className
      )}
    >
      {initials.slice(0, 2)}
    </div>
  );
}
