"use client";

import Link from "next/link";
import { BarChart3, Code2, Link2, Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { routes } from "@/constants/route";

const navLinks = [
  {
    label: "Features",
    href: routes.features,
  },
  {
    label: "Pricing",
    href: routes.pricing,
  },
  {
    label: "API",
    href: routes.api,
  },
  {
    label: "Contact",
    href: routes.contact,
  },
];

const mobileHighlights = [
  {
    label: "Smart Links",
    icon: Link2,
  },
  {
    label: "Analytics",
    icon: BarChart3,
  },
  {
    label: "API Ready",
    icon: Code2,
  },
];

export function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#061A2F]/90 text-white shadow-xl shadow-slate-950/10 backdrop-blur-2xl">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={routes.home} className="group flex items-center gap-3">
          <div className="relative flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-600 to-violet-600 text-white shadow-lg shadow-cyan-500/25 transition group-hover:scale-105">
            <Link2 className="size-6" />
            <div className="absolute -right-1 -top-1 size-3 rounded-full bg-emerald-400 ring-2 ring-[#061A2F]" />
          </div>

          <div>
            <span className="block text-xl font-black tracking-tight">
              Smart Link
            </span>
            <span className="hidden text-xs font-semibold text-cyan-200 sm:block">
              Shorten • Brand • Track
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/10 p-1 backdrop-blur md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-bold text-slate-200 transition hover:bg-white hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="ghost"
            asChild
            className="rounded-2xl text-sm font-bold text-slate-200 hover:bg-white/10 hover:text-white"
          >
            <Link href={routes.login}>Login</Link>
          </Button>

          <Button
            asChild
            className="h-11 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 px-5 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:via-blue-600 hover:to-violet-500"
          >
            <Link href={routes.register}>
              Start Free
              <Sparkles className="ml-2 size-4" />
            </Link>
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen((value) => !value)}
          className="rounded-2xl text-white hover:bg-white/10 hover:text-white md:hidden"
        >
          {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </Button>
      </div>

      {isOpen && (
        <div className="border-t border-white/10 bg-[#061A2F] px-4 py-5 shadow-2xl md:hidden">
          <div className="space-y-2">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-2xl px-4 py-3 text-base font-bold text-slate-200 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {mobileHighlights.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/10 p-3 text-center"
              >
                <item.icon className="mx-auto mb-2 size-5 text-cyan-300" />
                <p className="text-xs font-bold text-slate-200">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              asChild
              className="h-11 rounded-2xl border-white/20 bg-white/10 font-bold text-white hover:bg-white/20 hover:text-white"
            >
              <Link href={routes.login} onClick={() => setIsOpen(false)}>
                Login
              </Link>
            </Button>

            <Button
              asChild
              className="h-11 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 font-bold text-white"
            >
              <Link href={routes.register} onClick={() => setIsOpen(false)}>
                Start Free
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
