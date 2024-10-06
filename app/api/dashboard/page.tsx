"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function Dashboard() {
  const { data: session } = useSession();

  if (!session) {
    return <p>Loading...</p>; // Add loading or redirect logic here
  }

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
        Welcome <span className="font-bold">{session.user?.name}</span>. Signed
        In As
      </p>
      <p className="font-bold mb-4">{session.user?.email}</p>
      <p className="font-bold mb-4">{session.user?.role}</p>
      <button
        className="bg-red-600 py-2 px-6 rounded-md"
        onClick={() => signOut()}
      >
        Sign out
      </button>
    </div>
  );
}
