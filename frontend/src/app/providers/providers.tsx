"use client";

import { PropsWithChildren } from "react";
import { CookiesProvider } from "react-cookie";
import { AuthProvider } from ".././auth/providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./theme-provider";

type Props = PropsWithChildren<{}>;

export const Providers = ({ children }: Props) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <CookiesProvider
        defaultSetOptions={{
          path: "/",
        }}
      >
        <AuthProvider>{children}</AuthProvider>
        <Toaster expand={true} position={"top-right"} closeButton={true} />
      </CookiesProvider>
    </ThemeProvider>
  );
};
