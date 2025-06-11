"use client";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import "./globals.css";
import { useSession, signIn } from "next-auth/react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionCards } from "@/components/section-cards";
import { DataTable } from "@/components/data-table";
import data from "@/lib/data.json";

export default function Home() {
  const { data: session } = useSession();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col">
            {!session?.user ? (
              <div className="w-full h-full p-4 md:p-6">
                <Card className="@container/card bg-card flex flex-col items-center justify-center w-full h-full gap-8 select-none">
                  <div className="text-center flex flex-col gap-2 p-2">
                    <h1 className="text-3xl">You are not logged in</h1>
                    <p className="text-muted-foreground text-center">
                      Please log in to access your account and continue.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    size="lg"
                    onClick={() => signIn("auth0")}
                  >
                    Login with Auth0
                  </Button>
                </Card>
              </div>
            ) : (
              <div className="flex flex-col w-full gap-4 md:gap-6 my-4 md:mt-6">
                <SectionCards />
                <DataTable data={data} />
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
