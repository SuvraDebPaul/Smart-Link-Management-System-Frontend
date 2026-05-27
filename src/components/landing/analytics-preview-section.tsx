import {
  BarChart3,
  Globe2,
  MousePointerClick,
  Smartphone,
  TrendingUp,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const analyticsCards = [
  {
    label: "Total Clicks",
    value: "24,891",
    description: "Tracked across all smart links",
    icon: MousePointerClick,
    gradient: "from-cyan-400 to-blue-600",
    bg: "bg-cyan-50",
    text: "text-cyan-700",
  },
  {
    label: "Unique Visitors",
    value: "12,340",
    description: "Real people visiting your links",
    icon: Users,
    gradient: "from-emerald-400 to-green-600",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  {
    label: "Mobile Traffic",
    value: "68%",
    description: "Visitors from mobile devices",
    icon: Smartphone,
    gradient: "from-violet-400 to-indigo-600",
    bg: "bg-violet-50",
    text: "text-violet-700",
  },
  {
    label: "Growth Rate",
    value: "+32%",
    description: "Campaign performance increase",
    icon: TrendingUp,
    gradient: "from-amber-400 to-orange-600",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
];

const barData = [
  { day: "Mon", value: 48, gradient: "from-cyan-400 to-blue-600" },
  { day: "Tue", value: 76, gradient: "from-emerald-400 to-cyan-600" },
  { day: "Wed", value: 58, gradient: "from-blue-400 to-indigo-600" },
  { day: "Thu", value: 96, gradient: "from-violet-400 to-purple-600" },
  { day: "Fri", value: 72, gradient: "from-amber-400 to-orange-600" },
  { day: "Sat", value: 118, gradient: "from-pink-400 to-rose-600" },
  { day: "Sun", value: 104, gradient: "from-teal-400 to-cyan-600" },
];

const trafficSources = [
  {
    name: "Bangladesh",
    value: "42%",
    color: "bg-cyan-500",
  },
  {
    name: "India",
    value: "26%",
    color: "bg-emerald-500",
  },
  {
    name: "United States",
    value: "18%",
    color: "bg-violet-500",
  },
  {
    name: "Others",
    value: "14%",
    color: "bg-amber-500",
  },
];

export function AnalyticsPreviewSection() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(139,92,246,0.14),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.12),transparent_35%)]" />

      <div className="mx-auto grid max-w-7xl items-start gap-14 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div>
          <Badge className="rounded-full border border-cyan-500 bg-cyan-50 p-4 text-sm font-bold text-primary hover:bg-cyan-50">
            <BarChart3 className="mr-2 size-4" />
            Real-time Analytics
          </Badge>

          <h2 className="mt-5 max-w-2xl text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            Track every click with{" "}
            <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 bg-clip-text text-transparent">
              colorful insights
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Understand your audience with click trends, countries, devices,
            browsers, referrers, and campaign performance from one beautiful
            dashboard.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {analyticsCards.map((item) => (
              <Card
                key={item.label}
                className="group overflow-hidden rounded-xl border-slate-200 bg-white shadow-xl shadow-slate-200/60 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <CardContent className="relative p-5">
                  <div
                    className={`absolute -right-10 -top-10 size-28 rounded-full bg-gradient-to-br ${item.gradient} opacity-15 blur-2xl transition group-hover:opacity-25`}
                  />

                  <div className="relative flex items-center gap-4">
                    <div
                      className={`flex size-13 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg`}
                    >
                      <item.icon className="size-6" />
                    </div>

                    <div>
                      <p className="text-3xl font-black tracking-tight text-slate-950">
                        {item.value}
                      </p>
                      <p className="text-sm font-bold text-slate-700">
                        {item.label}
                      </p>
                    </div>
                  </div>

                  <p className="relative mt-4 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-xl bg-gradient-to-br from-cyan-300/30 via-blue-400/20 to-violet-400/30 blur-2xl" />

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-800 p-4 shadow-2xl">
            <div className="rounded-xl bg-white p-5 shadow-xl">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                      <MousePointerClick className="size-5" />
                    </div>
                    <h3 className="text-xl font-black text-slate-950">
                      Clicks Overview
                    </h3>
                  </div>

                  <p className="text-sm font-medium text-slate-500">
                    Last 7 days performance
                  </p>
                </div>

                <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-600">
                  +18.4% Growth
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <div className="flex h-64 items-end gap-3">
                  {barData.map((item) => (
                    <div
                      key={item.day}
                      className="flex flex-1 flex-col items-center gap-3"
                    >
                      <div className="flex h-52 w-full items-end rounded-full bg-white p-1 shadow-inner">
                        <div
                          className={`w-full rounded-full bg-gradient-to-t ${item.gradient} shadow-lg transition duration-300 hover:scale-105`}
                          style={{ height: item.value }}
                        />
                      </div>

                      <span className="text-xs font-bold text-slate-500">
                        {item.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <Globe2 className="size-5 text-cyan-600" />
                    <p className="font-black text-slate-950">Top Countries</p>
                  </div>

                  <div className="space-y-4">
                    {trafficSources.map((source) => (
                      <div key={source.name}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="font-semibold text-slate-600">
                            {source.name}
                          </span>
                          <span className="font-black text-slate-950">
                            {source.value}
                          </span>
                        </div>

                        <div className="h-2 rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${source.color}`}
                            style={{ width: source.value }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-cyan-50 via-blue-50 to-violet-50 p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <Smartphone className="size-5 text-violet-600" />
                    <p className="font-black text-slate-950">Device Split</p>
                  </div>

                  <div className="flex items-center justify-center py-3">
                    <div className="relative flex size-32 items-center justify-center rounded-full bg-[conic-gradient(#06b6d4_0deg_245deg,#8b5cf6_245deg_315deg,#f59e0b_315deg_360deg)]">
                      <div className="flex size-20 items-center justify-center rounded-full bg-white text-center">
                        <div>
                          <p className="text-2xl font-black text-slate-950">
                            68%
                          </p>
                          <p className="text-xs font-bold text-slate-500">
                            Mobile
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-bold">
                    <div className="rounded-xl bg-white px-2 py-2 text-cyan-700">
                      Mobile
                    </div>
                    <div className="rounded-xl bg-white px-2 py-2 text-violet-700">
                      Desktop
                    </div>
                    <div className="rounded-xl bg-white px-2 py-2 text-amber-700">
                      Tablet
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -right-5 -top-5 hidden rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 px-5 py-4 text-white shadow-2xl md:block">
            <p className="text-xs font-bold uppercase tracking-wide">
              Live Data
            </p>
            <p className="text-xl font-black">Real-time</p>
          </div>
        </div>
      </div>
    </section>
  );
}
