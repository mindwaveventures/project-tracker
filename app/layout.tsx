import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "./components/SessionWrapper";
import Sidebar from "./components/layout/sidebar";
import { Toaster } from "@/components/ui/toaster";
import React from "react";
import Header from "./components/layout/header";
import Providers from "./components/layout/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mediwave time tracker",
  description:
    "Innovative digital transformation strategies for modern businesses.",
};

// Mark the function as async to support `await` inside it
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth(); // Assuming auth is an async function
  return (
    <SessionWrapper>
      <html lang="en">
        <body className={inter.className}>
          <Providers session={session}>
            <Toaster />
            <div className="flex h-screen">
              <Sidebar />
              <main className="flex-1">
                <Header />
                {children}
              </main>
            </div>
          </Providers>
        </body>
      </html>
    </SessionWrapper>
  );
}

async function auth() {
  return { user: null };
}
