"use client";
import React, { useState } from "react";
import { DashboardNav } from "@/app/components/dashboard-nav";
import { navItems } from "@/constants/data";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useSidebar } from "@/hooks/useSidebar";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();
  const { data: session } = useSession(); // Get session data

  const handleToggle = () => {
    toggle();
  };

  // Conditionally render sidebar only if session exists (i.e., user is logged in)
  if (!session) {
    return null; // Return nothing if user is not logged in
  }

  return (
    <aside
      className={cn(
        `relative  hidden h-screen flex-none border-r bg-card transition-[width] duration-500 md:block`,
        !isMinimized ? "w-72" : "w-[72px]",
        className
      )}
    >
      <div className="hidden p-5 pt-10 lg:block">
        <Link
          href={"https://github.com/Kiranism/next-shadcn-dashboard-starter"}
          target="_blank"
        >
          <Image
            src="/logo.png"
            alt="logoe"
            width={200} // Specify width
            height={100} // Specify height
            priority // Optional: loads the image faster (useful for above-the-fold images)
          />
        </Link>
      </div>
      <ChevronLeft
        className={cn(
          "absolute -right-3 top-10 z-50  cursor-pointer rounded-full border bg-background text-3xl text-foreground",
          isMinimized && "rotate-180"
        )}
        onClick={handleToggle}
      />
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">
            <DashboardNav items={navItems} />
          </div>
        </div>
      </div>
    </aside>
  );
}
