import React from "react";
import { Card } from "./ui/card";

const ProtectedPage = () => {
  return (
    <div className="w-full h-[380px] p-4 md:p-6">
      <Card className="@container/card bg-card flex flex-col items-center justify-center w-full h-full gap-8 select-none">
        <div className="text-center flex flex-col gap-2 p-2">
          <h1 className="text-3xl">You can&apos;t access this section</h1>
          <p className="text-muted-foreground text-center">
            You need to be an admin to access this section
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ProtectedPage;
