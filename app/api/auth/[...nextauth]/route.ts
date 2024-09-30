// imports
import { connectToMongoDB } from "@/app/lib/db";
import RoleModel from "@/app/model/roles";
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
      const defaultRole = await RoleModel.findOne({ name: 'guest' });

      if (!existingUser) {
        // Create a new user if they don't exist
        const newUser = new UserModel({
          name: user.name,
          email: user.email,
          image_url: user.image,
          role: defaultRole._id
        });
        await newUser.save();
      }

      return true;
    },
    async session({ session, token, user }) {
      await connectToMongoDB(); // Ensure MongoDB is connected
      
      // Fetch the user's additional data from MongoDB
      let useSesion: any = { ...session };
      if (useSesion.user.email) {
        const userData = await UserModel.findOne({
          email: useSesion.user.email,
        }).select("role").populate('role', 'name'); // Query user role

        // Attach additional fields to the session object
        if (userData) {
            useSesion.user.user_id = userData._id; // Attach user_id to session
            useSesion.user.role = userData.role?.name; // Attach role to session
        }
      }
      // You can add extra fields to session here
      return useSesion; // Return the session object
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET, // Set your own secret
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
