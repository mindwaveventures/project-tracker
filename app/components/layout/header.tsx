"use client";

import React from "react";
import ThemeToggle from "@/app/components/layout/ThemeToggle/theme-toggle";
import { cn } from "@/lib/utils";
import { MobileSidebar } from "./mobile-sidebar";
import { UserNav } from "./user-nav";
import Search from "./search";
import { useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <header className="sticky inset-x-0 top-0 w-full border-b py-2 bg-background">
      <nav className="flex items-center justify-between px-4 py-2 md:justify-end">
        <div className={cn("block lg:!hidden")}>
          <MobileSidebar />
        </div>
        <div className="flex items-center gap-4">
          <Search />
          <ThemeToggle />
          <UserNav />
        </div>
      </nav>
    </header>
  );
}
