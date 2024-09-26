// types/next-auth.d.ts
import NextAuth from "next-auth";
import { User as NextAuthUser } from "next-auth";

// Extend the NextAuth session interface
declare module "next-auth" {
  interface User {
    role: string; // Add custom properties to the User object
    user_id: string; // Add custom properties to the User object
  }

  interface Session {
    user: User; // Ensure Session's user includes your custom properties
  }
}
