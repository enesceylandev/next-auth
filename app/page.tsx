"use client";
import "./globals.css";
import { useSession } from "next-auth/react";
import Dashboard from "./(routes)/dashboard/page";
import Login from "./(routes)/login/page";

export default function Home() {
  const { data: session } = useSession();

  if (!session?.user) {
    return <Login />;
  } else {
    return <Dashboard />;
  }
}
