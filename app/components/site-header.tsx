"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { MenuIcon, SearchIcon, UserCircleIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  // extracting data from usesession as session
  const { data: session } = useSession();

  // checking if sessions exists
  if (session) {
    // rendering components for logged in users
    return (
      <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
        <nav className="flex-1 hidden md:flex gap-6 text-lg font-medium md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
            href="#"
          >
            <SearchIcon className="w-6 h-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>

          <Link
            className={`text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${
              pathname.includes("projects") ? "text-primary" : ""
            }`}
            href="/projects"
          >
            Projects
          </Link>
          <Link
            className={`text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${
              pathname === "/employees" ? "text-primary" : ""
            }`}
            href="/employees"
          >
            Employees
          </Link>
          <Link
            className={`text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${
              pathname === "/roles" ? "text-primary" : ""
            }`}
            href="/roles"
          >
            Roles
          </Link>
          <Link
            className={`text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${
              pathname === "/timesheet" ? "text-primary" : ""
            }`}
            href="/timesheet"
          >
            Timesheet
          </Link>
        </nav>
        <div className="flex items-center gap-4 md:gap-2 lg:gap-4">
          <form className="hidden md:flex flex-1">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                placeholder="Search..."
                type="search"
              />
            </div>
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="w-6 h-6 cursor-pointer">
                <AvatarImage
                  src={session?.user?.image as string}
                  alt={session.user?.name as string}
                  className="w-6 h-6"
                />
                <AvatarFallback>
                  {(session.user?.name as string).charAt(0)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
              <DropdownMenuSeparator /> */}
              <DropdownMenuItem
                onClick={() => {
                  signOut();
                  router.push("/");
                }}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    );
  }
  // rendering components for not logged in users
  return <></>;
}
