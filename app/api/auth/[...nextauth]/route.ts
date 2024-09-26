// imports
import { connectToMongoDB } from "@/app/lib/db";
import UserModel from "@/app/model/users";
import NextAuth, { AuthOptions } from "next-auth";

// importing providers
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
        
      await connectToMongoDB(); // Connect to MongoDB

      // Check if the user already exists
      const existingUser = await UserModel.findOne({ email: user.email });

      if (!existingUser) {
        // Create a new user if they don't exist
        const newUser = new UserModel({
          name: user.name,
          email: user.email,
          image_url: user.image,
        });
        await newUser.save();
      }

      return true;
    },
    async session({ session, token, user }) {
      // You can add extra fields to session here
      return session; // Return the session object
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET, // Set your own secret
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
