"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "./NavLinks";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-[var(--background)] border-t border-[var(--color-stone-300)] pb-safe pt-2 px-4 z-50">
      <ul className="flex justify-between items-center h-14">
        {navLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <li key={link.name} className="flex-1">
              <Link
                href={link.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                  isActive
                    ? "text-[var(--color-moss-600)]"
                    : "text-[var(--color-stone-600)] hover:text-[var(--foreground)]"
                )}
              >
                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{link.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
