"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthCard } from "./components/auth-card";
import { LoginForm } from "./components/login-form";
import { RegisterForm } from "./components/register-form";

export default () => {
  return (
    <div className="min-w-screen flex min-h-screen items-center justify-center">
      <Tabs defaultValue="signin">
        <TabsList>
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        <TabsContent value="signin">
          <AuthCard
            title="Sign In"
            description="Enter your email and password below to access your account."
          >
            <LoginForm />
          </AuthCard>
        </TabsContent>
        <TabsContent value="register">
          <AuthCard
            title="Register"
            description="Enter you email and password below to create an account."
          >
            <RegisterForm />
          </AuthCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};
