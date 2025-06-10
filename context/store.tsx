"use client";
import { createContext, useState } from "react";
import { User } from "@auth0/nextjs-auth0/types";

export interface StoreContext {
  user: User | null;
  setUser: (user: User | null) => void;
}

const initialState: StoreContext = {
  user: null,
  setUser: () => null,
};

export const StoreContext = createContext<StoreContext>(initialState);

export function StoreProvider({
  children,
  initialUser,
}: React.PropsWithChildren<{
  children: React.ReactNode;
  initialUser: User | null;
}>) {
  const [user, setUser] = useState<User | null>(initialUser);

  const value = {
    user,
    setUser,
  };
  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}
