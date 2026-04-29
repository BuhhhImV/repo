"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "./NavLinks";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden sm:flex flex-col w-64 h-full border-r border-[var(--color-stone-300)] bg-[var(--background)] p-4">
      <div className="mb-8 px-4">
        <h1 className="font-serif text-2xl text-[var(--foreground)] tracking-tight">Comn</h1>
        <p className="text-xs text-[var(--color-stone-600)]">Shared space. Zero drama.</p>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] transition-colors",
                    isActive
                      ? "bg-[var(--color-moss-100)] text-[var(--color-moss-800)] font-medium"
                      : "text-[var(--color-stone-600)] hover:bg-[var(--color-stone-50)] hover:text-[var(--foreground)]"
                  )}
                >
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  <span>{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Admin Panel Link could go here if user is admin */}
      <div className="mt-auto border-t border-[var(--color-stone-300)] pt-4">
        <Link
          href="/admin"
          className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--color-stone-600)] hover:text-[var(--foreground)] transition-colors"
        >
          Admin Settings
        </Link>
      </div>
    </aside>
  );
}
