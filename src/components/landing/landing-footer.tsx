import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Code2,
  Globe2,
  Link2,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { routes } from "@/constants/route";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: routes.features },
      { label: "Pricing", href: routes.pricing },
      { label: "API", href: routes.api },
    ],
  },
  {
    title: "Dashboard",
    links: [
      { label: "Links", href: routes.links },
      { label: "Campaigns", href: routes.campaigns },
      { label: "Analytics", href: routes.analytics },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: routes.contact },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

const footerFeatures = [
  {
    label: "Branded Links",
    icon: Link2,
  },
  {
    label: "Analytics",
    icon: BarChart3,
  },
  {
    label: "Custom Domains",
    icon: Globe2,
  },
  {
    label: "Developer API",
    icon: Code2,
  },
];

export function LandingFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#061A2F]/90 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(139,92,246,0.22),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.12),transparent_35%)]" />

      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <Link href={routes.home} className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg">
                <Link2 className="size-6" />
              </div>

              <span className="text-xl font-black tracking-tight">
                Smart Link
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">
              Shorten, brand, track, protect, and grow every link from one smart
              dashboard built for creators, teams, and developers.
            </p>

            <div className="mt-6 grid max-w-md grid-cols-2 gap-3">
              {footerFeatures.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-sm font-bold text-slate-200"
                >
                  <item.icon className="size-4 text-cyan-300" />
                  {item.label}
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <Mail className="size-4 text-cyan-300" />
                support@smartlink.com
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="size-4 text-cyan-300" />
                Built for global creators and businesses
              </div>
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-black uppercase tracking-wide text-white">
                {group.title}
              </h3>

              <div className="mt-5 space-y-3">
                {group.links.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block text-sm font-medium text-slate-300 transition hover:translate-x-1 hover:text-cyan-300"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Smart Link. All rights reserved.</p>

          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck className="size-4 text-emerald-300" />
            Secure, branded, and analytics-ready links.
          </div>
        </div>
      </div>
    </footer>
  );
}
