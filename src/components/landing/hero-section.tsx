import {
  ArrowRight,
  BarChart3,
  Globe2,
  Link2,
  LockKeyhole,
  QrCode,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SmartShortenerCard } from "./smart-shortener-card";

const trustItems = [
  {
    label: "Custom aliases",
    icon: Link2,
    className: "bg-cyan-400/15 text-cyan-100 border-cyan-300/20",
  },
  {
    label: "Password links",
    icon: LockKeyhole,
    className: "bg-emerald-400/15 text-emerald-100 border-emerald-300/20",
  },
  {
    label: "QR code ready",
    icon: QrCode,
    className: "bg-amber-400/15 text-amber-100 border-amber-300/20",
  },
  {
    label: "Real analytics",
    icon: BarChart3,
    className: "bg-violet-400/15 text-violet-100 border-violet-300/20",
  },
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#061A2F] text-white">
      <div className="absolute inset-0 -z-20 hero-grid-bg opacity-50" />

      <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.35),transparent_25%),radial-gradient(circle_at_80%_10%,rgba(99,102,241,0.45),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(16,185,129,0.25),transparent_35%)]" />

      <div className="absolute -left-24 top-24 -z-10 size-72 rounded-full bg-cyan-400/30 blur-3xl" />
      <div className="absolute -right-24 top-40 -z-10 size-80 rounded-full bg-violet-500/30 blur-3xl" />
      <div className="absolute bottom-10 left-1/2 -z-10 size-80 -translate-x-1/2 rounded-full bg-emerald-400/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8 lg:pb-24">
        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Badge className="mb-6 rounded-full border border-cyan-300/30 bg-white/10 p-4 text-sm font-semibold text-cyan-100 backdrop-blur hover:bg-white/10">
              <Sparkles className="mr-2 size-4 text-cyan-300" />
              Smart URL shortener with branding, QR and analytics
            </Badge>

            <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              Make every link{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300 bg-clip-text text-transparent">
                shorter, smarter
              </span>{" "}
              and trackable.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              Create colorful short links with custom aliases, password
              protection, expiration dates, QR codes, campaigns, and real-time
              analytics from one powerful dashboard.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-13 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 px-7 text-base font-bold text-white  hover:from-cyan-300 hover:via-blue-500 hover:to-violet-500"
              >
                Start Shortening Free
                <ArrowRight className="ml-2 size-5" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-13 rounded-2xl border-white/20 bg-white/10 px-7 text-base font-bold text-white backdrop-blur hover:bg-white/20 hover:text-white"
              >
                View Features
              </Button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {trustItems.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold backdrop-blur ${item.className}`}
                >
                  <item.icon className="size-5" />
                  {item.label}
                </div>
              ))}
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <Zap className="mb-3 size-5 text-amber-300" />
                <p className="text-2xl font-black">Fast</p>
                <p className="text-xs font-medium text-slate-300">
                  Instant links
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <Globe2 className="mb-3 size-5 text-cyan-300" />
                <p className="text-2xl font-black">Brand</p>
                <p className="text-xs font-medium text-slate-300">
                  Custom domains
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <ShieldCheck className="mb-3 size-5 text-emerald-300" />
                <p className="text-2xl font-black">Secure</p>
                <p className="text-xs font-medium text-slate-300">
                  Protected links
                </p>
              </div>
            </div>
          </div>

          <div>
            <SmartShortenerCard />
          </div>
        </div>
      </div>
    </section>
  );
}
