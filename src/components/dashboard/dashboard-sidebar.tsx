"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Globe2,
  Home,
  KeyRound,
  Layers3,
  Link2,
  LogOut,
  Megaphone,
  PanelLeftClose,
  QrCode,
  Settings,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { authStorage } from "@/lib/auth-storage";
import { cn } from "@/lib/utils";

const dashboardLinks = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Links",
    href: "/dashboard/links",
    icon: Link2,
  },
  {
    label: "Campaigns",
    href: "/dashboard/campaigns",
    icon: Megaphone,
  },
  {
    label: "Bio Pages",
    href: "/dashboard/pages",
    icon: Layers3,
  },
  {
    label: "QR Codes",
    href: "/dashboard/qr-codes",
    icon: QrCode,
  },
  {
    label: "Domains",
    href: "/dashboard/domains",
    icon: Globe2,
  },
  {
    label: "API Keys",
    href: "/dashboard/api-keys",
    icon: KeyRound,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

type TDashboardSidebarProps = {
  onClose?: () => void;
};

export function DashboardSidebar({ onClose }: TDashboardSidebarProps) {
  const pathname = usePathname();

  const handleLogout = () => {
    authStorage.clearAuth();
    window.location.href = "/auth/login";
  };

  return (
    <aside className="flex h-full flex-col border-r border-slate-200 bg-white">
      <div className="flex h-18 items-center justify-between border-b border-slate-200 px-5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 text-white shadow-lg shadow-cyan-500/25">
            <Link2 className="size-6" />
          </div>

          <div>
            <p className="text-lg font-black leading-none text-slate-950">
              Smart Link
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Dashboard
            </p>
          </div>
        </Link>

        {onClose && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-xl lg:hidden"
          >
            <PanelLeftClose className="size-5" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">
        <nav className="space-y-1">
          {dashboardLinks.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition",
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white shadow-lg shadow-cyan-500/20"
                    : "text-slate-600 hover:bg-cyan-50 hover:text-primary",
                )}
              >
                <item.icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-200 p-4">
        <div className="mb-4 rounded-2xl bg-gradient-to-br from-cyan-50 via-white to-violet-50 p-4">
          <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
            <UserRound className="size-5" />
          </div>

          <p className="text-sm font-black text-slate-950">Free Plan</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Upgrade later for custom domains, API limits, and advanced
            analytics.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleLogout}
          className="h-11 w-full rounded-2xl border-slate-200 font-bold text-slate-700 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="mr-2 size-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
