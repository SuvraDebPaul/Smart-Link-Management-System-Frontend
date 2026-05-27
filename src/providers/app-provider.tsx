"use client";

import { ReactNode } from "react";
import { QueryProvider } from "./query-provider";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

type TAppProviderProps = {
  children: ReactNode;
};

export function AppProvider({ children }: TAppProviderProps) {
  return (
    <QueryProvider>
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster richColors position="top-right" />
    </QueryProvider>
  );
}
