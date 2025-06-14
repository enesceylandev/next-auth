"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { signIn } from "next-auth/react";
import React from "react";

const Login = () => {
  return (
    <div className="w-full h-full p-4 md:p-6" data-testid="login-component">
      <Card className="@container/card bg-card flex flex-col items-center justify-center w-full h-full gap-8 select-none">
        <div className="text-center flex flex-col gap-2 p-2">
          <h1 className="text-3xl" data-testid="login-title">
            You are not logged in
          </h1>
          <p className="text-muted-foreground text-center">
            Please log in to access your account and continue.
          </p>
        </div>
        <Button
          variant="outline"
          className="cursor-pointer"
          size="lg"
          onClick={() => signIn("auth0")}
          data-testid="login-button"
        >
          Login with Auth0
        </Button>
      </Card>
    </div>
  );
};

export default Login;
