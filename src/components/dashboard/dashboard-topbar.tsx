"use client";

import { useEffect, useState } from "react";
import { Bell, Menu, Plus, Search, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authStorage } from "@/lib/auth-storage";
import type { TUser } from "@/types/auth.type";

type TDashboardTopbarProps = {
  onMenuClick: () => void;
};

export function DashboardTopbar({ onMenuClick }: TDashboardTopbarProps) {
  const [user, setUser] = useState<TUser | null>(null);

  useEffect(() => {
    setUser(authStorage.getUser());
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-2xl">
      <div className="flex h-18 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="rounded-2xl lg:hidden"
          >
            <Menu className="size-6" />
          </Button>

          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-950">
              Dashboard
            </h1>
            <p className="hidden text-sm font-medium text-slate-500 sm:block">
              Manage your smart links, campaigns and analytics.
            </p>
          </div>
        </div>

        <div className="hidden max-w-md flex-1 lg:block">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search links, campaigns, domains..."
              className="h-11 rounded-2xl bg-slate-50 pl-11"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button className="hidden h-11 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 font-bold text-white shadow-lg shadow-cyan-500/20 sm:inline-flex">
            <Plus className="mr-2 size-4" />
            New Link
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-11 w-11 rounded-2xl border-slate-200 bg-white"
          >
            <Bell className="size-5 text-slate-600" />
          </Button>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
              <UserRound className="size-5" />
            </div>

            <div className="hidden sm:block">
              <p className="max-w-32 truncate text-sm font-black text-slate-950">
                {user?.name || "User"}
              </p>
              <p className="max-w-32 truncate text-xs font-medium text-slate-500">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
