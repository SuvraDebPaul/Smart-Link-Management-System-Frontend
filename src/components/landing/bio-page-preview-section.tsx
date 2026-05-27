import {
  CheckCircle2,
  ExternalLink,
  MousePointerClick,
  Palette,
  Share2,
  Sparkles,
} from "lucide-react";
import { AiOutlineYoutube } from "react-icons/ai";
import { CiLinkedin } from "react-icons/ci";
import { FaInstagram } from "react-icons/fa";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const benefits = [
  "Create a public link-in-bio page",
  "Add unlimited important links",
  "Track page visits and link clicks",
  "Customize slug, colors, and profile",
];

const bioLinks = [
  {
    label: "Visit My Website",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    label: "Book a Consultation",
    gradient: "from-emerald-500 to-cyan-600",
  },
  {
    label: "Download Free Guide",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    label: "Join Newsletter",
    gradient: "from-amber-500 to-orange-600",
  },
];

export function BioPagePreviewSection() {
  return (
    <section className="relative overflow-hidden bg-[#061A2F] py-24 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.24),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.26),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.18),transparent_35%)]" />

      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="order-2 lg:order-1">
          <div className="relative mx-auto max-w-sm">
            <div className="absolute -inset-5 -z-10 rounded-[3rem] bg-gradient-to-br from-cyan-400/30 via-violet-500/25 to-emerald-400/25 blur-2xl" />

            <div className="rounded-[2.5rem] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur">
              <div className="rounded-[2rem] bg-gradient-to-b from-white via-cyan-50 to-violet-50 p-5 text-slate-950">
                <div className="rounded-[1.7rem] bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 p-5 text-white shadow-xl">
                  <div className="mx-auto flex size-24 items-center justify-center rounded-full border-4 border-white/30 bg-white/20 text-3xl font-black backdrop-blur">
                    SL
                  </div>

                  <div className="mt-4 text-center">
                    <h3 className="text-2xl font-black">Smart Creator</h3>
                    <p className="mt-1 text-sm text-cyan-50">
                      Digital creator, marketer, and product builder
                    </p>
                  </div>

                  <div className="mt-5 flex justify-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                      <FaInstagram className="size-5" />
                    </div>
                    <div className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                      <AiOutlineYoutube className="size-6" />
                    </div>
                    <div className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                      <CiLinkedin className="size-6" />
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {bioLinks.map((item) => (
                    <div
                      key={item.label}
                      className={`group flex items-center justify-between rounded-2xl bg-gradient-to-r ${item.gradient} px-4 py-3 text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl`}
                    >
                      <span className="text-sm font-black">{item.label}</span>
                      <ExternalLink className="size-4 opacity-80 transition group-hover:translate-x-1" />
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
                    <MousePointerClick className="mx-auto mb-1 size-4 text-cyan-600" />
                    <p className="text-lg font-black">8.2K</p>
                    <p className="text-[10px] font-bold text-slate-500">
                      Visits
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
                    <Share2 className="mx-auto mb-1 size-4 text-emerald-600" />
                    <p className="text-lg font-black">1.4K</p>
                    <p className="text-[10px] font-bold text-slate-500">
                      Shares
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
                    <Palette className="mx-auto mb-1 size-4 text-violet-600" />
                    <p className="text-lg font-black">12</p>
                    <p className="text-[10px] font-bold text-slate-500">
                      Links
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -right-6 top-12 hidden rounded-2xl bg-white px-4 py-3 text-slate-950 shadow-2xl md:block">
              <p className="text-xs font-bold text-slate-500">Public URL</p>
              <p className="font-black text-primary">/u/smart-creator</p>
            </div>

            <div className="absolute -left-6 bottom-16 hidden rounded-2xl bg-emerald-400 px-4 py-3 text-white shadow-2xl md:block">
              <p className="text-xs font-bold uppercase tracking-wide">
                Click Rate
              </p>
              <p className="text-xl font-black">+27%</p>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <Badge className="rounded-full border border-cyan-300/20 bg-white/10 px-4 py-2 text-sm font-bold text-cyan-200 hover:bg-white/10">
            <Sparkles className="mr-2 size-4" />
            Link-in-Bio Pages
          </Badge>

          <h2 className="mt-5 max-w-2xl text-4xl font-black tracking-tight text-white md:text-5xl">
            One colorful page for{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300 bg-clip-text text-transparent">
              all your important links
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Build a public profile page where visitors can discover your
            website, social profiles, offers, products, campaigns, and contact
            links.
          </p>

          <div className="mt-8 space-y-4">
            {benefits.map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
                  <CheckCircle2 className="size-5" />
                </div>

                <span className="text-base font-bold text-slate-100">
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button className="h-12 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 px-6 text-base font-bold text-white shadow-xl shadow-cyan-500/25 hover:from-cyan-400 hover:via-blue-600 hover:to-violet-500">
              Create Bio Page
            </Button>

            <Button
              variant="outline"
              className="h-12 rounded-2xl border-white/20 bg-white/10 px-6 text-base font-bold text-white backdrop-blur hover:bg-white/20 hover:text-white"
            >
              View Demo Page
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
