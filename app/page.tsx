// mark as client component
"use client";

import { Button } from "@/components/ui/button";
// importing necessary functions
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  // extracting data from usesession as session
  const { data: session } = useSession();

  // checking if sessions exists
  if (session) {
    // rendering components for logged in users
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <div className="w-44 h-44 relative mb-4">
          <Image
            src={session.user?.image as string}
            fill
            alt=""
            className="object-cover rounded-full"
          />
        </div>
        <p className="text-2xl mb-2">
          Welcome <span className="font-bold">{session.user?.name}</span>.
          Signed In As
        </p>
        <p className="font-bold mb-4">{session.user?.email}</p>
        <p className="font-bold mb-4">{session.user.role}</p>
        <button
          className="bg-red-600 py-2 px-6 rounded-md"
          onClick={() => signOut()}
        >
          Sign out
        </button>
      </div>
    );
  }

  // rendering components for not logged in users
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/authentication-light.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="block dark:hidden"
        />
        <Image
          src="/examples/authentication-dark.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="hidden dark:block"
        />
      </div>
      <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-primary" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            MEDIWAVE
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Innovative digital transformation strategies for modern businesses.&rdquo;
              </p>
              {/* <footer className="text-sm">Sofia Davis</footer> */}
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Log your time on single click
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to create your account
              </p>
              <Button onClick={() => signIn("google")}>Signin with google</Button>
            </div>
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
