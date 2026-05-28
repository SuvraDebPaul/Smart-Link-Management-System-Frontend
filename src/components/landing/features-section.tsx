import {
  BarChart3,
  CalendarClock,
  Globe2,
  KeyRound,
  Link2,
  LockKeyhole,
  MousePointerClick,
  QrCode,
  Sparkles,
  Tags,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Container from "../reusable/Container";

const features = [
  {
    title: "Smart Short Links",
    description:
      "Create clean and shareable links for campaigns, products, social posts, and business promotions.",
    icon: Link2,
    gradient: "from-cyan-400 to-blue-600",
    bg: "bg-cyan-50",
    text: "text-cyan-700",
  },
  {
    title: "Custom Alias",
    description:
      "Use memorable branded aliases instead of random short codes for better trust and recall.",
    icon: Tags,
    gradient: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
  {
    title: "Password Protection",
    description:
      "Protect private links with password verification before redirecting visitors.",
    icon: LockKeyhole,
    gradient: "from-emerald-400 to-green-600",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  {
    title: "Expiration Control",
    description:
      "Set expiry dates for limited-time offers, launch pages, private files, and temporary campaigns.",
    icon: CalendarClock,
    gradient: "from-violet-400 to-purple-600",
    bg: "bg-violet-50",
    text: "text-violet-700",
  },
  {
    title: "Campaign Tracking",
    description:
      "Group links by campaign and understand which marketing channel performs best.",
    icon: BarChart3,
    gradient: "from-amber-400 to-orange-600",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  {
    title: "Custom Domains",
    description:
      "Use your own branded domain for professional, trusted, and recognizable short links.",
    icon: Globe2,
    gradient: "from-teal-400 to-cyan-600",
    bg: "bg-teal-50",
    text: "text-teal-700",
  },
  {
    title: "QR Codes",
    description:
      "Generate QR-friendly short links for flyers, events, packaging, restaurants, and offline marketing.",
    icon: QrCode,
    gradient: "from-pink-400 to-rose-600",
    bg: "bg-pink-50",
    text: "text-pink-700",
  },
  {
    title: "Developer API",
    description:
      "Create and manage short links from your own apps using secure API keys and automation workflows.",
    icon: KeyRound,
    gradient: "from-slate-700 to-slate-950",
    bg: "bg-slate-100",
    text: "text-slate-800",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative overflow-hidden bg-[#061A2F] text-white py-16">
      <Container>
        <div className="">
          <Badge className="rounded-full border border-cyan-200/20 bg-white/10 p-4 text-sm font-bold text-cyan-200 hover:bg-white/10">
            <Sparkles className="mr-2 size-4" />
            Powerful Features
          </Badge>

          <h2 className="mt-5 text-4xl font-black text-white md:text-5xl">
            Everything you need to manage{" "}
            <span className="bg-linear-to-r from-cyan-300 via-emerald-300 to-amber-300 bg-clip-text text-transparent">
              smarter links
            </span>
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-300">
            Smart Link gives you colorful, secure, branded, and trackable link
            tools from one modern dashboard.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="group relative overflow-hidden rounded-xl border-white/10 bg-white/90 text-slate-950 shadow-2xl shadow-black/20 transition duration-300 hover:-translate-y-2 hover:shadow-cyan-500/20"
            >
              <CardContent className="relative p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div
                    className={`flex size-14 items-center justify-center rounded-xl bg-linear-to-br ${feature.gradient} text-white shadow-lg`}
                  >
                    <feature.icon className="size-8" />
                  </div>

                  <div className="flex size-8 items-center justify-center rounded-md bg-slate-300 text-xs font-black text-slate-800">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>

                <h3 className="text-xl font-bold tracking-tight text-slate-950">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>

                <div className="mt-6 flex items-center gap-2">
                  <div
                    className={`rounded-full ${feature.bg} px-3 py-1 text-xs font-bold ${feature.text}`}
                  >
                    Included
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-primary ml-4">
                    <MousePointerClick className="size-4" />
                    Easy setup
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 overflow-hidden rounded-xl border border-white/10 bg-white/20 p-4 backdrop-blur">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <h3 className="text-2xl font-black text-white">
                From simple short links to advanced branded campaigns
              </h3>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
                Start with a basic link, then add custom alias, password,
                expiration, QR code, campaign tracking, API access, and custom
                domains as your project grows.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {["Shorten", "Protect", "Track", "Grow"].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/10 bg-white/90 px-4 py-3 text-center text-sm font-black text-slate-950"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
