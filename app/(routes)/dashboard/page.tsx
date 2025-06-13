"use client";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import React from "react";
import data from "@/lib/data/tableData.json";
import { useSession } from "next-auth/react";
import ProtectedPage from "@/components/ProtectedPage";

const Dashboard = () => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col w-full gap-4 md:gap-6 my-4 md:mt-6">
      {session?.user.roles.includes("Admin") ? (
        <SectionCards />
      ) : (
        <ProtectedPage />
      )}
      <DataTable data={data} />
    </div>
  );
};

export default Dashboard;
