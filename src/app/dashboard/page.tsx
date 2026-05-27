import {
  BarChart3,
  Globe2,
  KeyRound,
  Layers3,
  Link2,
  MousePointerClick,
  TrendingUp,
  Users,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const overviewStats = [
  {
    label: "Total Links",
    value: "128",
    description: "All created short links",
    icon: Link2,
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    label: "Total Clicks",
    value: "24,891",
    description: "Across all links",
    icon: MousePointerClick,
    gradient: "from-emerald-500 to-cyan-600",
  },
  {
    label: "Campaigns",
    value: "16",
    description: "Active marketing campaigns",
    icon: BarChart3,
    gradient: "from-violet-500 to-purple-600",
  },
  {
    label: "Bio Pages",
    value: "4",
    description: "Public profile pages",
    icon: Layers3,
    gradient: "from-amber-500 to-orange-600",
  },
];

const quickActions = [
  {
    title: "Create Short Link",
    description: "Shorten a URL with alias, password, expiry and QR.",
    icon: Link2,
    href: "/dashboard/links/create",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    title: "Add Custom Domain",
    description: "Connect your own branded domain for trusted links.",
    icon: Globe2,
    href: "/dashboard/domains",
    gradient: "from-emerald-500 to-cyan-600",
  },
  {
    title: "Create API Key",
    description: "Generate API keys for automation and integrations.",
    icon: KeyRound,
    href: "/dashboard/api-keys",
    gradient: "from-violet-500 to-purple-600",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl">
        <div className="relative">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.24),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.26),transparent_34%),radial-gradient(circle_at_50%_90%,rgba(16,185,129,0.16),transparent_35%)]" />

          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-cyan-300">
                Welcome to Smart Link
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
                Manage your links, campaigns, domains and analytics.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                This dashboard will connect to your backend step by step. Today
                we are building the layout and protected route first.
              </p>
            </div>

            <Button className="h-12 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 px-6 font-bold text-white shadow-xl shadow-cyan-500/25">
              Create New Link
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map((item) => (
          <Card
            key={item.label}
            className="group overflow-hidden rounded-[2rem] border-slate-200 bg-white shadow-xl shadow-slate-200/70 transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <CardContent className="relative p-6">
              <div
                className={`absolute -right-10 -top-10 size-32 rounded-full bg-gradient-to-br ${item.gradient} opacity-15 blur-2xl transition group-hover:opacity-25`}
              />

              <div
                className={`mb-5 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg`}
              >
                <item.icon className="size-7" />
              </div>

              <p className="text-4xl font-black tracking-tight text-slate-950">
                {item.value}
              </p>

              <p className="mt-2 text-base font-black text-slate-800">
                {item.label}
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[2rem] border-slate-200 bg-white shadow-xl shadow-slate-200/70">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-950">
                  Clicks Overview
                </h3>
                <p className="text-sm text-slate-500">Last 7 days</p>
              </div>

              <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-600">
                +18.4%
              </div>
            </div>

            <div className="flex h-72 items-end gap-3 rounded-[1.5rem] bg-slate-50 p-5">
              {[48, 76, 58, 96, 72, 118, 104].map((height, index) => (
                <div
                  key={index}
                  className="flex flex-1 flex-col items-center gap-3"
                >
                  <div className="flex h-56 w-full items-end rounded-full bg-white p-1 shadow-inner">
                    <div
                      className="w-full rounded-full bg-gradient-to-t from-cyan-500 to-blue-600"
                      style={{ height }}
                    />
                  </div>

                  <span className="text-xs font-bold text-slate-500">
                    {["M", "T", "W", "T", "F", "S", "S"][index]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-slate-200 bg-white shadow-xl shadow-slate-200/70">
          <CardContent className="p-6">
            <h3 className="text-xl font-black text-slate-950">Quick Actions</h3>

            <p className="mt-1 text-sm text-slate-500">
              Start managing your platform faster.
            </p>

            <div className="mt-6 space-y-4">
              {quickActions.map((item) => (
                <div
                  key={item.title}
                  className="group rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg`}
                    >
                      <item.icon className="size-6" />
                    </div>

                    <div>
                      <p className="font-black text-slate-950">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-[2rem] border-slate-200 bg-white shadow-xl shadow-slate-200/70 lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-xl font-black text-slate-950">
              Recent Smart Links
            </h3>

            <div className="mt-6 space-y-4">
              {[
                "https://shortenlink.com/launch",
                "https://shortenlink.com/profile",
                "https://shortenlink.com/offer",
              ].map((url) => (
                <div
                  key={url}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-black text-primary">{url}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      https://example.com/very-long-destination-url
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                    <TrendingUp className="size-4" />
                    342 clicks
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-slate-200 bg-gradient-to-br from-cyan-50 via-white to-violet-50 shadow-xl shadow-slate-200/70">
          <CardContent className="p-6">
            <Users className="mb-4 size-10 text-primary" />

            <h3 className="text-xl font-black text-slate-950">
              Audience Summary
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Your audience analytics will show country, device, browser, and
              referrer data after backend integration.
            </p>

            <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-3xl font-black text-slate-950">68%</p>
              <p className="text-sm font-bold text-slate-500">
                Mobile visitors
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
