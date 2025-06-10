import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/store";
import { auth0 } from "@/lib/auth0";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Kayra Export - Test Case Solution",
  description: "Test Case solution for Kayra Export",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth0.getSession();
  const user = session?.user ?? null;
  return (
    <html lang="en">
      <body className={`dark ${inter.className} antialiased`}>
        <StoreProvider initialUser={user}>{children}</StoreProvider>
      </body>
    </html>
  );
}
