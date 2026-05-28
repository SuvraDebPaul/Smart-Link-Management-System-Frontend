"use client";

import Link from "next/link";
import { Link2, Menu, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { routes } from "@/constants/route";
import { cn } from "@/lib/utils";
import Container from "../reusable/Container";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";

interface NavItem {
  label: string;
  href: string;
}

const navLinks: NavItem[] = [
  { label: "Features", href: routes.features },
  { label: "Pricing", href: routes.pricing },
  { label: "API", href: routes.api },
  { label: "Contact", href: routes.contact },
];

export const LandingNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="py-4 bg-[#041421] sticky top-0 z-10">
      <Container className="flex justify-between">
        <NavBrand></NavBrand>
        <DesktopNavigation></DesktopNavigation>
        <DesktopActions></DesktopActions>
        <MobileNavigation isOpen={isOpen} setIsOpen={setIsOpen} />
      </Container>
    </header>
  );
};

// --- NavBrand ---
const NavBrand = () => {
  return (
    <Link href={routes.home} className="group flex items-center gap-3">
      <div className="group relative flex size-11 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/25 transition group-hover:scale-105">
        <Link2 className="size-6" />
        <div className="absolute -right-1 -top-1 size-3 rounded-full bg-secondary ring-2 ring-[#061A2F]" />
      </div>

      <div>
        <span className="block text-xl font-bold text-background">
          Smart Link
        </span>
        <span className="hidden text-xs tracking-wider text-secondary sm:block">
          Shorten • Brand • Track
        </span>
      </div>
    </Link>
  );
};

// --- DesktopNavigation ---
const DesktopNavigation = () => {
  return (
    <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/10 p-1 backdrop-blur md:flex">
      {navLinks.map((item) => (
        <NavbarLink key={item.href} href={item.href}>
          {item.label}
        </NavbarLink>
      ))}
    </nav>
  );
};

const NavbarLink = ({
  href,
  children,
  className,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-semibold text-slate-200 transition duration-300 hover:bg-white hover:text-slate-950",
        className,
      )}
    >
      {children}
    </Link>
  );
};

// --- DesktopActions ---
const DesktopActions = () => {
  return (
    <div className="hidden items-center gap-3 md:flex">
      <Button
        variant={"ghost"}
        className="h-10 border-white/10 px-6 text-slate-200 rounded-full hover:text-slate-950 transition duration-300 font-semibold bg-white/10"
        asChild
      >
        <Link href={routes.login}>Login</Link>
      </Button>
      <Button
        className="h-10 rounded-full px-6 transition duration-300 font-semibold bg-linear-to-br from-emerald-500 to-cyan-700 hover:from-emerald-600 hover:to-cyan-800"
        asChild
      >
        <Link href={routes.register}>
          Start Free
          <Sparkles className="ml-2 size-4" />
        </Link>
      </Button>
    </div>
  );
};

// --- MobileNavigation ---

const MobileNavigation = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-xl text-white hover:bg-white/10 hover:text-white md:hidden"
        >
          <Menu className="size-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-75 border-white/10 bg-[#061A2F] p-0 text-white sm:w-90"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

        <div className="border-b border-white/10 px-5 py-5">
          <NavBrand />
        </div>

        <div className="px-5 py-6">
          <div className="space-y-2">
            {navLinks.map((item) => (
              <NavbarLink
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-2xl px-4 py-3 text-base hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </NavbarLink>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
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
              className="h-11 rounded-2xl bg-cyan-800 font-bold text-white shadow-lg shadow-cyan-500/25 hover:bg-cyan-700"
            >
              <Link href={routes.register} onClick={() => setIsOpen(false)}>
                Start Free
                <Sparkles className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
