"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If the user is already logged in, redirect to dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard"); // Redirect to the dashboard
    }
  }, [status, router]);

  // Show a loading state while session status is being fetched
  if (status === "loading") {
    return <div>Loading...</div>;
  }

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
          <div className="relative z-20 mt-auto"></div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-7 sm:w-[350px]">
            <div className="flex flex-col space-y-4 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Sign in to Weekdays
              </h1>
              <p className="text-sm text-muted-foreground">
                We suggest using the official email address that you use at
                work.
              </p>
            </div>
            <Button onClick={() => signIn("google")}>
              Sign in with Google
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
