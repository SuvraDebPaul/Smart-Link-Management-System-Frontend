"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardTopbar } from "./dashboard-topbar";
import { ProtectedRoute } from "./protected-route";
import { Button } from "@/components/ui/button";

type TDashboardLayoutShellProps = {
  children: React.ReactNode;
};

export function DashboardLayoutShell({ children }: TDashboardLayoutShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-violet-50">
        <div className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">
          <DashboardSidebar />
        </div>

        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />

            <div className="absolute inset-y-0 left-0 w-72 shadow-2xl">
              <DashboardSidebar onClose={() => setMobileSidebarOpen(false)} />
            </div>

            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute right-4 top-4 rounded-2xl bg-white text-slate-950 hover:bg-slate-100"
            >
              <X className="size-5" />
            </Button>
          </div>
        )}

        <div className="lg:pl-72">
          <DashboardTopbar onMenuClick={() => setMobileSidebarOpen(true)} />

          <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
