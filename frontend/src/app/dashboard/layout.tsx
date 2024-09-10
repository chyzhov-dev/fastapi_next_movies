"use client";

import type { ReactNode } from "react";
import { Sidebar } from "./components/sidebar/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeSwitch } from "@/components/theme-switch";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "../auth/providers/auth-provider";

const queryClient = new QueryClient();

export default function ({ children }: Readonly<{ children: ReactNode }>) {
  const { logout } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <div className={"hidden md:block"}>
        <Sidebar />
      </div>

      <main className={"ml-[50px] p-2"}>
        <nav
          className={
            "mb-2 flex w-full items-center justify-end gap-2 rounded-lg border-b px-2 py-2"
          }
        >
          <ThemeSwitch />
          <Button variant="outline" size="icon" onClick={logout}>
            <LogOut className={"h-[1.2rem] w-[1.2rem]"} />
          </Button>
        </nav>

        {children}
      </main>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
