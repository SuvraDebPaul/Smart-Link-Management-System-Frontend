import {
  Activity,
  BarChart3,
  Globe2,
  Link2,
  Sparkles,
  Zap,
} from "lucide-react";

const stats = [
  {
    label: "Links Created",
    value: "10K+",
    description: "Smart branded links generated",
    icon: Link2,
    gradient: "from-cyan-400 to-blue-600",
    glow: "shadow-cyan-500/20",
  },
  {
    label: "Clicks Tracked",
    value: "100K+",
    description: "Real-time visitor insights",
    icon: BarChart3,
    gradient: "from-emerald-400 to-cyan-600",
    glow: "shadow-emerald-500/20",
  },
  {
    label: "Custom Domains",
    value: "500+",
    description: "Trusted branded domains",
    icon: Globe2,
    gradient: "from-violet-400 to-indigo-600",
    glow: "shadow-violet-500/20",
  },
  {
    label: "API Ready",
    value: "24/7",
    description: "Developer-friendly link API",
    icon: Activity,
    gradient: "from-amber-400 to-orange-600",
    glow: "shadow-amber-500/20",
  },
];

export function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_90%_10%,rgba(99,102,241,0.14),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.12),transparent_35%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-bold text-primary">
              <Sparkles className="size-4" />
              Platform Highlights
            </div>

            <h2 className="mt-4 max-w-2xl text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              Built for fast sharing and powerful tracking
            </h2>
          </div>

          <p className="max-w-md text-base leading-7 text-slate-600">
            A colorful link management platform for creators, marketers,
            businesses, and developers.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div
                className={`absolute -right-10 -top-10 size-32 rounded-full bg-gradient-to-br ${item.gradient} opacity-15 blur-2xl transition group-hover:opacity-25`}
              />

              <div
                className={`mb-6 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg ${item.glow}`}
              >
                <item.icon className="size-7" />
              </div>

              <p className="text-4xl font-black tracking-tight text-slate-950">
                {item.value}
              </p>

              <p className="mt-2 text-base font-bold text-slate-800">
                {item.label}
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {item.description}
              </p>

              <div className="mt-6 h-2 overflow-hidden rounded-xl bg-slate-100">
                <div
                  className={`h-full w-3/4 rounded-xl bg-gradient-to-r ${item.gradient}`}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-800 p-5 text-white shadow-2xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600">
                <Zap className="size-6" />
              </div>

              <div>
                <p className="text-lg font-black">
                  Create your first smart link in seconds
                </p>
                <p className="text-sm text-slate-300">
                  Shorten links, generate QR codes, and start tracking clicks.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-cyan-200">
              No complicated setup required
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
