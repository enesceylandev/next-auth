import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import React from "react";
import data from "@/lib/data.json";

const Dashboard = () => {
  return (
    <div className="flex flex-col w-full gap-4 md:gap-6 my-4 md:mt-6">
      <SectionCards />
      <DataTable data={data} />
    </div>
  );
};

export default Dashboard;
