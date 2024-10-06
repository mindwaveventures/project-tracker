import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "./components/SessionWrapper";
import SiteHeader from "./components/site-header";
import { Toaster } from "@/components/ui/toaster";
import Sidebar from "./components/layout/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mediwave time tracker",
  description:
    "Innovative digital transformation strategies for modern businesses.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body className={inter.className}>
          <Toaster />
          <SiteHeader />
          <Sidebar />
          {children}
        </body>
      </html>
    </SessionWrapper>
  );
}
